import { Ref, reactive, toRefs } from "vue";
import { useRootStore } from "~/stores/root";

export function useLeafletMap(map: Ref<any>) {
  const { t, locale } = useI18n();
  const { mode } = useRootStore();
  const state = reactive({
    groupedLayers: null,
    layers: [
      { id: 0, name: "Specimen", active: true, features: [] },
      { id: 1, name: "Taxon_occurrence", active: true, features: [] },
      {
        id: 2,
        name: "sample + conop_distribution",
        active: true,
        features: [],
      },
    ],
  });

  function initLayers() {
    state.layers.forEach((layer) => {
      let leaflatObjects = [];
      // const markerFeatures = layer.features.filter(feature => feature.type === 'circle');
      layer.features.forEach((feature) => {
        function setCustomSettings(type) {
          let setting;
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
        feature.leafletObject = L.circle(
          feature.coords,
          setCustomSettings(feature.type)
        ).bindPopup(
          feature.locid === null
            ? feature.name
            : '<a target="_blank" href="http://geocollections.info/locality/' +
                feature.locid +
                '">' +
                feature.name +
                "</a>",
          { className: "custom-popup-text" }
        );
        // if(layer.active)feature.leafletObject.addTo(this.map)

        leaflatObjects.push(feature.leafletObject);
      });
      layer.leaflatObjects = L.layerGroup(leaflatObjects);
    });
    let groupedLayers = {};
    groupedLayers[t("map.overlay_title")] = {
      [t("map.overlay_specimens")]: state.layers[0].leaflatObjects,
      [t("map.overlay_literature_based")]: state.layers[1].leaflatObjects,
      [t("map.overlay_in_samples")]: state.layers[2].leaflatObjects,
    };

    state.groupedLayers = L.control
      .groupedLayers(null, groupedLayers)
      .addTo(map.value);
    // L.control.layers(null, groupedLayers,{'autoZIndex':true,'collapsed':true,'sortLayers':true}).addTo(this.map);
  }
  function resetLayers() {
    if (state.groupedLayers) {
      for (let i = 0; i < state.layers.length; i++) {
        map.value.removeLayer(state.layers[i].leaflatObjects);
      }
      map.value.removeControl(state.groupedLayers);

      state.layers = [
        { id: 0, name: "Specimen", active: true, features: [] },
        { id: 1, name: "Taxon_occurrence", active: true, features: [] },
        {
          id: 2,
          name: "sample + conop_distribution",
          active: true,
          features: [],
        },
      ];
      state.groupedLayers = null;
    }
  }
  function setView() {
    if (mode) {
      if (mode === "in_global") map.value.setView([58.5, 20.5], 1);
      else if (mode === "in_estonia") map.value.setView([58.5, 25.5], 6);
      else map.value.setView([58.5, 25.5], 5);
    }
  }
  function checkAllLayers() {
    state.layers.sort((a, b) => a.id - b.id);
    for (let i = 0; i < state.layers.length; i++) {
      if (state.layers[i].active)
        map.value.addLayer(state.layers[i].leaflatObjects);
    }
  }
  function getLocationsObject(object) {
    if (
      object === undefined ||
      object === {} ||
      object === false ||
      object.length === 0
    )
      return;
    object.forEach(function (element, index) {
      function getCoords(string) {
        if (string === undefined) return [0, 0];
        let tokenizedCoords = string.split(",");
        return [tokenizedCoords[0], tokenizedCoords[1]];
      }

      if (
        element.locality !== null &&
        element.locality_id !== null &&
        element.latlong &&
        element.latlong !== null
      ) {
        state.layers[element.src - 1].features.push({
          id: index,
          coords: getCoords(element.latlong),
          type: element.src,
          name: locale === "ee" ? element.locality : element.locality_en,
          locid: element.locality_id,
          // for sql query
          // id: index,
          // coords: [element.latitude, element.longitude],
          // type: element['1'],
          // name: (this_.$store.state.lang === 'ee' ? element.locality : element.locality_en),
          // locid: element.locid
        });
      }
    });
    return true;
  }
  return {
    ...toRefs(state),
    checkAllLayers,
    setView,
    resetLayers,
    initLayers,
    getLocationsObject,
  };
}
