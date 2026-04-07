<script setup lang="ts">
import type { Taxon, TaxonPage } from "#shared/types/taxon";

const props = defineProps<{
  taxon: Taxon;
  taxonPage: TaxonPage;
}>();

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
</script>

<template>
  <UPagination
    v-model:page="page"
    :ui="{ base: 'ml-auto mb-2' }"
    :total="specimenRes?.response.numFound ?? 0"
    :page-count="paginateBy"
  />
  <SpecimenTable
    v-model="sorting"
    :specimens="specimenRes?.response.docs ?? []"
  />
  <UPagination
    v-model:page="page"
    :ui="{ base: 'ml-auto mt-2' }"
    :total="specimenRes?.response.numFound ?? 0"
    :page-count="paginateBy"
  />
</template>
