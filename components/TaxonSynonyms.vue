<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();

const PAGE_SIZE = 10;

const { $apiFetchNew } = useNuxtApp();
const currentOffset = ref(PAGE_SIZE);
const totalSynonyms = ref(0);
const synonyms = ref<any[]>([]);

const { data } = await useAsyncData("synonyms", async () => {
  return await fetchData({ offset: 0 });
}, {
  default:
    () => ({
      results: [],
      count: 0,
    }),
});

synonyms.value = data.value.results;
totalSynonyms.value = data.value.count;

async function fetchData({ offset }: { offset: number }): Promise<{ results: any[]; count: number }> {
  if (totalSynonyms.value > 0 && offset > totalSynonyms.value)
    return { results: [], count: 0 };

  const data = await $apiFetchNew<{ results: any[]; count: number }>(`/taxa/${props.taxon.id}/taxon-synonyms/`, {
    query: {
      format: "json",
      ordering: "year",
      limit: PAGE_SIZE,
      offset,
    },
  });

  return data;
}

async function fetchMore() {
  const data = await fetchData({ offset: currentOffset.value });
  currentOffset.value = currentOffset.value + PAGE_SIZE;

  synonyms.value.push(...data.results);
}
</script>

<template>
  <UCard v-if="synonyms.length > 0">
    <template #header>
      {{ $t("header.f_species_synonymy") }}
    </template>
    <div
      v-for="(item, index) in synonyms"
      :key="index"
      class="py-1"
      :class="index === synonyms.length - 1 ? '' : 'border-b'"
    >
      <span v-if="item.reference">
        <a :href="`https://kirjandus.geoloogia.info/reference/${item.reference}`">
          <!-- NOTE: year is not always set on the synonym -->
          {{ item.year }}
        </a>
      </span>
      <span v-else>
        {{ item.year }}
      </span>
      &nbsp;&nbsp;&nbsp;
      <em>{{ item.synonym }}</em>
      &mdash; {{ item.author }}
      <span v-if="item.pages">, {{ $t("abbreviation.pp") }}. {{ item.pages }}</span>
      <span v-if="item.figures">, {{ $t("abbreviation.fig") }}. {{ item.figures }}</span>
    </div>
    <div class="w-100 flex justify-center pt-4">
      <UButton v-if="synonyms.length < totalSynonyms" @click="fetchMore">
        Load More
      </UButton>
    </div>
  </UCard>
</template>
