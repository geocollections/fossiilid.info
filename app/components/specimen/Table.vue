<script setup lang="ts">
import type { Taxon } from "#shared/types/taxon";
import type { TableColumn } from "@nuxt/ui";

const props = defineProps(["specimens"]);
const sorting = defineModel();

const geocollectionUrl = "https://geocollections.info" as const;

const { t, locale } = useI18n();

const ClientOnly = resolveComponent("ClientOnly");
const UButton = resolveComponent("UButton");
const SpecimenCellNumber = resolveComponent("SpecimenCellNumber");
const SpecimenCellTaxon = resolveComponent("SpecimenCellTaxon");
const SpecimenCellLocality = resolveComponent("SpecimenCellNumber");
const SpecimenCellDepth = resolveComponent("SpecimenCellDepth");
const SpecimenCellStratigraphy = resolveComponent("SpecimenCellStratigraphy");
const SpecimenCellStatus = resolveComponent("SpecimenCellStatus");
const SpecimenCellImage = resolveComponent("SpecimenCellImage");

function sortBy(column: any, label: string) {
  const isSorted = column.getIsSorted();

  return h(UButton, {
    color: "neutral",
    variant: "ghost",
    label,
    icon: isSorted
      ? isSorted === "asc"
        ? "i-lucide-arrow-up-narrow-wide"
        : "i-lucide-arrow-down-wide-narrow"
      : "i-lucide-arrow-up-down",
    class: "-mx-2.5",
    onClick: () => column.toggleSorting(isSorted === "asc"),
  });
}

const columns: TableColumn<Taxon>[] = [
  {
    accessorKey: "specimen_number",
    header: ({ column }) => sortBy(column, t("search.specimen.number")),
    cell: ({ row }) =>
      h(SpecimenCellNumber, {
        specimen: row.original,
        href: `${geocollectionUrl}/specimen/${row.original.id}`,
      }),
  },

  {
    accessorKey: "taxon",
    header: ({ column }) =>
      sortBy(column, t("search.specimen.name_part_element")),
    cell: ({ row }) =>
      h(SpecimenCellTaxon, {
        specimen: row.original,
        locale: locale.value,
      }),
  },

  {
    accessorKey: "locality",
    header: ({ column }) => sortBy(column, t("search.specimen.locality")),
    cell: ({ row }) =>
      h(SpecimenCellLocality, {
        specimen: row.original,
        locale: locale.value,
      }),
  },

  {
    accessorKey: "depth",
    header: ({ column }) => sortBy(column, t("search.specimen.depth_m")),
    cell: ({ row }) =>
      h(SpecimenCellDepth, {
        specimen: row.original,
      }),
  },

  {
    accessorKey: "stratigraphy",
    header: ({ column }) => sortBy(column, t("search.specimen.stratigraphy")),
    cell: ({ row }) =>
      h(SpecimenCellStratigraphy, {
        specimen: row.original,
        locale: locale.value,
      }),
  },

  {
    accessorKey: "status",
    header: ({ column }) => sortBy(column, t("search.specimen.status")),
    cell: ({ row }) =>
      h(SpecimenCellStatus, {
        specimen: row.original,
        locale: locale.value,
      }),
  },

  {
    id: "image",
    header: t("search.specimen.images"),
    cell: ({ row }) =>
      h(ClientOnly, null, {
        default: () =>
          h(SpecimenCellImage, {
            specimen: row.original,
          }),
      }),
  },
];
</script>

<template>
  <UTable
    v-model:sorting="sorting"
    class="rounded border bg-white"
    :columns="columns"
    :data="props.specimens"
  />
</template>
