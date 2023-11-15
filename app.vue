<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRootStore } from "./stores/root";

const store = useRootStore();
const { locale, setLocale } = useI18n();
const router = useRouter();
const route = useRoute();
useHead({ bodyAttrs: { class: "bg-gray-50 dark:bg-gray-900" } });

watch(
  () => store.mode,
  (mode) => {
    router.replace({
      query: { ...route.query, mode },
    });
  },
);
watch(
  () => locale.value,
  (locale) => {
    router.replace({
      query: { ...route.query, lang: locale },
    });
  },
);
onMounted(() => {
  setLangAndMode();
});
function setLangAndMode() {
  let lang = locale.value,
    mode = store.mode;
  //check if manually set lang or mode value is correct otherwise set default

  if (route.query?.mode && checkIfModeIsCorrect(route.query.mode as string)) {
    store.mode = route.query.mode as string;
  }

  if (route.query?.lang && checkIfLangIsCorrect(route.query.lang as string)) {
    setLocale(route.query.lang as string);
  }
  // route.path
  router.replace({
    query: { mode: mode, lang: lang },
  });
}

function checkIfModeIsCorrect(mode: string) {
  let isCorrect = false;
  switch (mode) {
    case "in_estonia":
    case "in_baltoscandia":
    case "in_global":
      isCorrect = true;
      break;
    default:
      break;
  }
  return isCorrect;
}
function checkIfLangIsCorrect(lang: string) {
  let isCorrect = false;
  switch (lang) {
    case "et":
    case "en":
    case "se":
    case "fi":
      isCorrect = true;
      break;
    default:
      break;
  }
  return isCorrect;
}
</script>
