import type { LatLngExpression, LayerGroup } from "leaflet";
import { reactive, computed, markRaw } from "vue";

interface MapSearchResult {
  locality_id?: number;
  locality_en?: string;
  locality?: string;
  latlong?: string;
  src?: number;
}

// Leaflet objects — completely outside Vue reactivity
let layer1: LayerGroup | null = null;
let layer2: LayerGroup | null = null;
let layer3: LayerGroup | null = null;

// Only plain primitives in reactive state
const state = reactive({
  groupsInitialized: false,
  layers: {
    1: { active: true, name: "Specimen" },
    2: { active: true, name: "Taxon_occurrence" },
    3: { active: true, name: "sample + conop_distribution" },
  },
});

export function useLeafletMap() {
  const { t, locale } = useI18n();
  const store = useRootStore();
  const advancedSearchStore = useAdvancedSearchStore();
  const { $L } = useNuxtApp();

  function initGroups() {
    if (state.groupsInitialized) return;
    layer1 = markRaw($L.layerGroup([]));
    layer2 = markRaw($L.layerGroup([]));
    layer3 = markRaw($L.layerGroup([]));
    state.groupsInitialized = true;
  }

  function getLayers() {
    return { 1: layer1, 2: layer2, 3: layer3 } as const;
  }

  const groupedOverlays = computed(() => ({
    [t("map.overlay_title")]: {
      [t("map.overlay_specimens")]: layer1,
      [t("map.overlay_literature_based")]: layer2,
      [t("map.overlay_in_samples")]: layer3,
    },
  }));

  function setDefaultOverlays() {
    const map = advancedSearchStore.getMap();
    if (!map) return;
    layer1?.addTo(map);
    layer2?.addTo(map);
    layer3?.addTo(map);
  }

  function setView() {
    const map = advancedSearchStore.getMap();
    if (!map) return;
    if (store.mode === "in_global") map.setView([58.5, 20.5], 1);
    else if (store.mode === "in_estonia") map.setView([58.5, 25.5], 6);
    else map.setView([58.5, 25.5], 5);
  }

  function getCoords(string: string): LatLngExpression {
    if (!string) return [0, 0];
    const [lat, lng] = string.split(",");
    return [Number(lat), Number(lng)];
  }

  function setCustomSettings(type: number) {
    switch (type) {
      case 1:
        return {
          color: "rgba(240, 95, 37,0.7)",
          opacity: 0.7,
          weight: 6,
          zIndexOffset: 1,
        };
      case 2:
        return {
          color: "rgba(240, 85, 199,0.7)",
          opacity: 0.7,
          weight: 6,
          zIndexOffset: 2,
        };
      case 3:
        return {
          color: "rgba(245, 134, 0,0.7)",
          opacity: 0.5,
          weight: 6,
          zIndexOffset: 3,
        };
      default:
        return {};
    }
  }

  function populateLayerGroups(locations: MapSearchResult[]) {
    const map = advancedSearchStore.getMap();

    // Remove from map while populating — prevents a redraw per addLayer
    layer1?.remove();
    layer2?.remove();
    layer3?.remove();

    locations.forEach((element) => {
      if (
        !element.locality ||
        !element.locality_id ||
        !element.latlong ||
        !element.src
      )
        return;

      const layer = $L
        .circle(getCoords(element.latlong), setCustomSettings(element.src))
        .bindPopup(
          `<a target="_blank" href="https://geocollections.info/locality/${element.locality_id}">
            ${locale.value === "et" ? element.locality : element.locality_en}
          </a>`,
          { className: "custom-popup-text" },
        );

      if (element.src === 1) layer1?.addLayer(layer);
      else if (element.src === 2) layer2?.addLayer(layer);
      else if (element.src === 3) layer3?.addLayer(layer);
    });

    // Re-add to map all at once
    if (map) {
      layer1?.addTo(map);
      layer2?.addTo(map);
      layer3?.addTo(map);
    }
  }

  function resetLayerGroups() {
    layer1?.clearLayers();
    layer2?.clearLayers();
    layer3?.clearLayers();
  }

  function destroy() {
    resetLayerGroups();
    layer1 = null;
    layer2 = null;
    layer3 = null;
    state.groupsInitialized = false;
  }

  return {
    ...toRefs(state),
    getLayers,
    groupedOverlays,
    setView,
    setDefaultOverlays,
    populateLayerGroups,
    initGroups,
    resetLayerGroups,
    destroy,
  };
}
