<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();

const store = useRootStore();
const stateRoute = useStateRoute();
const localePath = useLocalePath();

interface TaxonSpecies {
  id: number;
  name: string;
  author_year?: string;
  stratigraphy_base?: {
    id: number;
    name: string;
    name_en: string;
  };
  stratigraphy_top?: {
    id: number;
    name: string;
    name_en: string;
  };
}

const { data: allSpeciesRes } = await useNewApiFetch<{
  results: TaxonSpecies[];
  count: number;
}>(`/taxa/`, {
  query: computed(() => {
    const limit = store.searchParameters.species.paginateBy;
    const offset = (store.searchParameters.species.page - 1) * limit;
    return {
      hierarchy_string__istartswith: props.taxon.hierarchy_string,
      rank__rank_en: "species",
      ...getModeQueryParam(store.mode),
      ordering: "taxon",
      fields:
        "name,author_year,id,stratigraphy_base.id,stratigraphy_base.name_en,stratigraphy_base.name,stratigraphy_top.id,stratigraphy_top.name_en,stratigraphy_top.name",
      expand: "stratigraphy_base,stratigraphy_top",
      limit,
      offset,
      format: "json",
    };
  }),
});

const allSpecies = computed(() => allSpeciesRes.value?.results ?? []);
const numberOfSpecimen = computed(() => allSpeciesRes.value?.count ?? 0);

function getModeQueryParam(mode: string) {
  if (mode === "in_baltoscandia")
    return { in_baltoscandia: 1 };
  else if (mode === "in_estonia")
    return { in_estonia: 1 };

  return {};
}

function calculateSpeciesIdx(idx: number) {
  return (
    idx
    + 1
    + store.searchParameters.species.paginateBy
    * store.searchParameters.species.page
    - store.searchParameters.species.paginateBy
  );
}
</script>

<template>
  <UCard v-if="allSpecies && allSpecies.length > 0">
    <template #header>
      {{ $t("header.f_species_list") }}
    </template>
    <div>
      <div v-for="(item, idx) in allSpecies" :key="idx">
        {{ calculateSpeciesIdx(idx) }}.
        <NuxtLink :to="stateRoute(localePath(`/${item.id}`))">
          <em>{{ item.name }}</em>
          {{ item.author_year }}
        </NuxtLink>
        <template
          v-if="item.stratigraphy_top?.id !== item.stratigraphy_base?.id"
        >
          |
          <span v-if="item.stratigraphy_base">
            {{
              $translate({
                et: item.stratigraphy_base.name,
                en: item.stratigraphy_base.name_en,
              })
            }}
          </span>
          <span v-if="item.stratigraphy_top">→</span>
          <span v-if="item.stratigraphy_top">
            {{
              $translate({
                et: item.stratigraphy_top.name,
                en: item.stratigraphy_top.name_en,
              })
            }}
          </span>
        </template>
        <template
          v-else-if="
            item.stratigraphy_base
              && item.stratigraphy_top
              && item.stratigraphy_top.id === item.stratigraphy_base.id
          "
        >
          |
          <span>
            {{
              $translate({
                et: item.stratigraphy_base.name,
                en: item.stratigraphy_base.name_en,
              })
            }}
          </span>
        </template>
      </div>
    </div>
    <UPagination
      v-if="numberOfSpecimen > store.searchParameters.species.paginateBy"
      v-model="store.searchParameters.species.page"
      class="mt-2"
      :total="numberOfSpecimen"
      :page-count="store.searchParameters.species.paginateBy"
    />
  </UCard>
</template>
