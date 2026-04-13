<script setup lang="ts">
const drawnItems = ref();

const { map, initMap } = useMapInit(drawnItems);
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

onMounted(() => {
  initMap();
});
</script>
<template>
  <div id="map" class="z-0 h-96 lg:h-1/3" style="cursor: pointer"></div>
</template>
