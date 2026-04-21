import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(({ vueApp, $i18n }) => {
  vueApp.directive("translate", {
    mounted(el, binding) {
      const value
        = $i18n.locale.value === "et" ? binding.value.et : binding.value.en;
      el.innerHTML = value ?? "";
    },
    getSSRProps(binding) {
      const value
        = $i18n.locale.value === "et" ? binding.value.et : binding.value.en;
      return {
        innerText: value ?? "",
      };
    },
  });
  function translate(translations) {
    return $i18n.locale.value === "et" ? translations.et : translations.en;
  }

  function getLocale() {
    return $i18n.locale.value;
  }

  return {
    provide: {
      translate,
      getLocale,
    },
  };
});
