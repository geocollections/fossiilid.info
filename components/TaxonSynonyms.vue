<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();

const { data: synonymsRes } = await useNewApiFetch<{
  results: any[];
  count: number;
}>(`/taxa/${props.taxon.id}/taxon-synonyms/`, {
  query: {
    format: "json",
    ordering: "year",
  },
});

const synonyms = computed(() => synonymsRes.value?.results ?? []);
</script>

<template>
  <UCard v-if="synonyms.length > 0">
    <template #header>
      {{ $t("header.f_species_synonymy") }}
    </template>
    <div
      v-for="(synonym, idx) in synonyms"
      :key="idx"
      class="py-1"
      :class="idx === synonyms.length - 1 ? '' : 'border-b'"
    >
      <span v-if="synonym.reference">
        <a :href="`https://kirjandus.geoloogia.info/reference/${synonym.reference}`">
          <!-- NOTE: year is not always set on the synonym -->
          {{ synonym.year }}
        </a>
      </span>
      <span v-else>
        {{ synonym.year }}
      </span>
      &nbsp;&nbsp;&nbsp;
      <em>{{ synonym.synonym }}</em>
      &mdash; {{ synonym.author }}
      <span v-if="synonym.pages">, {{ $t("abbreviation.pp") }}. {{ synonym.pages }}</span>
      <span v-if="synonym.figures">, {{ $t("abbreviation.fig") }}. {{ synonym.figures }}</span>
    </div>
  </UCard>
</template>
