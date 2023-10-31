export default defineNuxtPlugin(({ vueApp, $i18n }) => {
  vueApp.directive("translate", {
    mounted(el, binding) {
      let value =
        $i18n.locale.value === "et" ? binding.value.et : binding.value.en;
      el.innerHTML = value === undefined || value === null ? "" : value;
    },
    getSSRProps(binding) {
      let value =
        $i18n.locale.value === "et" ? binding.value.et : binding.value.en;
      return {
        innerText: value === undefined || value === null ? "" : value,
      };
    },
  });
  function translate(translations) {
    return $i18n.locale.value === "et" ? translations.et : translations.en;
  }
  return {
    provide: {
      translate,
    },
  };
});
