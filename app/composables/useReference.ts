export async function useReferences(taxonId: number) {
  const page = ref(1);
  const itemsPerPage = ref(10);

  const queryParams = computed(() => ({
    format: "json",
    limit: itemsPerPage.value,
    offset: (page.value - 1) * itemsPerPage.value,
  }));

  const { data: referencesRes } = await useNewApiFetch<{
    results: any[];
    count: number;
  }>(() => `/taxa/${taxonId}/references/`, {
    query: queryParams,
  });

  const references = computed(() => referencesRes.value?.results ?? []);
  const count = computed(() => referencesRes.value?.count ?? 0);

  return {
    page,
    itemsPerPage,
    references,
    count,
  };
}
