// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/scss/main.scss"],
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
    "@nuxt/ui",
    "@nuxtjs/google-fonts",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
    "@nuxt/image",
  ],
  i18n: {
    locales: [
      { code: "et", file: "et.json" },
      { code: "en", file: "en.json" },
      { code: "fi", file: "fi.json" },
      { code: "sv", file: "sv.json" },
    ],
    lazy: true,
    langDir: "lang",
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirect",
      redirectOn: "root",
    },
    // strategy: "no_prefix",
  },
  googleFonts: {
    families: {
      "Merriweather": {
        wght: [300, 400, 700, 900],
        ital: [300, 400, 700, 900],
      },
      "Open+Sans": {
        wght: [300, 400, 600, 700, 800],
        ital: [300, 400, 600, 700, 800],
      },
    },
  },
  colorMode: {
    classSuffix: "",
  },
  sitemap: {
    sitemaps: true,
    sources: ["/api/__sitemap__/urls"],
    xsl: false,
  },
  site: {
    url: "https://fossiilid.info",
    name: "Fossiilid.info",
  },
  seo: {
    redirectToCanonicalSiteUrl: true,
  },
  linkChecker: {
    enabled: false,
  },
  image: {
    providers: {
      geocollections: {
        name: "geocollections",
        provider: "~/providers/geocollections.ts",
        options: {
          baseURL: "https://files.geocollections.info/",
        },
      },
    },
  },
});
