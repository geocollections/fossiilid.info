<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();

const { data } = await useApiFetch<{ results: any[] }>(`/taxon/`, {
  query: {
    sql: "get_species_distribution_sample",
    keyword: props.taxon.name,
    format: "json",
  },
});

const distributionSamples = computed(() => data.value?.results ?? []);

const geocollectionUrl = "https://geocollections.info";

function getUrl(sample: any) {
  return `${geocollectionUrl}/specimen?taxon=${props.taxon.hierarchy_string}&locality=${sample.locality_id}`;
}
</script>

<template>
  <UCard v-if="distributionSamples.length > 0">
    <template #header>
      {{ $t("header.f_species_distribution_samples") }}
    </template>
    <div v-for="(sample, idx) in distributionSamples" :key="idx" class="my-2">
      <a
        :href="`https://geocollections.info/locality/${sample.locality_id}`"
        target="_blank"
      >
        <i>
          {{
            $translate({
              et: sample.locality_et,
              en: sample.locality_en,
            })
          }}
        </i>
      </a>
      <span> &nbsp;({{ sample.depth_min }} ... {{ sample.depth_max }}): </span>
      <a :href="getUrl(sample)">
        {{ sample.num }}
        {{ $t("header.f_species_link_samples") }}
      </a>
    </div>
  </UCard>
</template>
