import type { Circle, Map, Polygon, Rectangle } from "leaflet";
import type { AdvancedSearchState } from "~/utils/advanced-search";

// @ts-expect-error no types for this package
import Wkt from "wicket/wicket";

export function useAdvancedSearch(map: Ref<Map | undefined>, selectedArea: Ref<Circle | Polygon | Rectangle | undefined>, state: AdvancedSearchState) {
  const { $solrFetch, $L } = useNuxtApp();

  const {
    populateLayerGroups,
    initGroups,
    groupedOverlays,
    setDefaultOverlays,
    groupsInitialized,
    resetLayerGroups,
  } = useLeafletMap(map);

  function getFilterQueryForWKT(polygon: string) {
    const coordsPairs = polygon.split(",");
    let reversedPairs = [] as string[];

    // second and fourth pairs' places are changed because solr getting error
    const firstLatCoord = coordsPairs[0].replace("POLYGON((", "").split(" ")[0];
    const secondLatCoord = coordsPairs[1].split(" ")[0];

    if (Number.parseFloat(firstLatCoord) <= Number.parseFloat(secondLatCoord)) {
      const coordsPairs_ = coordsPairs.slice(1, coordsPairs.length - 1);
      reversedPairs.push(coordsPairs[0]);
      reversedPairs = reversedPairs.concat(coordsPairs_.reverse());
      reversedPairs.push(coordsPairs.at(-1));
    }

    const changedWkt
      = reversedPairs.length > 0
        ? reversedPairs.join(",")
        : coordsPairs.join(",");
    return `{!field f=latlong}isWithin(${changedWkt})`;
  }

  function getFilterQueryForCircle(circle: Circle) {
    const latlng = circle.getLatLng();
    const radius = Math.round((circle.getRadius() / 1000) * 10) / 10; // convert to km (from m) and round to 1 decmial place
    return `{!geofilt sfield=latlong}&d=${radius}&pt=${latlng.lat},${latlng.lng}`;
  }

  function getGeoParam(shape: Circle | Rectangle | Polygon) {
    if ("getRadius" in shape) {
      return getFilterQueryForCircle(shape);
    }
    else {
      const wkt = new Wkt.Wkt();
      const geojson = shape.toGeoJSON();
      const geostr = JSON.stringify(geojson);

      wkt.read(geostr);

      return getFilterQueryForWKT(wkt.write());
    }
  }

  async function fetchMapData() {
    if (!map.value) {
      return;
    }

    const start = [
      state.pagination.pageSize
      * (state.pagination.pageIndex - 1),
    ];
    const fl = `locality_en,locality_id,locality,latlong,src`;
    const fq = [
      ...buildSearchFilterQuery(state),
      "{!collapse field=taxon}",
      "rank:[14 TO 17]",
    ];
    if (state.isNearMe) {
      const nearMeArea = getFilterQueryForCircle(selectedArea.value as Circle);
      fq.push(nearMeArea);
    }
    else if (selectedArea.value) {
      fq.push(getGeoParam(selectedArea.value));
    }
    const res = await $solrFetch<{
      response: { docs: MapSearchResult[]; numFound: number };
    }>(`/taxon_search`, {
      query: {
        q: "*",
        fl,
        sort: "fossil_group asc,taxon asc",
        fq,
        rows: state.pagination.pageSize,
        start,
        format: "json",
      },
    });

    const results = res.response.docs;
    state.mapDataResults = results;

    if (!groupsInitialized.value) {
      initGroups();
      $L.control.groupedLayers({}, groupedOverlays.value, {}).addTo(map.value);
      setDefaultOverlays();
    }

    resetLayerGroups();

    populateLayerGroups(results);
  }

  async function search() {
    const fl = `taxon_id,taxon,id,author_year,fossil_group,fossil_group_id,fad,fad_en,fad_id,lad,lad_en,lad_id,locality_en,locality_id,locality,latlong,src`;
    const fq = [
      ...buildSearchFilterQuery(state),
      "{!collapse field=taxon}",
      "rank:[14 TO 17]",
    ];
    if (state.isNearMe) {
      const nearMeArea = getFilterQueryForCircle(selectedArea.value as Circle);
      fq.push(nearMeArea);
    }
    else if (selectedArea.value) {
      fq.push(getGeoParam(selectedArea.value));
    }
    const res = await $solrFetch<{
      response: { docs: SearchResult[]; numFound: number };
    }>(`/taxon_search`, {
      query: {
        q: "*",
        fl,
        fq,
        sort: "fossil_group asc,taxon asc",
        rows: state.pagination.pageSize,
        start:
          state.pagination.pageSize
          * (state.pagination.pageIndex - 1),
        format: "json",
      },
    });

    state.results = res.response.docs;
    state.numberOfResults = res.response.numFound;

    await fetchMapData();
  }

  return {
    search,
    resetLayerGroups,
  };
}
