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

const queryParams = computed(() => {
  const params: { [K: string]: any } = {};

  params.page = page.value;

  if (sort.value) {
    params.sort = `${sort.value.column} ${sort.value.direction}`;
  }

  return params;
});

const route = useRoute();
const router = useRouter();

watch(queryParams, () => {
  router.push({
    query: {
      ...route.query,
      ...queryParams.value,
    },
  });
});

watch(
  () => route.query,
  (query) => {
    const parsedPage = Number(query.page) || 1;
    if (parsedPage !== queryParams.value.page) {
      page.value = parsedPage || 1;
    }

    if (query.sort) {
      const [column, direction] = (query.sort as string).split(" ") || [
        "specimen_number",
        "asc",
      ];
      sort.value = { column, direction: direction as "asc" | "desc" };
    }
  },
  { immediate: true },
);

const { data: specimenRes } = await useSolrFetch<{
  response: { docs: any[]; numFound: number };
}>("/specimen", {
  query: computed(() => ({
    q: `hierarchy_string:(${props.taxon.hierarchy_string}*)`,
    rows: paginateBy.value,
    start: paginateBy.value * (page.value - 1),
    sort: `${getSortKey(sort.value.column as keyof typeof sortKeyMap)} ${sort.value.direction}`,
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

const ClientOnly = resolveComponent("ClientOnly");
const UButton = resolveComponent("UButton");

const { columns } = tableColumns(t, locale, UButton, ClientOnly);
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
