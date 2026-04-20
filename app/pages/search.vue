<script setup lang="ts">
import type { Circle, Map, Polygon, Rectangle } from "leaflet";
import type { AdvancedSearchState } from "~/utils/advanced-search";

const map = ref<Map | undefined>();
const selectedArea = ref<Circle | Rectangle | Polygon | undefined>();

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
      pageSize: 14,
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
      pageSize: 14,
    },
    mapPaginateBy: 1000,
    mapDataResults: [],
  };
}

const { search, resetLayerGroups } = useAdvancedSearch(map, selectedArea, state);

function reset() {
  resetLayerGroups();
  Object.assign(state, createInitialState());
}
</script>

<template>
  <section class="container space-y-2">
    <div
      class="flex h-full flex-col rounded border bg-white p-4 lg:col-span-1 dark:border-gray-700 dark:bg-gray-800"
    >
      <span class="flex justify-between">
        <h1 class="text-center text-4xl">
          {{ $t("menu.detail_search") }}
        </h1>
      </span>

      <hr class="my-2">

      <div class="grid flex-1 grid-cols-2 gap-8">
        <span class="flex h-full flex-col justify-between">
          <ClientOnly>
            <AdvancedSearchMap v-model="state" v-model:map="map" v-model:area="selectedArea" />
          </ClientOnly>
          <AdvancedSearchForm v-model="state" :search="search" />
        </span>
        <AdvancedSearchResults v-model="state" :search="search" :reset="reset" />
      </div>
    </div>
  </section>
</template>
