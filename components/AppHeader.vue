<template>
  <header
    class="sticky bg-gray-50/95 backdrop-blur border-b dark:bg-gray-800/95 top-0 z-10 dark:border-gray-800"
    :class="{ 'shadow-lg': state.scroll }"
  >
    <div class="container mx-auto">
      <nav class="py-2 px-4 h-14 gap-x-2 flex items-center">
        <NuxtLink class="uppercase font-bold text-2xl text-tomato" to="/">
          {{ $t("header.title") }}
        </NuxtLink>
        <USelectMenu
          class="w-80 mr-auto ml-2"
          :ui="{ width: 'w-80' }"
          :searchable="search"
          size="md"
          icon="i-heroicons-magnifying-glass-20-solid"
          :placeholder="$t('search.fossils_search')"
          @update:model-value="(taxon) => $router.push(`/${taxon.id}`)"
          by="id"
        >
          <template #option="{ option: taxa }">
            {{ taxa.name }}
          </template>
        </USelectMenu>
        <USelect
          v-model="store.mode"
          size="md"
          icon="i-heroicons-globe-europe-africa-20-solid"
          :options="modeOptions"
        />
        <USelect
          :modelValue="locale"
          size="md"
          :options="langOptions"
          icon="i-heroicons-language-20-solid"
          @update:model-value="(newLocale: string) => setLocale(newLocale)"
        />
        <UDropdown :items="pageItems">
          <UButton
            :label="$t('menu.more')"
            variant="outline"
            size="md"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          />
        </UDropdown>
        <select
          v-model="$colorMode.preference"
          class="border w-24 h-8 dark:bg-gray-900 dark:text-white dark:border-gray-700"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRootStore } from "../stores/root";

const state = reactive({
  scroll: false,
  searchResults: [],
  isLoading: false,
  selectedTaxon: null,
});
const store = useRootStore();
const router = useRoute();
const { setLocale, locale, t } = useI18n();
const { $apiFetch } = useNuxtApp();
const colorMode = useColorMode();
console.log(colorMode);

const langCode = computed(() => {
  let code = "ENG";
  switch (locale.value) {
    case "et":
      code = "EST";
      break;
    case "se":
      code = "SWE";
      break;
    case "fi":
      code = "FIN";
      break;
    default:
      break;
  }
  return code;
});

const modeOptions = computed(() => [
  {
    label: t("header.in_estonia_mode"),
    value: "in_estonia",
  },
  {
    label: t("header.in_baltoscandia_mode"),
    value: "in_baltoscandia",
  },
  {
    label: t("header.global_mode"),
    value: "in_global",
  },
]);

const langOptions = computed(() => [
  {
    label: "EST",
    value: "et",
  },
  {
    label: "ENG",
    value: "en",
  },
  {
    label: "FIN",
    value: "fi",
  },
  {
    label: "SWE",
    value: "se",
  },
]);

const pageItems = computed(() => [
  [
    { label: t("menu.fossils"), to: "/page/28" },
    { label: t("menu.collecting"), to: "/page/29" },
    { label: t("menu.identifying"), to: "/page/30" },
    { label: t("menu.geocollections"), to: "https://geocollections.info" },
  ],
]);

const modeText = computed(() => {
  if (store.mode === "in_baltoscandia") return "header.in_baltoscandia_mode";
  else if (store.mode === "in_estonia") return "header.in_estonia_mode";
  else return "header.global_mode";
});
onBeforeMount(() => {
  window.addEventListener("scroll", handleScroll);
});
function simpleTaxonSearchApiCall(value: string) {
  if (value.length < 3) state.searchResults = [];
  if (value.length > 2) {
    state.isLoading = true;
    $apiFetch(
      `/taxon/?sql=simple_taxon_search&keyword=${value}&format=json`,
    ).then((response: any) => {
      state.isLoading = false;
      state.searchResults = response.results;
    });
  }
}

async function search(value: string) {
  if (value.length < 1) return [];
  const taxa = await $apiFetch<{ results: any[] }>(
    `/taxon/?sql=simple_taxon_search&keyword=${value}&format=json`,
  );
  return taxa.results;
}

function onSelect(value: any) {
  state.selectedTaxon = null;
  location.replace("/" + value.id);
}
function displayResults(item: any) {
  return `${item.name}`;
}
function changeMode(mode: string) {
  store.mode = mode;
}
function handleScroll() {
  state.scroll = document.documentElement.scrollTop > 1;
}
</script>
