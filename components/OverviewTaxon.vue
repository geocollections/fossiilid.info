<script setup lang="ts">
import type { Taxon, TaxonPage } from "../pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
  taxonPage: TaxonPage | undefined;
}>();

function isHigherTaxon(rank: string | undefined | null) {
  if (!rank)
    return false;
  return !["Species", "Subspecies", "Genus", "Supergenus", "Subgenus"].includes(
    rank,
  );
}

const isSpeciesOrSubspecies = computed(() => {
  if (!props.taxon.rank)
    return false;

  return (
    props.taxon.rank.rank_en === "Species"
    || props.taxon.rank.rank_en === "Subspecies"
  );
});

const isSpecies = computed(() => {
  if (!props.taxon.rank)
    return false;

  return props.taxon.rank?.rank_en === "Species";
});
</script>

<template>
  <div class="grid grid-cols-3 gap-x-2">
    <div class="col-span-full space-y-2 lg:col-span-2">
      <TaxonOpinions :taxon="taxon" />
      <TaxonImages :id="taxon.id" />
      <TaxonPage v-if="taxonPage" :taxon-page="taxonPage" />
      <TaxonDescriptions :taxon="taxon" />
      <TaxonTypeSpecimens v-if="isSpeciesOrSubspecies" :taxon="taxon" />
      <TaxonSynonyms v-if="isSpeciesOrSubspecies" :taxon="taxon" />
      <TaxonReferences :taxon="taxon" />
      <TaxonSpecies
        v-if="taxon.hierarchy_string && !isSpecies"
        :taxon="taxon"
      />
      <TaxonDistributionConop v-if="isSpeciesOrSubspecies" :taxon="taxon" />
    </div>
    <div class="col-span-full space-y-2 lg:col-span-1">
      <TaxonSpecimenMap :taxon="taxon" />
      <TaxonomicalTree :id="taxon.id" />
      <SeeAlso
        v-if="
          taxon.tol_id
            || taxon.eol_id
            || taxon.nrm_id
            || taxon.plutof_id
            || taxon.pbdb_id
            || taxonPage?.link_wikipedia
        "
        :taxon="taxon"
        :taxon-page="taxonPage"
      />

      <TaxonOccurrence
        v-if="!isHigherTaxon(taxon.rank?.rank_en)"
        :taxon="taxon"
      />
      <TaxonDistributionSamples v-if="isSpeciesOrSubspecies" :taxon="taxon" />
    </div>
  </div>
</template>
