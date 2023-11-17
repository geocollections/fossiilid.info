import type { LatLngExpression, LayerGroup, Map } from "leaflet";
import { Ref, reactive, toRefs } from "vue";
import { useRootStore } from "~/stores/root";

type MapSearchResult = {
  locality_id?: number;
  locality_en?: string;
  locality?: string;
  latlong?: string;
  src?: number;
};
export function useLeafletMap(map: Ref<Map | undefined>) {
  const { t, locale } = useI18n();
  const store = useRootStore();
  const { $L } = useNuxtApp();
  const state = reactive({
    groupsInitialized: false,
    groupedLayers: null,
    layers: {
      1: {
        active: true,
        name: "Specimen",
        layerGroup: null as LayerGroup | null,
      },
      2: {
        active: true,
        name: "Taxon_occurrence",
        layerGroup: null as LayerGroup | null,
      },
      3: {
        active: true,
        name: "sample + conop_distribution",
        layerGroup: null as LayerGroup | null,
      },
    },
  });

  function initGroups() {
    state.layers[1].layerGroup = $L.layerGroup([]);
    state.layers[2].layerGroup = $L.layerGroup([]);
    state.layers[3].layerGroup = $L.layerGroup([]);
    state.groupsInitialized = true;
  }

  function setCustomSettings(type: number) {
    let setting = {};
    switch (type) {
      case 1:
        setting = {
          color: "rgba(240, 95, 37,0.7)",
          opacity: 0.7,
          weight: 6,
          zIndexOffset: 1,
        };
        break;
      case 2:
        setting = {
          color: "rgba(240, 85, 199,0.7)",
          opacity: 0.7,
          weight: 6,
          zIndexOffset: 2,
        };
        break;
      case 3:
        setting = {
          color: "rgba(245, 134, 0,0.7)",
          opacity: 0.5,
          weight: 6,
          zIndexOffset: 3,
        };
        break;
      default:
        break;
    }
    return setting;
  }
  const groupedOverlays = computed(() => {
    return {
      [t("map.overlay_title")]: {
        [t("map.overlay_specimens")]: state.layers[1].layerGroup,
        [t("map.overlay_literature_based")]: state.layers[2].layerGroup,
        [t("map.overlay_in_samples")]: state.layers[3].layerGroup,
      },
    };
  });
  function setDefaultOverlays() {
    if (!map.value) return;
    state.layers[1].layerGroup?.addTo(map.value);
    state.layers[2].layerGroup?.addTo(map.value);
    state.layers[3].layerGroup?.addTo(map.value);
  }
  function setView() {
    if (!map.value) return;
    if (store.mode) {
      if (store.mode === "in_global") map.value.setView([58.5, 20.5], 1);
      else if (store.mode === "in_estonia") map.value.setView([58.5, 25.5], 6);
      else map.value.setView([58.5, 25.5], 5);
    }
  }
  function getCoords(string: string): LatLngExpression {
    if (string === undefined) return [0, 0];
    let tokenizedCoords = string.split(",");
    return [Number(tokenizedCoords[0]), Number(tokenizedCoords[1])];
  }
  function populateLayerGroups(locations: MapSearchResult[]) {
    locations.forEach(function (element, index) {
      if (
        element.locality &&
        element.locality_id &&
        element.latlong &&
        element.src
      ) {
        const feature = {
          id: index,
          coords: getCoords(element.latlong),
          type: element.src,
          name: locale.value === "et" ? element.locality : element.locality_en,
          locid: element.locality_id,
        };
        const layer = $L
          .circle(feature.coords, setCustomSettings(feature.type))
          .bindPopup(
            `<a target="_blank" href="http://geocollections.info/locality/${feature.locid}">
              ${feature.name}
            </a>`,
            { className: "custom-popup-text" },
          );

        state.layers[element.src as 1 | 2 | 3].layerGroup?.addLayer(layer);
      }
    });
  }
  function resetLayerGroups() {
    state.layers[1].layerGroup?.clearLayers();
    state.layers[2].layerGroup?.clearLayers();
    state.layers[3].layerGroup?.clearLayers();
  }
  return {
    ...toRefs(state),
    setView,
    populateLayerGroups,
    initGroups,
    groupedOverlays,
    setDefaultOverlays,
    resetLayerGroups,
  };
}
