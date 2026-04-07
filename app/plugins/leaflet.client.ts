import L from "leaflet";
import "leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src";
import "leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.css";
import "leaflet-groupedlayercontrol";
import "leaflet-groupedlayercontrol/dist/leaflet.groupedlayercontrol.min.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { defineNuxtPlugin } from "nuxt/app";
import FullScreen from "leaflet.fullscreen";

export default defineNuxtPlugin((_nuxtApp) => {
  return {
    provide: {
      L,
      FullScreen,
    },
  };
});
