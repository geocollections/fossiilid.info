<script setup lang="ts">
import { useRootStore } from "../stores/root";

const state = reactive({
  scroll: false,
  searchResults: [],
  isLoading: false,
  selectedTaxon: null,
  isOpen: false,
});
const store = useRootStore();
const { setLocale, locale, t } = useI18n();
const { $apiFetch } = useNuxtApp();
const quickSearch = ref();
const searchTerm = ref("");
const items = ref([]);

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      quickSearch.value.trigger.el.click();
    },
  },
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
    value: "sv",
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

onBeforeMount(() => {
  window.addEventListener("scroll", handleScroll);
});

async function search(value: string) {
  const taxa = await $apiFetch<{ results: any[] }>(
    `/taxon/?sql=simple_taxon_search&keyword=${value}&format=json`,
  );
  return taxa.results;
}

let currentQuery = "";

const debouncedSearch = useDebounceFn(async (value) => {
  currentQuery = value;

  const results = await search(value);

  // race condition protection
  if (currentQuery !== value) {
    return;
  }

  items.value = results;
}, 300);

watch(searchTerm, (newValue) => {
  if (!newValue) {
    return;
  }

  debouncedSearch(newValue);
});

function handleScroll() {
  state.scroll = document.documentElement.scrollTop > 1;
}
function handleLocaleChange(locale: string) {
  setLocale(locale);
}
</script>

<template>
  <header
    class="sticky top-0 z-10 border-b bg-gray-50/95 px-2 backdrop-blur transition-shadow dark:border-gray-800 dark:bg-gray-900/95"
    :class="{ 'shadow-lg': state.scroll }"
  >
    <div class="container mx-auto">
      <nav class="flex h-14 items-center gap-x-2 py-2">
        <NuxtLinkLocale
          class="text-tomato text-base font-bold uppercase md:text-lg"
          to="/"
        >
          <div>fossiilid</div>
          <div class="-mt-2 text-right text-xs">.info</div>
        </NuxtLinkLocale>
        <USelectMenu
          ref="quickSearch"
          v-model:search-term="searchTerm"
          label-key="name"
          :items="items"
          ignore-fields
          class="ml-2 w-full lg:w-80"
          size="md"
          leading-icon="i-lucide-search"
          :placeholder="$t('search.fossils_search')"
          clear-search-on-close
          name="search"
          by="id"
          @update:model-value="(taxon) => $router.push(`/${taxon.id}`)"
        >
          <template #item="{ item }">
            {{ item.name }}
          </template>
          <template #trailing>
            <div class="flex items-center gap-0.5">
              <UKbd value="meta" />
              <UKbd>K</UKbd>
            </div>
          </template>
        </USelectMenu>
        <UButton
          class="hidden lg:flex"
          size="md"
          color="neutral"
          variant="outline"
          icon="i-heroicons-adjustments-vertical-20-solid"
          to="/search"
          :aria-label="$t('menu.detail_search')"
        >
          <span class="hidden xl:block">
            {{ $t("menu.detail_search") }}
          </span>
        </UButton>
        <div class="ml-auto hidden space-x-2 lg:flex">
          <USelect
            v-model="store.mode"
            size="md"
            class="w-40"
            icon="i-heroicons-globe-europe-africa-20-solid"
            :items="modeOptions"
          />
          <USelect
            :model-value="locale"
            size="md"
            :items="langOptions"
            icon="i-heroicons-language-20-solid"
            @update:model-value="handleLocaleChange"
          />
          <ColorModeSwitch />
          <UDropdownMenu :items="pageItems">
            <template #default>
              <UButton
                :label="$t('menu.more')"
                :aria-label="$t('menu.more')"
                size="md"
                color="neutral"
                variant="outline"
                trailing-icon="i-heroicons-chevron-down-20-solid"
              />
            </template>
          </UDropdownMenu>
        </div>
        <UButton
          class="ml-auto lg:hidden"
          size="md"
          variant="ghost"
          color="gray"
          trailing-icon="i-heroicons-bars-3"
          @click="state.isOpen = true"
        />

        <USlideover v-model:open="state.isOpen">
          <template #body>
            <div class="flex flex-col space-y-2 p-4">
              <USeparator />
              <div class="grid grid-cols-2 gap-x-2">
                <USelect
                  v-model="store.mode"
                  class="col-span-1"
                  size="md"
                  icon="i-heroicons-globe-europe-africa-20-solid"
                  :aria-label="t('header.mode')"
                  :items="modeOptions"
                />
                <USelect
                  class="col-span-1"
                  :model-value="locale"
                  size="md"
                  :items="langOptions"
                  icon="i-heroicons-language-20-solid"
                  :aria-label="t('header.lang')"
                  @update:model-value="handleLocaleChange"
                />
              </div>
              <div class="ml-auto">
                <ColorModeSwitch />
              </div>
              <USeparator />
              <UButton
                label="Advanced search"
                size="md"
                color="gray"
                variant="ghost"
                icon="i-heroicons-adjustments-vertical-20-solid"
                to="/search"
              />
              <USeparator />
              <UNavigationMenu orientation="vertical" :items="pageItems[0]" />
            </div>
          </template>
        </USlideover>
      </nav>
    </div>
  </header>
</template>
