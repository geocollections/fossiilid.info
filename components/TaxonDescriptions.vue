<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();

const { data: taxonDescriptions } = await useNewApiFetch<{
  results: any[];
  count: number;
}>(`/taxa/${props.taxon.id}/taxon-descriptions/`, {
  query: {
    taxon: props.taxon.id,
    fields: "reference.id,reference.reference,description",

    expand: "reference",
    format: "json",
    ordering: "-id",
  },
});
const descriptions = computed(() => taxonDescriptions.value?.results);
</script>

<template>
  <UCard
    v-if="taxonDescriptions && taxonDescriptions.count > 0"
    :ui="{ body: { base: 'space-y-2' } }"
  >
    <template #header>
      {{ $t("header.f_taxon_description_diagnosis") }}
    </template>
    <div v-for="item in descriptions">
      <h3 v-if="item.description">
        <a
          :href="`https://kirjandus.geoloogia.info/reference/${item.reference.id}`"
        >
          <strong>{{ item.reference.reference }}</strong>
        </a>
      </h3>
      <div v-html="item.description"></div>
    </div>
  </UCard>
</template>
