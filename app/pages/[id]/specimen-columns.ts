import type { TableColumn } from "@nuxt/ui";
import type { Taxon } from "../[id].vue";

const geocollectionUrl = "https://geocollections.info" as const;
const kividUrl = "https://kivid.info" as const;

export const tableColumns = (t, locale, UButton, ClientOnly) => {
  const translate = (obj: { et?: string; en?: string }) => {
    return locale.value === "et" ? (obj.et ?? obj.en) : (obj.en ?? obj.et);
  };

  const sortBy = (column, label) => {
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
      onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
    });
  };

  const columns: TableColumn<Taxon>[] = [
    {
      accessorKey: "specimen_number",
      header: ({ column }) => sortBy(column, t("search.specimen.number")),
      cell: ({ row }) => {
        return h(
          "a",
          { href: `${geocollectionUrl}/specimen/${row.id}` },
          `${row.original.acronym} ${row.original.specimen_number}`,
        );
      },
    },

    {
      accessorKey: "taxon",
      header: ({ column }) =>
        sortBy(column, t("search.specimen.name_part_element")),
      cell: ({ row }) =>
        h("div", [
          h(
            "a",
            { href: `/${row.original.taxon_id}` },
            row.original.taxon ?? "",
          ),
          row.original.taxon_txt &&
          row.original.taxon &&
          row.original.taxon_txt !== row.original.taxon
            ? h("span", [
                " | ",
                ...row.original.taxon_txt.map((txt, idx) =>
                  h("i", { key: idx }, [
                    txt,
                    idx !== row.original.taxon_txt!.length - 1 ? "," : "",
                  ]),
                ),
              ])
            : null,
          row.original.rock_id
            ? h("div", [
                h(
                  "a",
                  { href: `${kividUrl}/rock/${row.original.rock_id}` },
                  translate(
                    {
                      et: row.original.rock,
                      en: row.original.rock_en,
                    },
                    locale,
                  ),
                ),
                (row.original.rock_txt || row.original.rock_txt_en) &&
                (row.original.rock !== row.original.rock_txt ||
                  row.original.rock_en !== row.original.rock_txt_en)
                  ? h("span", [
                      " | ",
                      h(
                        "i",
                        {},
                        translate(
                          {
                            et: row.original.rock_txt,
                            en: row.original.rock_txt_en,
                          },
                          locale,
                        ),
                      ),
                    ])
                  : null,
              ])
            : null,
        ]),
    },

    {
      accessorKey: "locality",
      header: ({ column }) => sortBy(column, t("search.specimen.locality")),
      cell: ({ row }) =>
        h("div", [
          row.original.locality || row.original.locality_en
            ? h(
                "a",
                {
                  href: `${geocollectionUrl}/locality/${row.original.locality_id}`,
                },
                translate(
                  {
                    et: row.original.locality,
                    en: row.original.locality_en,
                  },
                  locale,
                ),
              )
            : null,
          row.original.locality_free
            ? h("span", {}, row.original.locality_free)
            : null,
        ]),
    },

    {
      accessorKey: "depth",
      header: ({ column }) => sortBy(column, t("search.specimen.depth_m")),
      cell: ({ row }) =>
        h("span", [
          row.original.depth ?? "",
          row.original.depth_interval ? `- ${row.original.depth_interval}` : "",
        ]),
    },

    {
      accessorKey: "stratigraphy",
      header: ({ column }) => sortBy(column, t("search.specimen.stratigraphy")),
      cell: ({ row }) =>
        h("div", [
          row.original.stratigraphy || row.original.stratigraphy_en
            ? h(
                "a",
                {
                  href: `${geocollectionUrl}/stratigraphy/${row.original.stratigraphy_id}`,
                },
                translate(
                  {
                    et: row.original.stratigraphy,
                    en: row.original.stratigraphy_en,
                  },
                  locale,
                ),
              )
            : h("div"),
          row.original.stratigraphy_txt
            ? h("span", [
                " | ",
                ...row.original.stratigraphy_txt.map((txt, idx) =>
                  h("span", { key: idx }, [
                    txt,
                    idx !== row.original.stratigraphy_txt!.length - 1
                      ? ","
                      : "",
                  ]),
                ),
              ])
            : null,
        ]),
    },

    {
      accessorKey: "status",
      header: ({ column }) => sortBy(column, t("search.specimen.status")),
      cell: ({ row }) =>
        translate(
          {
            et: row.original.original_status,
            en: row.original.original_status_en,
          },
          locale,
        ),
    },

    {
      id: "image",
      header: t("search.specimen.images"),
      cell: ({ row, getValue }) =>
        h(ClientOnly, null, {
          default: () =>
            getValue("image")
              ? h(
                  "a",
                  {
                    "data-fancybox": "gallery3",
                    href: row.original.image_url,
                    "data-caption": row.original.caption,
                  },
                  h("img", {
                    class: "rounded border p-1",
                    src: row.original.image_preview_url,
                    style: "max-height: 6rem; max-width: 3rem",
                  }),
                )
              : h("div"),
        }),
    },
  ];
  return { columns };
};
