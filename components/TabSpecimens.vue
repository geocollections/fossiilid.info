<template>
  <UPagination
    :ui="{ base: 'ml-auto mb-2' }"
    v-model="store.searchParameters.specimens.page"
    :total="specimenRes.count"
    :page-count="store.searchParameters.specimens.paginateBy"
  />
  <UTable
    class="rounded border bg-white"
    :columns="columns"
    :rows="specimenRes.results"
    v-model:sort="sort"
  >
    <template #specimen_number-data="{ row }">
      <a :href="`${geocollectionUrl}/specimen/${row.id}`">
        {{ row.acronym }} {{ row.specimen_number }}
      </a>
    </template>
    <template #taxon-data="{ row: item }">
      <div>
        <a :href="'/' + item.taxon_id">{{ item.taxon }}</a>
        <template
          v-if="item.taxon_txt && item.taxon && item.taxon_txt != item.taxon"
        >
          <span> | </span>
          <i v-for="(txt, idx) in item.taxon_txt">
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
            (item.rock_txt || item.rock_txt_en) &&
            (item.rock !== item.rock_txt || item.rock_en !== item.rock_txt_en)
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
      <div v-else></div>

      <span v-if="item.stratigraphy_txt">
        |
        <span v-for="(txt, idx) in item.stratigraphy_txt">
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
        />
      </a>
      <div v-else></div>
    </template>
  </UTable>
  <UPagination
    :ui="{ base: 'ml-auto mt-2' }"
    v-model="store.searchParameters.specimens.page"
    :total="specimenRes.count"
    :page-count="store.searchParameters.specimens.paginateBy"
  />
</template>

<script setup lang="ts">
import { useRootStore } from "~/stores/root";
const props = defineProps({
  taxon: {
    type: Object,
    required: true,
  },
});

const geocollectionUrl = "https://geocollections.info" as const;
const kividUrl = "https://kivid.info" as const;

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
const store = useRootStore();

const sort = ref({
  column: "specimen_number",
  direction: "asc",
});
const { data: specimenRes, pending } = await useApiFetch("/solr/specimen/", {
  query: computed(() => ({
    q: `hierarchy_string:(${props.taxon.hierarchy_string}*)`,
    rows: store.searchParameters.specimens.paginateBy,
    start:
      store.searchParameters.specimens.paginateBy *
      (store.searchParameters.specimens.page - 1),
    sort: `${getSortKey(sort.value.column)} ${sort.value.direction}`,
    format: "json",
  })),
});

function getSortKey(columnKey: keyof typeof sortKeyMap) {
  if (typeof sortKeyMap[columnKey] === "string") {
    return sortKeyMap[columnKey];
  }
  if (locale.value === "et") {
    return sortKeyMap[columnKey].et;
  }
  return sortKeyMap[columnKey].en;
}
const { t, locale } = useI18n();
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

<style scoped>
#table-search .btn {
  padding: 0;
  margin: 0;
}
</style>
