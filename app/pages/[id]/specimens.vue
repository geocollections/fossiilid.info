<script setup lang="ts">
import type { Taxon, TaxonPage } from "~/pages/[id].vue";
import { tableColumns } from "./specimen-columns";

const props = defineProps<{
  taxon: Taxon;
  taxonPage: TaxonPage;
}>();

const { t, locale } = useI18n();

const sortKeyMap = {
  specimen_number: "specimen_number",
  taxon: "taxon",
  locality: {
    et: "locality",
    en: "locality_en",
  },
  depth: "depth",
  stratigraphy: {
    et: "stratigraphy",
    en: "stratigraphy_en",
  },
  status: {
    et: "original_status",
    en: "original_status_en",
  },
} as const;

const sort = ref<{ column: string; direction: "asc" | "desc" }>({
  column: "specimen_number",
  direction: "asc",
});
const page = ref(1);
const paginateBy = ref(10);

const route = useRoute();
const router = useRouter();

const ClientOnly = resolveComponent("ClientOnly");
const UButton = resolveComponent("UButton");

const { columns, sorting } = tableColumns(t, locale, UButton, ClientOnly);

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

const { data: specimenRes } = await useSolrFetch<{
  response: { docs: any[]; numFound: number };
}>("/specimen", {
  query: computed(() => ({
    q: `hierarchy_string:(${props.taxon.hierarchy_string}*)`,
    rows: paginateBy.value,
    start: paginateBy.value * (page.value - 1),
    sort: `${getSortKey(sorting.value[0]?.id as keyof typeof sortKeyMap)} ${sorting.value[0]?.desc ? "desc" : "asc"}`,
    format: "json",
  })),
});

function getSortKey(columnKey: keyof typeof sortKeyMap) {
  if (typeof sortKeyMap[columnKey] === "string") {
    return sortKeyMap[columnKey];
  }

  if (locale.value === "et") {
    // @ts-expect-error this cannot error as we have checked the type above
    return sortKeyMap[columnKey].et;
  }
  // @ts-expect-error this cannot error as we have checked the type above
  return sortKeyMap[columnKey].en;
}
</script>

<template>
  <UPagination
    v-model:page="page"
    :ui="{ base: 'ml-auto mb-2' }"
    :total="specimenRes?.response.numFound ?? 0"
    :page-count="paginateBy"
  />
  <UTable
    class="rounded border bg-white"
    v-model:sorting="sorting"
    :columns="columns"
    :data="specimenRes?.response.docs ?? []"
  />
  <UPagination
    v-model:page="page"
    :ui="{ base: 'ml-auto mt-2' }"
    :total="specimenRes?.response.numFound ?? 0"
    :page-count="paginateBy"
  />
</template>
