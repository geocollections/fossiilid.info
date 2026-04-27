<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();

const PAGE_SIZE = 10;

const { $apiFetchNew } = useNuxtApp();
const totalSynonyms = ref(0);
const synonyms = ref<any[]>([]);
const showMore = ref(false);

const { data } = await useAsyncData("synonyms", async () => {
  return await fetchData({ offset: 0, limit: PAGE_SIZE });
}, {
  default:
    () => ({
      results: [],
      count: 0,
    }),
});

synonyms.value = data.value.results;
totalSynonyms.value = data.value.count;

async function fetchData({ offset, limit }: { offset: number; limit: number }): Promise<{ results: any[]; count: number }> {
  if (totalSynonyms.value > 0 && offset > totalSynonyms.value)
    return { results: [], count: 0 };

  const data = await $apiFetchNew<{ results: any[]; count: number }>(`/taxa/${props.taxon.id}/taxon-synonyms/`, {
    query: {
      format: "json",
      ordering: "year",
      limit,
      offset,
    },
  });

  return data;
}

async function handleShowMore() {
  if (synonyms.value.length < totalSynonyms.value) {
    const data = await fetchData({ offset: 0, limit: totalSynonyms.value });

    synonyms.value = data.results;
  }
  showMore.value = !showMore.value;
}

const visibleSynonyms = computed(() => {
  if (!showMore.value)
    return synonyms.value.slice(0, PAGE_SIZE);

  return synonyms.value;
});
</script>

<template>
  <section v-if="synonyms.length > 0" class="container bg-white border rounded-xl dark:bg-gray-800 dark:border-gray-700">
    <h2 class="font-bold my-2">
      {{ $t("header.f_species_synonymy") }}
    </h2>

    <div div class="border-t border-gray-200 -mx-4 my-4" />

    <ul>
      <li
        v-for="(item, index) in visibleSynonyms"
        :key="index"
        class="flex gap-4 my-4"
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
        <div>
          <em>{{ item.synonym }}</em>
          &mdash; {{ item.author }}
          <span v-if="item.pages">, {{ $t("abbreviation.pp") }}. {{ item.pages }}</span>
          <span v-if="item.figures">, {{ $t("abbreviation.fig") }}. {{ item.figures }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>
