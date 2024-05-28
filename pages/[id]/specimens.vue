<script setup lang="ts">
import type { Taxon, TaxonPage } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
  taxonPage: TaxonPage;
}>();

const geocollectionUrl = "https://geocollections.info" as const;
const kividUrl = "https://kivid.info" as const;
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

  if (sort.value)
    params.sort = `${sort.value.column} ${sort.value.direction}`;

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

watch(() => route.query, (query) => {
  const parsedPage = Number(query.page) || 1;
  if (parsedPage !== queryParams.value.page)
    page.value = parsedPage || 1;

  if (query.sort) {
    const [column, direction] = (query.sort as string).split(" ") || ["specimen_number", "asc"];
    sort.value = { column, direction: direction as "asc" | "desc" };
  }
}, { immediate: true });

const { data: specimenRes } = await useSolrFetch<{ response: { docs: any[]; numFound: number } }>("/specimen", {
  query: computed(() => ({
    q: `hierarchy_string:(${props.taxon.hierarchy_string}*)`,
    rows: paginateBy.value,
    start:
      paginateBy.value
      * (page.value - 1),
    sort: `${getSortKey(sort.value.column as keyof typeof sortKeyMap)} ${sort.value.direction}`,
    format: "json",
  })),
});

function getSortKey(columnKey: keyof typeof sortKeyMap) {
  if (typeof sortKeyMap[columnKey] === "string")
    return sortKeyMap[columnKey];

  if (locale.value === "et")
    // @ts-expect-error this cannot error as we have checked the type above
    return sortKeyMap[columnKey].et;
  // @ts-expect-error this cannot error as we have checked the type above
  return sortKeyMap[columnKey].en;
}
const columns = computed(() => [
  {
    key: "specimen_number",
    label: t("search.specimen.number"),
    sortable: true,
    sortKey: "specimen_number",
  },
  {
    key: "taxon",
    label: t("search.specimen.name_part_element"),
    sortable: true,
    sortKey: "taxon",
  },
  {
    key: "locality",
    label: t("search.specimen.locality"),
    sortable: true,
    sortKey: "locality",
  },
  {
    key: "depth",
    label: t("search.specimen.depth_m"),
    sortable: true,
    sortKey: "depth",
  },
  {
    key: "stratigraphy",
    label: t("search.specimen.stratigraphy"),
    sortable: true,
    sortKey: "stratigraphy",
  },
  {
    key: "status",
    label: t("search.specimen.status"),
    sortable: true,
    sortKey: "status",
  },
  {
    key: "image",
    label: t("search.specimen.images"),
  },
]);
</script>

<template>
  <UPagination
    v-model="page"
    :ui="{ base: 'ml-auto mb-2' }"
    :total="specimenRes?.response.numFound ?? 0"
    :page-count="paginateBy"
  />
  <UTable
    v-model:sort="sort"
    class="rounded border bg-white"
    :columns="columns"
    :rows="specimenRes?.response.docs ?? []"
  >
    <template #specimen_number-data="{ row }">
      <a :href="`${geocollectionUrl}/specimen/${row.id}`">
        {{ row.acronym }} {{ row.specimen_number }}
      </a>
    </template>
    <template #taxon-data="{ row: item }">
      <div>
        <a :href="`/${item.taxon_id}`">{{ item.taxon }}</a>
        <template
          v-if="item.taxon_txt && item.taxon && item.taxon_txt !== item.taxon"
        >
          <span> | </span>
          <i v-for="(txt, idx) in item.taxon_txt" :key="idx">
            {{ txt }}
            <span v-if="idx !== item.taxon_txt.length - 1">,</span>
          </i>
        </template>
      </div>
      <!-- Currently both are links because rock__name is mostly null. -->
      <div v-if="item.rock_id">
        <a :href="`${kividUrl}/rock/${item.rock_id}`">
          {{ $translate({ et: item.rock, en: item.rock_en }) }}
        </a>
        <template
          v-if="
            (item.rock_txt || item.rock_txt_en)
              && (item.rock !== item.rock_txt || item.rock_en !== item.rock_txt_en)
          "
        >
          <span> | </span>
          <i>
            {{ $translate({ et: item.rock_txt, en: item.rock_txt_en }) }}
          </i>
        </template>
      </div>
    </template>
    <template #locality-data="{ row: item }">
      <div v-if="item.locality || item.locality_en">
        <a :href="`${geocollectionUrl}/locality/${item.locality_id}`">
          {{ $translate({ et: item.locality, en: item.locality_en }) }}
        </a>
      </div>
      <span v-if="item.locality_free">
        {{ item.locality_free }}
      </span>
    </template>
    <template #depth-data="{ row: item }">
      {{ item.depth }}
      <span v-if="item.depth_interval">- {{ item.depth_interval }}</span>
    </template>
    <template #stratigraphy-data="{ row: item }">
      <a
        v-if="item.stratigraphy || item.stratigraphy_en"
        :href="`${geocollectionUrl}/stratigraphy/${item.stratigraphy_id}`"
      >
        {{ $translate({ et: item.stratigraphy, en: item.stratigraphy_en }) }}
      </a>
      <div v-else />

      <span v-if="item.stratigraphy_txt">
        |
        <span v-for="(txt, idx) in item.stratigraphy_txt" :key="idx">
          {{ txt }}
          <span v-if="idx !== item.stratigraphy_txt.length - 1">,</span>
        </span>
      </span>
    </template>
    <template #status-data="{ row: item }">
      {{
        $translate({
          et: item.original_status,
          en: item.original_status_en,
        })
      }}
    </template>
    <template #image-data="{ row: item, getRowData }">
      <ClientOnly>
        <a
          v-if="getRowData(null)"
          data-fancybox="gallery3"
          :href="item.image_url"
          :data-caption="item.caption"
        >
          <img
            class="rounded border p-1"
            :src="item.image_preview_url"
            style="max-height: 6rem; max-width: 3rem"
          >
        </a>
        <div v-else />
      </ClientOnly>
    </template>
  </UTable>
  <UPagination
    v-model="page"
    :ui="{ base: 'ml-auto mt-2' }"
    :total="specimenRes?.response.numFound ?? 0"
    :page-count="paginateBy"
  />
</template>
