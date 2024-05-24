<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();
const { data } = useApiFetch<{ results: any[] }>("/taxon/", {
  query: {
    sql: "get_species_distribution_conop",
    keyword: props.taxon.name,
    format: "json",
  },
});

const distributionConop = computed(() => data.value?.results ?? []);
</script>

<template>
  <UCard v-if="distributionConop.length > 0" class="row">
    <template #header>
      {{ $t("header.f_species_distribution_samples") }} (CONOP)
    </template>
    <div v-if="distributionConop.length > 0">
      <div v-for="(conop, idx) in distributionConop" :key="idx">
        <UDivider v-if="idx !== 0" class="my-1" />
        <a :href="`https://geocollection.info/locality/${conop.locality_id}`">
          {{ conop.locality_et }}
        </a>
        : {{ conop.num }} {{ $t("header.f_species_link_samples") }}
      </div>
    </div>
  </UCard>
</template>
