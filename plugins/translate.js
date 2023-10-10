export default defineNuxtPlugin(({ vueApp, $i18n }) => {
  vueApp.directive("translate", function (el, binding) {
    let value =
      $i18n.locale.value === "et" ? binding.value.et : binding.value.en;
    el.innerHTML = value === undefined || value === null ? "" : value;
  });
});
