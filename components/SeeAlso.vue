<template>
  <UCard>
    <template #header>See also</template>
    <ul>
      <li v-if="taxonPage?.link_wikipedia">
        <a :href="wikipediaUrl">
          {{ $t("header.f_link_wikipedia") }}
          <UIcon
            name="i-heroicons-arrow-up-right-20-solid"
            class="h-3 w-3 align-top"
          />
        </a>
      </li>
      <li v-if="taxon.tol_id">
        <a :href="`http://tolweb.org/${taxon.tol_id}`">
          {{ $t("header.f_link_tolweb") }}
          <UIcon
            name="i-heroicons-arrow-up-right-20-solid"
            class="h-3 w-3 align-top"
          />
        </a>
      </li>
      <li v-if="taxon.eol_id">
        <a :href="`https://www.eol.org/pages/${taxon.eol_id}`">
          {{ $t("header.f_link_eol") }}
          <UIcon
            name="i-heroicons-arrow-up-right-20-solid"
            class="h-3 w-3 align-top"
          />
        </a>
      </li>
      <li v-if="taxon.nrm_id">
        <a :href="`https://naturforskaren.se/species/${taxon.nrm_id}`">
          {{ $t("header.f_link_naturforskaren") }}
          <UIcon
            name="i-heroicons-arrow-up-right-20-solid"
            class="h-3 w-3 align-top"
          />
        </a>
      </li>
      <li v-if="taxon.plutof_id">
        <a :href="`https://elurikkus.ee/bie-hub/species/${taxon.plutof_id}`">
          {{ $t("header.f_link_plutof") }}
          <UIcon
            name="i-heroicons-arrow-up-right-20-solid"
            class="h-3 w-3 align-top"
          />
        </a>
      </li>
      <li v-if="taxon.pbdb_id">
        <a :href="paleobiologyUrl">
          {{ $t("header.f_link_paleobiology") }}
          <UIcon
            name="i-heroicons-arrow-up-right-20-solid"
            class="h-3 w-3 align-top"
          />
        </a>
      </li>
    </ul>
  </UCard>
</template>

<script setup lang="ts">
import type { Taxon, TaxonPage } from "~/pages/[id].vue";

const props = defineProps<{ taxon: Taxon; taxonPage: TaxonPage }>();
const { locale } = useI18n();
const wikipediaUrl = computed(() => {
  return `https://${locale.value}.wikipedia.org/wiki/${props.taxonPage.link_wikipedia}`;
});
const paleobiologyUrl = computed(() => {
  return `https://paleobiodb.org/classic/checkTaxonInfo?taxon_no=${props.taxon.pbdb_id}`;
});
</script>
