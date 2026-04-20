<script setup lang="ts">
const map = ref();

const { search, resetLayerGroups } = useAdvancedSearch(map);
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
            <AdvancedSearchMap v-model:map="map" />
          </ClientOnly>
          <AdvancedSearchForm :search="search" />
        </span>
        <AdvancedSearchResults :search="search" :reset="resetLayerGroups" />
      </div>
    </div>
  </section>
</template>
