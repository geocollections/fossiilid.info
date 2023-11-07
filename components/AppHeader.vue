<template>
  <header
    class="sticky bg-gray-50/95 backdrop-blur border-b px-2 dark:bg-gray-900/95 top-0 z-10 dark:border-gray-800"
    :class="{ 'shadow-lg': state.scroll }"
  >
    <div class="container mx-auto">
      <nav class="py-2 h-14 gap-x-2 flex items-center">
        <NuxtLink
          class="uppercase font-bold text-lg md:text-2xl text-tomato"
          to="/"
        >
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
        <div class="space-x-2 hidden lg:flex">
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
          <ColorModeSwitch />
          <UDropdown :items="pageItems">
            <UButton
              :label="$t('menu.more')"
              size="md"
              color="white"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            />
          </UDropdown>
        </div>
        <UButton
          class="lg:hidden"
          size="md"
          variant="ghost"
          color="gray"
          trailing-icon="i-heroicons-bars-3"
          @click="state.isOpen = true"
        ></UButton>
        <USlideover v-model="state.isOpen">
          <div class="p-4 space-y-2 flex flex-col">
            <UButton
              class="lg:hidden ml-auto"
              size="md"
              variant="ghost"
              color="gray"
              trailing-icon="i-heroicons-x-mark"
              @click="state.isOpen = false"
            ></UButton>
            <UDivider />
            <div class="grid grid-cols-2 gap-x-2">
              <USelect
                class="col-span-1"
                v-model="store.mode"
                size="md"
                icon="i-heroicons-globe-europe-africa-20-solid"
                :options="modeOptions"
              />
              <USelect
                class="col-span-1"
                :modelValue="locale"
                size="md"
                :options="langOptions"
                icon="i-heroicons-language-20-solid"
                @update:model-value="
                  (newLocale: string) => setLocale(newLocale)
                "
              />
            </div>
            <div class="ml-auto">
              <ColorModeSwitch />
            </div>
            <UDivider />
            <UVerticalNavigation :links="pageItems[0]" />
          </div>
        </USlideover>
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
  isOpen: false,
});
const store = useRootStore();
const { setLocale, locale, t } = useI18n();
const { $apiFetch } = useNuxtApp();

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

onBeforeMount(() => {
  window.addEventListener("scroll", handleScroll);
});

async function search(value: string) {
  if (value.length < 1) return [];
  const taxa = await $apiFetch<{ results: any[] }>(
    `/taxon/?sql=simple_taxon_search&keyword=${value}&format=json`,
  );
  return taxa.results;
}

function handleScroll() {
  state.scroll = document.documentElement.scrollTop > 1;
}
</script>
