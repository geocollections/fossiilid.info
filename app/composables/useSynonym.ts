interface Synonym {
  id: number;
  taxon: Taxon;
  synonym: string;
  author: string;
  year: number;
  pages: string;
  figures: string;
  remarks: string;
  reference: boolean;
}

export async function useSynonym(taxonId: number) {
  const page = ref(1);
  const itemsPerPage = ref(10);

  const queryParams = computed(() => ({
    offset: itemsPerPage.value * (page.value - 1),
    limit: itemsPerPage.value,
    format: "json",
    ordering: "year",
  }));

  const { data: synonymRes } = await useNewApiFetch<{
    results: Synonym[];
    count: number;
  }
  >(() => `/taxa/${taxonId}/taxon-synonyms/`, {
    query: queryParams,
  });

  const synonyms = computed(() => synonymRes.value?.results ?? []);
  const count = computed(() => synonymRes.value?.count ?? 0);

  return {
    page,
    itemsPerPage,
    synonyms,
    count,
  };
}
