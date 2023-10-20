<template>
  <div>
    <span>{{ $t("header.f_weblinks") }}:</span>
    <span v-if="taxonPage && taxonPage.link_wikipedia != null">
      {{ $t("header.f_link_wikipedia") }}
      <a
        :href="
          'http://' +
          $i18n.locale +
          '.wikipedia.org/wiki/' +
          taxonPage.link_wikipedia
        "
        aria-label="wikipedia"
      >
        <i class="fas fa-external-link-alt"></i>
      </a>
      &ensp;&ensp;
    </span>
    <span v-if="taxon.taxon_id_tol != null">
      {{ $t("header.f_link_tolweb") }}
      <a :href="'http://tolweb.org/' + taxon.taxon_id_tol" aria-label="tolweb">
        <i class="fas fa-external-link-alt"></i>
      </a>
      &ensp;&ensp;
    </span>
    <span v-if="taxon.taxon_id_eol != null">
      {{ $t("header.f_link_eol") }}
      <a
        :href="'http://www.eol.org/pages/' + taxon.taxon_id_eol"
        aria-label="eol"
      >
        <i class="fas fa-external-link-alt"></i>
      </a>
      &ensp;&ensp;
    </span>
    <span v-if="taxon.taxon_id_nrm != null">
      {{ $t("header.f_link_naturforskaren") }}
      <a
        v-if="taxon.taxon_id_nrm != null"
        :href="'http://naturforskaren.se/species/' + taxon.taxon_id_nrm"
        aria-label="nrm"
      >
        <i class="fas fa-external-link-alt"></i>
      </a>
      &ensp;&ensp;
    </span>
    <span v-if="taxon.taxon_id_plutof != null">
      {{ $t("header.f_link_plutof") }}
      <a
        v-if="taxon.taxon_id_plutof != null"
        :href="
          'http://elurikkus.ut.ee/elr_tree.php?id=' + taxon.taxon_id_plutof
        "
        aria-label="plutof"
      >
        <i class="fas fa-external-link-alt"></i>
      </a>
      &ensp;&ensp;
    </span>
    <span v-if="taxon.taxon_id_pbdb != null">
      Paleobiology Database
      <a
        v-if="taxon.taxon_id_pbdb != null"
        :href="
          'https://paleobiodb.org/cgi-bin/bridge.pl?a=checkTaxonInfo&taxon_no=' +
          taxon.taxon_id_pbdb
        "
        aria-label="pbdb"
      >
        <i class="fas fa-external-link-alt"></i>
      </a>
      &ensp;&ensp;
    </span>
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
