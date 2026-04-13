export const useAdvancedSearchFilters = (
  higherTaxonResults: any,
  stratigraphyResults: any,
) => {
  const { $solrFetch } = useNuxtApp();

  const searchHigherTaxon = useDebounceFn(async (taxon: string) => {
    if (taxon.length < 1) {
      higherTaxonResults.value = [];
      return;
    }

    const taxonOptionsRes = await $solrFetch<{
      response: { docs: TaxonOption[] };
    }>(`/taxon`, {
      query: {
        q: "*",
        fq: [
          `taxon:${buildAutocompleteFilterSolrSearchValue(taxon)}`,
          "rank:[1 TO 13]",
        ],
        rows: "30",
        fl: "id,taxon,hierarchy_string",
        format: "json",
      },
    });

    if (!taxonOptionsRes) {
      return;
    }

    higherTaxonResults.value = taxonOptionsRes.response.docs;
  }, 300);

  const searchStratigraphy = useDebounceFn(async (stratigraphy: string) => {
    if (stratigraphy.length < 1) {
      stratigraphyResults.value = [];
      return;
    }

    const stratigraphyOptionsRes = await $solrFetch<{
      response: { docs: StratigraphyOption[] };
    }>(`/stratigraphy`, {
      query: {
        q: "*",
        fq: [
          `stratigraphy:${buildAutocompleteFilterSolrSearchValue(
            stratigraphy,
          )} OR stratigraphy_en:${buildAutocompleteFilterSolrSearchValue(stratigraphy)}`,
          "type:1",
        ],
        rows: "30",
        fl: "stratigraphy,stratigraphy_en,id,hierarchy_string",
        format: "json",
      },
    });

    if (!stratigraphyOptionsRes) {
      return;
    }

    stratigraphyResults.value = stratigraphyOptionsRes.response.docs;
  }, 300);

  return {
    searchHigherTaxon,
    searchStratigraphy,
  };
};
