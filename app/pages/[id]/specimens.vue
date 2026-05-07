<script setup lang="ts">
import type { Taxon, TaxonPage } from "#shared/types/taxon";

const props = defineProps<{
  taxon: Taxon;
  taxonPage: TaxonPage;
}>();

const geocollectionUrl = "https://geocollections.info" as const;

const page = ref(1);
const paginateBy = ref(10);

const route = useRoute();
const router = useRouter();

const sorting = ref([
  {
    id: "specimen_number",
    desc: false,
  },
]);

const { specimenRes } = await useSpecimenTable(
  { sorting, paginateBy, page },
  props.taxon.hierarchy_string,
);

watch(
  sorting,
  (newValue) => {
    page.value = 1;
    router.push({
      query: {
        ...route.query,
        col: newValue[0]?.id,
        dir: newValue[0]?.desc ? "desc" : "asc",
        page: page.value,
      },
    });
  },
  { deep: true },
);

watch(page, (newValue) => {
  router.push({
    query: {
      ...route.query,
      page: newValue,
    },
  });
});

function colorFromString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 65%, 80%)`;
}
</script>

<template>
  <UPagination
    v-model:page="page"
    class="lg:hidden"
    :total="specimenRes?.response.numFound ?? 0"
    :items-per-page="paginateBy"
    :sibling-count="1"
  />
  <UPagination
    v-model:page="page"
    class="hidden lg:block"
    :ui="{ root: 'ml-auto mt-2' }"
    :total="specimenRes?.response.numFound ?? 0"
    :items-per-page="paginateBy"
  />
  <SpecimenTable
    v-model="sorting"
    class="hidden lg:block"
    :specimens="specimenRes?.response.docs ?? []"
  />
  <div class="space-y-2 my-2 lg:hidden">
    <UCard v-for="specimen in specimenRes?.response.docs" :key="specimen.id" class="p-2 relative">
      <a class="absolute text-sm right-4 top-1" :href="`${geocollectionUrl}/specimen/${specimen.id}`"> {{ specimen.acronym }} {{ specimen.specimen_number }} </a>
      <div class="flex gap-4 text-xs">
        <UCard class="w-10 h-10 flex items-center justify-center" :style="{ backgroundColor: colorFromString(specimen.taxon) }">
          {{ specimen.taxon.substring(0, 2) }}
        </UCard>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-bold">{{ specimen.taxon }}</span>
          <span class="flex items-center gap-1">
            <UIcon name="i-lucide-map-pin" />
            {{ specimen.locality }}
          </span>
          <span class="inline-flex border rounded-full p-1 px-2 items-center gap-1">
            <UIcon name="i-lucide-layers" />
            {{ specimen.stratigraphy }}
          </span>
        </div>
      </div>
    </UCard>
  </div>
  <UPagination
    v-model:page="page"
    class="lg:hidden"
    :total="specimenRes?.response.numFound ?? 0"
    :items-per-page="paginateBy"
    :sibling-count="1"
  />
  <UPagination
    v-model:page="page"
    class="hidden lg:block"
    :ui="{ root: 'ml-auto mt-2' }"
    :total="specimenRes?.response.numFound ?? 0"
    :items-per-page="paginateBy"
  />
</template>
