import type { Map } from "leaflet";

export const useNearMe = (map: Ref<Map | undefined>, drawnItems: Ref) => {
  const { $L } = useNuxtApp();
  const advancedSearchStore = useAdvancedSearchStore();
  const { generatePopup } = useMapPopup(drawnItems);
  const nearMeLatLng = ref();
  const circle = ref();

  const metersInKM = 1000;

  watch(
    () => advancedSearchStore.nearMeRangeInKM,
    (newRadiusInKM) => {
      if (!circle.value) {
        return;
      }

      circle.value.setRadius(newRadiusInKM * metersInKM);
    },
  );

  const drawAreaNearMe = () => {
    if (!map.value) return;

    if (circle.value) {
      circle.value.remove();
      map.value.closePopup();
    }
    if (!nearMeLatLng.value) return;
    circle.value = $L.circle(nearMeLatLng.value, {
      color: "#bada55",
      radius: advancedSearchStore.nearMeRangeInKM * 1000,
      dashArray: "4",
    });
    advancedSearchStore.setSelectedArea(circle.value);
    circle.value.on("add", ({ target }) => {
      if (!map.value) return;
      generatePopup(target, target._latlng, map.value);
    });
    circle.value.addTo(map.value);
  };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!map.value) return;

        nearMeLatLng.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        drawAreaNearMe();
        map.value.setView(
          [nearMeLatLng.value.lat, nearMeLatLng.value.lng],
          12 - advancedSearchStore.nearMeRangeInKM * 0.15,
        );
        // this_.applySearch();
      },
      (error) => {
        nearMeLatLng.value = {
          lat: 59.4,
          lng: 27.3,
        };
        drawAreaNearMe();
        map.value?.setView(
          [nearMeLatLng.value.lat, nearMeLatLng.value.lng],
          12 - advancedSearchStore.nearMeRangeInKM * 0.15,
        );
        if (error.code === error.PERMISSION_DENIED) {
          //state.errorMessage = "Geolocation is not supported by this browser.";
        }
      },
    );
  };

  return { nearMeLatLng, circle, getLocation };
};
