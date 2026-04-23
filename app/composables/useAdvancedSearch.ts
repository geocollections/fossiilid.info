import type { Circle, Map, Polygon, Rectangle } from "leaflet";
import type { AdvancedSearchState } from "~/utils/advanced-search";

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
