<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();

const { page, itemsPerPage, synonyms, count } = await useSynonym(props.taxon.id);
</script>

<template>
  <UCard v-if="synonyms.length > 0" as="section">
    <template #header>
      {{ $t("header.f_species_synonymy") }}
    </template>

    <ul class="space-y-4">
      <li
        v-for="synonym in synonyms"
        :key="synonym.id"
        class="flex gap-x-4"
      >
        <cite>
          <a v-if="synonym.reference" :href="`https://kirjandus.geoloogia.info/reference/${synonym.reference}`">
            <!-- NOTE: year is not always set on the synonym -->
            {{ synonym.year }}
          </a>
          <span v-else>
            {{ synonym.year }}
          </span>
        </cite>
        <div>
          <em>{{ synonym.synonym }}</em>
          <span aria-hidden="true" class="mx-2">&mdash;</span>
          <span>{{ synonym.author }}</span>
          <span v-if="synonym.pages">, {{ $t("abbreviation.pp") }}. {{ synonym.pages }}</span>
          <span v-if="synonym.figures">, {{ $t("abbreviation.fig") }}. {{ synonym.figures }}</span>
        </div>
      </li>
    </ul>

    <UPagination v-if="count > itemsPerPage" v-model="page" :total="count" :items-per-page="itemsPerPage" />
  </UCard>
</template>
