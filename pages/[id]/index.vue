<script setup lang="ts">
import type { Taxon, TaxonPage } from "~/pages/[id].vue";

defineProps<{
  taxon: Taxon;
  taxonPage?: TaxonPage;
}>();
</script>

<template>
  <OverviewTaxon
    :taxon="taxon"
    :taxon-page="taxonPage"
  />
</template>
