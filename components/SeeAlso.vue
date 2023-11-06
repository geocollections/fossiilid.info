<template>
  <UCard>
    <template #header>See also</template>
    <div class="flex flex-col">
      <NuxtLink
        v-if="taxonPage && taxonPage.link_wikipedia"
        :href="`https://${$i18n.locale}.wikipedia.org/wiki/${taxonPage.link_wikipedia}`"
        aria-label="wikipedia"
      >
        {{ $t("header.f_link_wikipedia") }}
        <UIcon
          name="i-heroicons-arrow-up-right-20-solid"
          class="h-3 w-3 align-top"
        />
      </NuxtLink>
      <NuxtLink
        v-if="taxon.taxon_id_tol"
        :href="`http://tolweb.org/${taxon.taxon_id_tol}`"
        aria-label="tolweb"
      >
        {{ $t("header.f_link_tolweb") }}
        <UIcon
          name="i-heroicons-arrow-up-right-20-solid"
          class="h-3 w-3 align-top"
        />
      </NuxtLink>
      <NuxtLink
        v-if="taxon.taxon_id_eol"
        :href="`https://www.eol.org/pages/${taxon.taxon_id_eol}`"
        aria-label="eol"
      >
        {{ $t("header.f_link_eol") }}
        <UIcon
          name="i-heroicons-arrow-up-right-20-solid"
          class="h-3 w-3 align-top"
        />
      </NuxtLink>
      <NuxtLink
        v-if="taxon.taxon_id_nrm"
        :href="`http://naturforskaren.se/species/${taxon.taxon_id_nrm}`"
        aria-label="nrm"
      >
        {{ $t("header.f_link_naturforskaren") }}
        <UIcon
          name="i-heroicons-arrow-up-right-20-solid"
          class="h-3 w-3 align-top"
        />
      </NuxtLink>
      <NuxtLink
        v-if="taxon.taxon_id_plutof"
        :href="`https://elurikkus.ee/bie-hub/species/${taxon.taxon_id_plutof}`"
        aria-label="plutof"
      >
        {{ $t("header.f_link_plutof") }}
        <UIcon
          name="i-heroicons-arrow-up-right-20-solid"
          class="h-3 w-3 align-top"
        />
      </NuxtLink>
      <NuxtLink
        v-if="taxon.taxon_id_pbdb"
        :href="`https://paleobiodb.org/cgi-bin/bridge.pl?a=checkTaxonInfo&taxon_no=${taxon.taxon_id_pbdb}`"
        aria-label="pbdb"
      >
        Paleobiology Database
        <UIcon
          name="i-heroicons-arrow-up-right-20-solid"
          class="h-3 w-3 align-top"
        />
      </NuxtLink>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps({
  taxon: {
    type: Object,
    required: true,
  },
  taxonPage: {
    type: Object,
    required: true,
  },
});
</script>
