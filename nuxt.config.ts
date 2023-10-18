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
        // { src: "https://unpkg.com/wicket@1.3.8/wicket.js" },
        // { src: "https://unpkg.com/wicket@1.3.8/wicket-leaflet.js" },
        { src: "https://unpkg.com/jquery@3.3.1/dist/jquery.min.js" },
        {
          src: "https://unpkg.com/@fancyapps/fancybox@3.4.2/dist/jquery.fancybox.min.js",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic,900,900italic",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800",
        },
        {
          rel: "stylesheet",
          href: "https://unpkg.com/@fancyapps/fancybox@3.4.2/dist/jquery.fancybox.min.css",
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
