<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();

const store = useRootStore();

const { data: mapData } = await useSolrFetch<any>("/taxon_search/", {
  query: computed(() => ({
    q: `taxon_hierarchy:${props.taxon?.hierarchy_string}*${
      store.mode === "in_global" ? `` : ` AND ${store.mode}:1`
    }`,
    fq: ["{!collapse field--locality}", "rank:[14 TO 17]"],
    sort: "fossil_group asc,taxon asc",
    rows: 1000,
    start: 0,
    fl: "src,locality,locality_en,locality_id,latlong",
    format: "json",
  })),
});

const map = computed(() => mapData.value?.results ?? []);

const isNumberOfLocalitiesOnMapOver1000 = computed(() => {
  return mapData.value?.count !== undefined && mapData.value.count > 1000;
});
</script>

<template>
  <UCard v-if="map.length > 0" class="p-0" :ui="{ body: { padding: '' } }">
    <ClientOnly>
      <MapComponent class="rounded-lg" :map-data="map" />
      <template #fallback>
        <div
          style="
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #d4dadc;
          "
        >
          Loading...
        </div>
      </template>
    </ClientOnly>
  </UCard>
  <UAlert
    v-if="isNumberOfLocalitiesOnMapOver1000"
    variant="subtle"
    color="blue"
    title=""
  >
    <template #title>
      Map shows only the first
      <strong style="font-size: 0.9rem">1000</strong>
      localities
    </template>
  </UAlert>
</template>
