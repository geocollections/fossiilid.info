<script setup lang="ts">
import type { Map } from "leaflet";

const map: Ref<Map | undefined> = defineModel("map");
const { initMap, drawnItems } = useMapInit();

onMounted(() => {
  const instance = initMap();

  map.value = markRaw(instance);
});

const { getLocation, circle, nearMeLatLng } = useNearMe(map, drawnItems);
const advancedSearchStore = useAdvancedSearchStore();

watch(
  () => advancedSearchStore.isNearMe,
  () => {
    if (!advancedSearchStore.isNearMe) {
      circle.value.remove();
      map.value?.closePopup();
      advancedSearchStore.nearMeRangeInKM = 5;
      nearMeLatLng.value = null;
      return;
    }
    advancedSearchStore.isOutcrop = true;
    getLocation();
  },
);
</script>
<template>
  <div id="map" class="z-0 flex-1" style="cursor: pointer"></div>
</template>
