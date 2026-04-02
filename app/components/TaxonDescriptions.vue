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
  <UCard
    v-if="taxonDescriptions && taxonDescriptions.count > 0"
    :ui="{ body: { base: 'space-y-2' } }"
  >
    <template #header>
      {{ $t("header.f_taxon_description_diagnosis") }}
    </template>
    <Foldable :el-length="sortedDescriptions.length">
      <div v-for="(item, index) in sortedDescriptions" :key="index">
        <h3 v-if="item.description">
          <a
            v-if="item.reference"
            :href="`https://kirjandus.geoloogia.info/reference/${item.reference.id}`"
          >
            <strong>{{ item.reference.reference }}</strong>
          </a>
        </h3>
        <div v-html="item.description" />
      </div>
    </Foldable>
  </UCard>
</template>
