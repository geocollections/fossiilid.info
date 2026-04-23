import type {
  Circle,
  FeatureGroup,
  LeafletMouseEvent,
  Polygon,
  Rectangle,
} from "leaflet";

import { FullScreen } from "leaflet.fullscreen";

export function useMapInit(selectedArea: Ref<Circle | Rectangle | Polygon | undefined>, state: AdvancedSearchState) {
  const { $L } = useNuxtApp();
  const drawnItems = ref<FeatureGroup>();
  const { buildPopupContent, showRecordsInSelectedArea, generatePopup }
    = useMapPopup(drawnItems, state, selectedArea);

  function getBaseLayers() {
    return $L.tileLayer(
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      {
        attribution: "...",
        subdomains: "abcd",
      },
    );
  }

  function initMap() {
    const instance = $L.map("map");

    instance.addControl(
      new FullScreen({
        position: "topleft",
      }),
    );

    instance.setView([0, 0], 1);

    // Initialise the FeatureGroup to store editable layers
    drawnItems.value = $L.featureGroup();
    instance.addLayer(drawnItems.value);

    // Initialise Leaflet-Geoman
    if (!isMobile()) {
      instance.pm.addControls({
        position: "topleft",
        drawCircleMarker: false,
        drawMarker: false,
        drawPolyline: false,
        drawCircle: false, // Disabled temporarily because doesn't work
        drawPolygon: false, // Disabled for same reason
        drawText: false,
        editControls: false,
      });
    }

    instance.pm.setGlobalOptions({
      allowSelfIntersection: false,
      snappable: false,
    });
    instance.pm.setPathOptions({
      color: "#bada55",
    });

    instance.on("pm:create", ({ layer }) => {
      if (instance === undefined) {
        return;
      }

      drawnItems.value?.addLayer(layer);
      generatePopup(layer as Circle | Rectangle | Polygon, [0, 0], instance);
      layer.on("click", (e: LeafletMouseEvent) => {
        instance?.closePopup();

        buildPopupContent(e.target as Circle | Rectangle | Polygon, instance)
          .then((content) => {
            const shape = e.target as Circle | Rectangle | Polygon;
            const latlng = shape.getBounds().getCenter();
            shape.getPopup()?.setLatLng(latlng);
            shape.setPopupContent(content);
          })
          .catch(() => {

          })
        ;
      });
      layer.openPopup();
      const numberOfDrawnLayers = drawnItems.value?.getLayers().length ?? 0;

      if (numberOfDrawnLayers < 2) {
        showRecordsInSelectedArea(layer as Circle | Rectangle | Polygon);
      }
    });

    instance.addLayer(getBaseLayers());

    $L.control
      .coordinates({
        position: "bottomright",
        useLatLngOrder: true,
        enableUserInput: false,
      })
      .addTo(instance);

    return instance;
  }

  return { initMap, drawnItems };
}
