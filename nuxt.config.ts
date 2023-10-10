// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: [
    "~/assets/scss/main.scss",
    "~/assets/css/mainpage.css",
    // "~assest/css/vue-multiselect.min.css",
    "~/assets/css/creative.css",
    "~/assets/css/fonts.css",
  ],
  app: {
    head: {
      title: "Fossiilid.info",
      meta: [
        { name: "theme-color", content: "#004393" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      ],
      script: [
        { src: "https://unpkg.com/leaflet@1.3.4/dist/leaflet.js" },
        { src: "https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js" },
        { src: "https://unpkg.com/wicket@1.3.8/wicket.js" },
        { src: "https://unpkg.com/wicket@1.3.8/wicket-leaflet.js" },
        { src: "https://unpkg.com/jquery@3.3.1/dist/jquery.min.js" },
        {
          src: "https://unpkg.com/leaflet.coordinates@0.1.5/dist/Leaflet.Coordinates-0.1.5.min.js",
        },
        {
          src: "https://unpkg.com/leaflet-groupedlayercontrol@0.6.1/dist/leaflet.groupedlayercontrol.min.js",
        },
        {
          src: "https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/Leaflet.fullscreen.min.js",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://unpkg.com/leaflet@1.3.4/dist/leaflet.css",
        },
        {
          rel: "stylesheet",
          href: "https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css",
        },
        {
          rel: "stylesheet",
          href: "https://unpkg.com/leaflet-groupedlayercontrol@0.6.1/dist/leaflet.groupedlayercontrol.min.css",
        },
        {
          rel: "stylesheet",
          href: "https://unpkg.com/leaflet.coordinates@0.1.5/dist/Leaflet.Coordinates-0.1.5.css",
        },
        {
          rel: "stylesheet",
          href: "https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic,900,900italic",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800",
        },
      ],
    },
  },
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    "@bootstrap-vue-next/nuxt",
  ],
  i18n: {
    locales: [
      { code: "et", file: "et.json" },
      { code: "en", file: "en.json" },
      { code: "fi", file: "fi.json" },
      { code: "se", file: "se.json" },
    ],
    lazy: true,
    langDir: "lang",
    defaultLocale: "en",
    strategy: "no_prefix",
  },
});
