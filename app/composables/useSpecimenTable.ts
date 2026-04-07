type State = {
  sorting: any;
  paginateBy: any;
  page: Ref<number, number>;
};

export const useSpecimenTable = async (
  { sorting, paginateBy, page }: State,
  hierarchy_string: any,
) => {
  const { locale } = useI18n();

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

  const getSortKey = (columnKey: keyof typeof sortKeyMap) => {
    if (typeof sortKeyMap[columnKey] === "string") return sortKeyMap[columnKey];

    return locale.value === "et"
      ? sortKeyMap[columnKey].et
      : sortKeyMap[columnKey].en;
  };

  const { data: specimenRes } = await useSolrFetch("/specimen", {
    query: computed(() => {
      const s = sorting.value[0];

      return {
        q: `hierarchy_string:(${hierarchy_string}*)`,
        rows: paginateBy.value,
        start: paginateBy.value * (page.value - 1),
        sort: s
          ? `${getSortKey(s.id as keyof typeof sortKeyMap)} ${s.desc ? "desc" : "asc"}`
          : "specimen_number asc",
        format: "json",
      };
    }),
  });

  return { specimenRes };
};
