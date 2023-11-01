// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: [
    "~/assets/scss/main.scss",
    "~/assets/css/mainpage.css",
    // "~assest/css/vue-multiselect.min.css",
    "~/assets/css/creative.css",
    "~/assets/css/fonts.css",
    "@fortawesome/fontawesome-free/css/fontawesome.css",
    "@fortawesome/fontawesome-free/css/brands.css",
    "@fortawesome/fontawesome-free/css/solid.css",
    "vue-multiselect/dist/vue-multiselect.css",
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
        {
          src: "https://unpkg.com/jquery@3.3.1/dist/jquery.min.js",
          async: true,
        },
        {
          src: "https://unpkg.com/@fancyapps/fancybox@3.4.2/dist/jquery.fancybox.min.js",
          async: true,
        },
        { src: "/js/matomo.js", async: true },
      ],
      link: [
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
    "@nuxtjs/google-fonts",
    "@vueuse/nuxt",
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
  googleFonts: {
    families: {
      Merriweather: {
        wght: [300, 400, 700, 900],
        ital: [300, 400, 700, 900],
      },
      "Open+Sans": {
        wght: [300, 400, 600, 700, 800],
        ital: [300, 400, 600, 700, 800],
      },
    },
  },
});
