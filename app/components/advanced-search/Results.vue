<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Map } from "leaflet";

const advancedSearchStore = useAdvancedSearchStore();
const map: Ref<Map | undefined> = defineModel("map");
const { resetLayerGroups } = useLeafletMap(map);

const { $getLocale } = useNuxtApp();
const stateRoute = useStateRoute();
const localePath = useLocalePath();
const { search } = useAdvancedSearch(map);

const stratigraphyURL = "https://geocollections.info/stratigraphy";

const columns: TableColumn<any>[] = [
  {
    accessorKey: "taxon",
    header: `${$t("advancedsearch.taxon")}`,
    cell: ({ row }) => {
      const route = stateRoute({
        path: localePath(`/${row.original.taxon_id}`),
      });
      return h(
        "a",
        {
          href: `${route.fullPath}`,
          class: "text-primary",
          target: "_blank",
        },
        row.original.taxon,
      );
    },
  },
  {
    accessorKey: "author_year",
    header: `${$t("advancedsearch.author")}`,
  },
  {
    accessorKey: "fad_id",
    header: "FAD",
    cell: ({ row }) => {
      if ($getLocale() == "et") {
        return h(
          "a",
          {
            href: `${stratigraphyURL}/${row.original.fad_id}`,
            target: "_blank",
          },
          row.original.fad,
        );
      }
      return h(
        "a",
        { href: `${stratigraphyURL}/${row.original.fad_id}`, target: "_blank" },
        row.original.fad_en,
      );
    },
  },
  {
    accessorKey: "lad_id",
    header: "LAD",
    cell: ({ row }) => {
      if ($getLocale() == "et") {
        return h(
          "a",
          {
            href: `${stratigraphyURL}/${row.original.lad_id}`,
            target: "_blank",
          },
          row.original.lad,
        );
      }
      return h(
        "a",
        { href: `${stratigraphyURL}/${row.original.lad_id}`, target: "_blank" },
        row.original.lad_en,
      );
    },
  },
];
</script>
<template>
  <div class="flex flex-col justify-between">
    <UTable
      class="h-[65dvh]"
      :columns="columns"
      :data="advancedSearchStore.results"
      label-key="fossil_group_id"
    />

    <span class="flex justify-between">
      <UPagination
        :v-model:page="advancedSearchStore.pagination.pageIndex"
        :items-per-page="advancedSearchStore.pagination.pageSize"
        :total="advancedSearchStore.numberOfResults"
        @update:page="
          (p) => {
            advancedSearchStore.pagination.pageIndex = p;
            search();
          }
        "
        :sibling-count="1"
        show-edges
      />

      <UButton
        variant="outline"
        color="neutral"
        icon="i-heroicons-trash"
        @click="
          () => {
            advancedSearchStore.reset();
            resetLayerGroups();
          }
        "
      >
        {{ $t("advancedsearch.btn_clear") }}
      </UButton>
    </span>
  </div>
</template>
