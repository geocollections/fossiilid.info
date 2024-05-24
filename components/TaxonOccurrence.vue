<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();

type TaxonOccurrence = {
  id: number;
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
};

const { data } = await useNewApiFetch<{ results: TaxonOccurrence[] }>(
  `/taxa/${props.taxon.id}/taxon-occurrences/`,
  {
    query: {
      format: "json",
      expand: "reference,locality,stratigraphy_base",
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
      <li class="italic" v-for="occurrence in taxonOccurrence">
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
