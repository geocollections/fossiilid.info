import type {
  Circle,
  FeatureGroup,
  LatLngExpression,
  Map,
  Polygon,
  Rectangle,
} from "leaflet";
import type { AdvancedSearchState } from "~/utils/advanced-search";

export function useMapPopup(drawnItems: Ref<FeatureGroup | undefined>, state: AdvancedSearchState, selectedArea: Ref<Circle | Rectangle | Polygon | undefined>) {
  const { $L, $solrFetch } = useNuxtApp();
  const { t } = useI18n();

  function resetDrawnItemsColor() {
    drawnItems.value?.setStyle({ color: "#bada55" });
  }

  const showRecordsInSelectedArea = (layer: Circle | Rectangle | Polygon) => {
    resetDrawnItemsColor();
    layer.setStyle({ color: "#ff2a12" });
    selectedArea.value = layer;
  };

  const buildPopupContent = async (
    layer: Circle | Rectangle | Polygon,
    map: Map,
  ) => {
    const geomParams = getGeoParam(layer);
    const localityRes = await $solrFetch<{ response: { numFound: number } }>(
      `/taxon_search`,
      {
        query: {
          q: "*",
          fl: "taxon",
          sort: "fossil_group asc,taxon asc",
          fq: [
            ...buildSearchFilterQuery(state),
            geomParams,
            "{!collapse field=locality}",
            "rank:[14 TO 17]",
          ],
          rows: 1,
          format: "json",
        },
      },
    );
    const taxonRes = await $solrFetch<{ response: { numFound: number } }>(
      `/taxon_search`,
      {
        query: {
          q: "*",
          fl: "taxon",
          sort: "fossil_group asc,taxon asc",
          fq: [
            ...buildSearchFilterQuery(state),
            geomParams,
            "{!collapse field=taxon}",
            "rank:[14 TO 17]",
          ],
          rows: 1,
          format: "json",
        },
      },
    );

    const numberOfDrawnLayers = drawnItems.value?.getLayers().length ?? 0;
    const rootDiv = document.createElement("div");
    const localityCountDiv = document.createElement("div");
    localityCountDiv.innerHTML = `${t(
      "advancedsearch.js_map_popup_localitycount",
    )}: <b>${localityRes.response.numFound}</b>`;

    const speciesCountDiv = document.createElement("div");
    speciesCountDiv.innerHTML = `${t(
      "advancedsearch.js_map_popup_speciescount",
    )}: <b>${taxonRes.response.numFound}</b>`;

    rootDiv.append(localityCountDiv, speciesCountDiv);

    if (numberOfDrawnLayers > 1) {
      const button = document.createElement("button");
      button.className
        = "border flex items-center px-2 py-1 rounded bg-tomato text-white";
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
        </svg>
        ${t("advancedsearch.js_map_popup_linkText")}
`;
      button.onclick = () => {
        map.closePopup();
        showRecordsInSelectedArea(layer);
      };
      rootDiv.append(button);
    }

    return rootDiv;
  };

  function generatePopup(
    layer: Circle | Polygon | Rectangle,
    latlng: LatLngExpression,
    map: Map,
  ) {
    buildPopupContent(layer, map).then((content) => {
      map.closePopup();
      const popup = $L
        .popup({
          closeOnClick: false,
          autoClose: false,
        })
        .setLatLng(latlng)
        .setContent(content);

      layer.bindPopup(popup);
      layer.openPopup();
    }).catch(() => {

    })
    ;
  }

  return { buildPopupContent, showRecordsInSelectedArea, generatePopup };
}
