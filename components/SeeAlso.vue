<template>
  <div class="flex flex-col">
    <a
      v-if="taxonPage && taxonPage.link_wikipedia"
      :href="
        'http://' +
        $i18n.locale +
        '.wikipedia.org/wiki/' +
        taxonPage.link_wikipedia
      "
      aria-label="wikipedia"
    >
      {{ $t("header.f_link_wikipedia") }}
      <i class="fas fa-external-link-alt"></i>
    </a>
    <a
      v-if="taxon.taxon_id_tol"
      :href="'http://tolweb.org/' + taxon.taxon_id_tol"
      aria-label="tolweb"
    >
      {{ $t("header.f_link_tolweb") }}
      <i class="fas fa-external-link-alt"></i>
    </a>
    <a
      v-if="taxon.taxon_id_eol"
      :href="'http://www.eol.org/pages/' + taxon.taxon_id_eol"
      aria-label="eol"
    >
      {{ $t("header.f_link_eol") }}
      <i class="fas fa-external-link-alt"></i>
    </a>
    <a
      v-if="taxon.taxon_id_nrm"
      :href="'http://naturforskaren.se/species/' + taxon.taxon_id_nrm"
      aria-label="nrm"
    >
      {{ $t("header.f_link_naturforskaren") }}
      <i class="fas fa-external-link-alt"></i>
    </a>
    <a
      v-if="taxon.taxon_id_plutof"
      :href="'http://elurikkus.ut.ee/elr_tree.php?id=' + taxon.taxon_id_plutof"
      aria-label="plutof"
    >
      {{ $t("header.f_link_plutof") }}
      <i class="fas fa-external-link-alt"></i>
    </a>
    <a
      v-if="taxon.taxon_id_pbdb"
      :href="
        'https://paleobiodb.org/cgi-bin/bridge.pl?a=checkTaxonInfo&taxon_no=' +
        taxon.taxon_id_pbdb
      "
      aria-label="pbdb"
    >
      Paleobiology Database
      <i class="fas fa-external-link-alt"></i>
    </a>
  </div>
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
