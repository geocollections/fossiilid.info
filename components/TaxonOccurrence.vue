<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();

interface TaxonOccurrence {
  reference: {
    id: number;
    reference: string;
  };
  locality?: {
    id: number;
    name: string;
    name_en: string;
  };
  depth?: number;
  depth_interval?: number;
  stratigraphy_base?: {
    id: number;
    name: string;
    name_en: string;
  };
}

const { data } = await useNewApiFetch<{ results: TaxonOccurrence[] }>(
  `/taxa/${props.taxon.id}/taxon-occurrences/`,
  {
    query: {
      format: "json",
      expand: "reference,locality,stratigraphy_base",
      fields: [
        "reference.id",
        "reference.reference",
        "locality.id",
        "locality.name",
        "locality.name_en",
        "depth",
        "depth_interval",
        "stratigraphy_base.id",
        "stratigraphy_base.name",
        "stratigraphy_base.name_en",
      ].join(","),
    },
  },
);

const taxonOccurrence = computed(() => data.value?.results ?? []);
</script>

<template>
  <UCard v-if="taxonOccurrence.length > 0">
    <template #header>
      {{ $t("header.f_species_distribution_references") }}
    </template>
    <ul>
      <li v-for="(occurrence, idx) in taxonOccurrence" :key="idx" class="italic">
        <a
          :href="`https://geocollections.info/reference/${occurrence.reference.id}`"
        >
          <strong>{{ occurrence.reference.reference }}</strong>
        </a>
        <span v-if="occurrence.locality">
          &nbsp;
          {{
            $translate({
              et: occurrence.locality.name,
              en: occurrence.locality.name_en,
            })
          }}
        </span>
        <span v-if="occurrence.depth || occurrence.depth_interval">
          &nbsp;
          {{ occurrence.depth }} -
          {{ occurrence.depth_interval }}
        </span>
        <span v-if="occurrence.stratigraphy_base">
          &nbsp;
          {{
            $translate({
              et: occurrence.stratigraphy_base.name,
              en: occurrence.stratigraphy_base.name_en,
            })
          }}
        </span>
      </li>
    </ul>
  </UCard>
</template>
