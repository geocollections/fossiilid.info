<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

const advancedSearchStore = useAdvancedSearchStore();
const { resetLayerGroups } = useLeafletMap();

const { $getLocale } = useNuxtApp();
const stateRoute = useStateRoute();
const localePath = useLocalePath();
const { search } = useAdvancedSearch();

const stratigraphyURL = "https://geocollections.info/stratigraphy";

const columns: TableColumn<any>[] = [
  {
    accessorKey: "taxon",
    header: "Taxon",
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
    header: "Author",
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
  <div>
    <UTable
      :columns="columns"
      :data="advancedSearchStore.results"
      label-key="fossil_group_id"
      class="h-[86.5%]"
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
