<script setup lang="ts">
import type { Circle, FeatureGroup, Map, Polygon, Rectangle } from "leaflet";
import type { AdvancedSearchState } from "~/utils/advanced-search";

const map = ref<Map | undefined>();
const selectedArea = ref<Circle | Rectangle | Polygon | undefined>();
const drawnItems = ref<FeatureGroup>();

const state = reactive<AdvancedSearchState>(
  {
    higherTaxon: undefined,
    species: "",
    author: "",
    locality: "",
    stratigraphy: undefined,
    isOutcrop: false,
    isNearMe: false,
    nearMeRangeInKM: 5,
    results: [],
    numberOfResults: 0,
    pagination: {
      pageIndex: 1,
      pageSize: 25,
    },
    mapPaginateBy: 1000,
    mapDataResults: [],
  },
);

function createInitialState(): AdvancedSearchState {
  return {
    higherTaxon: undefined,
    species: "",
    author: "",
    locality: "",
    stratigraphy: undefined,
    isOutcrop: false,
    isNearMe: false,
    nearMeRangeInKM: 5,
    results: [],
    numberOfResults: 0,
    pagination: {
      pageIndex: 1,
      pageSize: 25,
    },
    mapPaginateBy: 1000,
    mapDataResults: [],
  };
}

const { search, resetLayerGroups } = useAdvancedSearch(map, selectedArea, state);

function reset() {
  resetLayerGroups();
  drawnItems.value?.clearLayers();
  Object.assign(state, createInitialState());
}
</script>

<template>
  <section class="container flex flex-col gap-2">
    <div
      class="flex h-125 flex-col rounded border bg-white p-4 lg:col-span-1 dark:border-gray-700 dark:bg-gray-800"
    >
      <span class="flex justify-between">
        <h1 class="text-center text-4xl">
          {{ $t("menu.detail_search") }}
        </h1>
      </span>

      <hr class="my-2">

      <div class="flex h-full justify-between gap-4">
        <AdvancedSearchForm v-model="state" class="w-1/2" :search="search" />
        <ClientOnly>
          <AdvancedSearchMap v-model="state" v-model:drawn="drawnItems" v-model:map="map" v-model:area="selectedArea" />
        </ClientOnly>
      </div>
    </div>

    <div
      v-if="state.results.length > 0"
      class="flex h-full flex-col rounded border bg-white p-4 lg:col-span-1 dark:border-gray-700 dark:bg-gray-800"
    >
      <AdvancedSearchResults v-model="state" :search="search" :reset="reset" />
    </div>
  </section>
</template>
