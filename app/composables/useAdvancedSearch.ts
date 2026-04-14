// @ts-expect-error no types for this package
import Wkt from "wicket/wicket";
import type { Circle, Map, Polygon, Rectangle } from "leaflet";

export const useAdvancedSearch = (map: Ref<Map | undefined>) => {
  const { $solrFetch, $L } = useNuxtApp();
  const advancedSearchStore = useAdvancedSearchStore();

  const {
    populateLayerGroups,
    initGroups,
    groupedOverlays,
    setDefaultOverlays,
    groupsInitialized,
    resetLayerGroups,
  } = useLeafletMap(map);

  function buildAutocompleteFilterSolrSearchValue(value: string) {
    const lowerFirstCh = value.charAt(0).toLowerCase();
    const upperFirstCh = value.charAt(0).toUpperCase();
    const str = value.substring(1).toLowerCase();
    return `/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`;
  }

  function buildSearchFilterQuery() {
    const result = [];
    if (advancedSearchStore.higherTaxon) {
      result.push(
        `taxon_hierarchy:${advancedSearchStore.higherTaxon.hierarchy_string}*`,
      );
    }
    if (advancedSearchStore.stratigraphy) {
      result.push(
        `stratigraphy_hierarchy:${advancedSearchStore.stratigraphy.hierarchy_string}* OR global_stratigraphy_hierarchy:${advancedSearchStore.stratigraphy.hierarchy_string}*`,
      );
    }
    if (advancedSearchStore.species) {
      result.push(
        `taxon:${buildAutocompleteFilterSolrSearchValue(
          advancedSearchStore.species,
        )}`,
      );
    }
    if (advancedSearchStore.author) {
      result.push(
        `author_year:${buildAutocompleteFilterSolrSearchValue(
          advancedSearchStore.author,
        )}`,
      );
    }
    if (advancedSearchStore.locality) {
      result.push(
        `locality:${buildAutocompleteFilterSolrSearchValue(
          advancedSearchStore.locality,
        )} OR locality_en:${buildAutocompleteFilterSolrSearchValue(
          advancedSearchStore.locality,
        )}`,
      );
    }
    if (advancedSearchStore.isOutcrop) result.push("-locality:*puurauk");

    return result;
  }

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
      reversedPairs.push(coordsPairs[coordsPairs.length - 1]);
    }

    const changedWkt =
      reversedPairs.length > 0
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
    } else {
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
      advancedSearchStore.pagination.pageSize *
        (advancedSearchStore.pagination.pageIndex - 1),
    ];
    const fl = `locality_en,locality_id,locality,latlong,src`;
    const fq = [
      ...buildSearchFilterQuery(),
      "{!collapse field=taxon}",
      "rank:[14 TO 17]",
    ];
    if (advancedSearchStore.isNearMe) {
      const nearMeArea = getFilterQueryForCircle(
        advancedSearchStore.getSelectedArea() as Circle,
      );
      fq.push(nearMeArea);
    } else if (advancedSearchStore.getSelectedArea()) {
      fq.push(
        getGeoParam(
          advancedSearchStore.getSelectedArea() as Circle | Rectangle | Polygon,
        ),
      );
    }
    const res = await $solrFetch<{
      response: { docs: MapSearchResult[]; numFound: number };
    }>(`/taxon_search`, {
      query: {
        q: "*",
        fl,
        sort: "fossil_group asc,taxon asc",
        fq,
        rows: advancedSearchStore.pagination.pageSize,
        start,
        format: "json",
      },
    });

    advancedSearchStore.$patch({ mapDataResults: res.response.docs });

    if (!groupsInitialized.value) {
      initGroups();
      $L.control.groupedLayers({}, groupedOverlays.value, {}).addTo(map.value);
      setDefaultOverlays();
    }

    resetLayerGroups();

    populateLayerGroups(advancedSearchStore.mapDataResults);
  }

  async function search() {
    const fl = `taxon_id,taxon,id,author_year,fossil_group,fossil_group_id,fad,fad_en,fad_id,lad,lad_en,lad_id,locality_en,locality_id,locality,latlong,src`;
    const fq = [
      ...buildSearchFilterQuery(),
      "{!collapse field=taxon}",
      "rank:[14 TO 17]",
    ];
    if (advancedSearchStore.isNearMe) {
      const nearMeArea = getFilterQueryForCircle(
        advancedSearchStore.getSelectedArea() as Circle,
      );
      fq.push(nearMeArea);
    } else if (advancedSearchStore.getSelectedArea()) {
      fq.push(
        getGeoParam(
          advancedSearchStore.getSelectedArea() as Circle | Rectangle | Polygon,
        ),
      );
    }
    const res = await $solrFetch<{
      response: { docs: SearchResult[]; numFound: number };
    }>(`/taxon_search`, {
      query: {
        q: "*",
        fl,
        fq,
        sort: "fossil_group asc,taxon asc",
        rows: advancedSearchStore.pagination.pageSize,
        start:
          advancedSearchStore.pagination.pageSize *
          (advancedSearchStore.pagination.pageIndex - 1),
        format: "json",
      },
    });

    advancedSearchStore.$patch({ results: res.response.docs });
    advancedSearchStore.$patch({ numberOfResults: res.response.numFound });

    fetchMapData();
  }

  return {
    search,
  };
};
