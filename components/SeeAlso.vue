<template>
  <UCard>
    <template #header>See also</template>
    <ul>
      <li v-if="taxonPage.link_wikipedia">
        <a :href="wikipediaUrl">
          {{ $t("header.f_link_wikipedia") }}
          <UIcon
            name="i-heroicons-arrow-up-right-20-solid"
            class="h-3 w-3 align-top"
          />
        </a>
      </li>
      <li v-if="taxon.taxon_id_tol">
        <a :href="`http://tolweb.org/${taxon.taxon_id_tol}`">
          {{ $t("header.f_link_tolweb") }}
          <UIcon
            name="i-heroicons-arrow-up-right-20-solid"
            class="h-3 w-3 align-top"
          />
        </a>
      </li>
      <li v-if="taxon.taxon_id_eol">
        <a :href="`https://www.eol.org/pages/${taxon.taxon_id_eol}`">
          {{ $t("header.f_link_eol") }}
          <UIcon
            name="i-heroicons-arrow-up-right-20-solid"
            class="h-3 w-3 align-top"
          />
        </a>
      </li>
      <li v-if="taxon.taxon_id_nrm">
        <a :href="`https://naturforskaren.se/species/${taxon.taxon_id_nrm}`">
          {{ $t("header.f_link_naturforskaren") }}
          <UIcon
            name="i-heroicons-arrow-up-right-20-solid"
            class="h-3 w-3 align-top"
          />
        </a>
      </li>
      <li v-if="taxon.taxon_id_plutof">
        <a
          :href="`https://elurikkus.ee/bie-hub/species/${taxon.taxon_id_plutof}`"
        >
          {{ $t("header.f_link_plutof") }}
          <UIcon
            name="i-heroicons-arrow-up-right-20-solid"
            class="h-3 w-3 align-top"
          />
        </a>
      </li>
      <li v-if="taxon.taxon_id_pbdb">
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
const props = defineProps({
  taxon: {
    type: Object,
    required: true,
  },
  taxonPage: {
    type: Object,
    required: true,
  },
});
const { locale } = useI18n();
const wikipediaUrl = computed(() => {
  return `https://${locale.value}.wikipedia.org/wiki/${props.taxonPage.link_wikipedia}`;
});
const paleobiologyUrl = computed(() => {
  return `https://paleobiodb.org/classic/checkTaxonInfo`;
});
</script>
