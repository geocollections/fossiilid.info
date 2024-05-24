<script setup lang="ts">
import type { Map, TileLayer } from "leaflet";
import { useRootStore } from "~/stores/root";

const props = defineProps<{ mapData: any[] }>();

const state = reactive({
  tileLayer: null as TileLayer | null,
  groupControl: null,
});
const store = useRootStore();
const map = ref<Map>();
const {
  populateLayerGroups,
  initGroups,
  groupedOverlays,
  setDefaultOverlays,
  groupsInitialized,
  resetLayerGroups,
  setView,
} = useLeafletMap(map);
const { $L } = useNuxtApp();
onMounted(() => {
  loadMap();
  initGroups();
  state.groupControl = $L.control
    .groupedLayers({}, groupedOverlays.value, {})
    .addTo(map.value);
  setDefaultOverlays();
  populateLayerGroups(props.mapData);
});
watch(
  () => props.mapData,
  (newMapData) => {
    if (!groupsInitialized.value) {
      initGroups();
      state.groupControl = $L.control
        .groupedLayers({}, groupedOverlays.value, {})
        .addTo(map.value);
      setDefaultOverlays();
    }

    resetLayerGroups();
    populateLayerGroups(newMapData);
  },
  { deep: true },
);
watch(
  () => store.mode,
  () => {
    setView();
  },
);

const { locale } = useI18n();
watch(
  () => locale.value,
  () => {
    resetLayerGroups();
    populateLayerGroups(props.mapData);
    map.value?.removeControl(state.groupControl);
    state.groupControl = $L.control
      .groupedLayers({}, groupedOverlays.value, {})
      .addTo(map.value);
  },
  { immediate: false },
);

function loadMap() {
  map.value = $L.map("map", {
    fullscreenControl: true,
  });
  setView();
  state.tileLayer = $L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      minZoom: 1,
      maxZoom: 18,
      attribution:
        "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>",
    },
  );
  state.tileLayer.addTo(map.value);
}
</script>

<template>
  <div v-if="mapData" id="map" class="z-0" style="height: 300px" />
</template>

<style>
.custom-popup-text a {
  color: #f05f40;
  font-family: "Open Sans", "Helvetica Neue", Arial, sans-serif;
  font-size: 10pt;
  text-align: left;
  font-weight: 700;
}
</style>
