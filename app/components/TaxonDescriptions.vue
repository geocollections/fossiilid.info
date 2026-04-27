<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

interface TaxonDescription {
  description: string;
  reference: {
    id: number;
    reference: string;
    year: number;
  };
}

const props = defineProps<{
  taxon: Taxon;
}>();

const { data: taxonDescriptions } = await useNewApiFetch<{
  results: TaxonDescription[];
  count: number;
}>(`/taxa/${props.taxon.id}/taxon-descriptions/`, {
  query: {
    taxon: props.taxon.id,
    fields: "reference.id,reference.reference,reference.year,description",
    expand: "reference",
    format: "json",
    ordering: "-id",
  },
});

const descriptions = computed(() => taxonDescriptions.value?.results ?? []);

const sortedDescriptions = computed(() => {
  return descriptions.value.toSorted((a, b) => {
    const parsedAYear = Number.parseInt(a.reference.year, 10);
    const parsedBYear = Number.parseInt(b.reference.year, 10);

    if (Number.isNaN(parsedAYear) && Number.isNaN(parsedBYear))
      return 0;
    else if (Number.isNaN(parsedAYear))
      return 1;
    else if (Number.isNaN(parsedBYear))
      return -1;

    if (parsedAYear > parsedBYear)
      return -1;
    else if (parsedAYear < parsedBYear)
      return 1;

    return 0;
  });
});
</script>

<template>
  <section v-if="taxonDescriptions && taxonDescriptions.count > 0" class="my-2 p-4 rounded-xl border border-gray-200 container bg-white dark:bg-gray-800 dark:border-gray-700">
    <h2 class="font-bold">
      {{ $t("header.f_taxon_description_diagnosis") }}
    </h2>

    <div div class="border-t border-gray-200 -mx-4 my-4" />

    <ul>
      <li v-for="(item, index) in sortedDescriptions" :key="index" class="my-3">
        <h3
          v-if="item.description"
        >
          <a
            v-if="item.reference"
            :href="`https://kirjandus.geoloogia.info/reference/${item.reference.id}`"
          >
            {{ item.reference.reference }}
          </a>
        </h3>
        <div v-html="item.description" />
      </li>
    </ul>
  </section>
</template>
