<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { AdvancedSearchState } from "~/utils/advanced-search";

const { search } = defineProps(["search", "reset"]);
const state = defineModel<AdvancedSearchState>({ required: true });
const { $getLocale } = useNuxtApp();
const stateRoute = useStateRoute();
const localePath = useLocalePath();

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
      if ($getLocale() === "et") {
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
      if ($getLocale() === "et") {
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
    <div class="flex justify-between">
      <UPagination
        v-model:page="state.pagination.pageIndex"
        :items-per-page="state.pagination.pageSize"
        :total="state.numberOfResults"
        :sibling-count="1"
        show-edges
        @update:page="
          (p) => {
            state.pagination.pageIndex = p;
            search();
          }
        "
      />

      <UButton
        variant="outline"
        color="neutral"
        icon="i-heroicons-trash"
        @click="reset"
      >
        {{ $t("advancedsearch.btn_clear") }}
      </UButton>
    </div>

    <UTable
      class="my-4"
      :columns="columns"
      :data="state.results"
      label-key="fossil_group_id"
    />

    <UPagination
      v-model:page="state.pagination.pageIndex"
      :items-per-page="state.pagination.pageSize"
      :total="state.numberOfResults"
      :sibling-count="1"
      show-edges
      @update:page="
        (p) => {
          state.pagination.pageIndex = p;
          search();
        }
      "
    />
  </div>
</template>
