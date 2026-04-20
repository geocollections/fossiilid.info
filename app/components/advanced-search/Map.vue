<script setup lang="ts">
import type { Circle, Map, Polygon, Rectangle } from "leaflet";
import type { AdvancedSearchState } from "~/utils/advanced-search";

const map: Ref<Map | undefined> = defineModel("map");
const drawn = defineModel("drawn");
const selectedArea: Ref<Circle | Rectangle | Polygon | undefined> = defineModel("area");
const state = defineModel<AdvancedSearchState>({ required: true });
const { initMap, drawnItems } = useMapInit(selectedArea, state.value);

onMounted(() => {
  const instance = initMap();

  drawn.value = drawnItems.value;

  map.value = markRaw(instance);
});

const { getLocation, circle, nearMeLatLng } = useNearMe(map, drawnItems, selectedArea, state.value);

watch(
  () => state.value.isNearMe,
  () => {
    if (!state.value.isNearMe) {
      circle.value.remove();
      map.value?.closePopup();
      state.value.nearMeRangeInKM = 5;
      nearMeLatLng.value = null;
      return;
    }
    state.value.isOutcrop = true;
    getLocation();
  },
);
</script>

<template>
  <div id="map" class="z-0 flex-1" style="cursor: pointer" />
</template>
