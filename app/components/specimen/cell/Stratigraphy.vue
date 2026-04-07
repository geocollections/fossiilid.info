<script setup lang="ts">
import type { Taxon } from "#shared/types/taxon";

const props = defineProps<{
  specimen: Taxon;
  locale: "et" | "en";
}>();

function translate(value: { et?: string; en?: string }) {
  return props.locale === "et"
    ? (value.et ?? value.en ?? "")
    : (value.en ?? value.et ?? "");
}
</script>

<template>
  <div class="space-y-1">
    <a
      v-if="specimen.stratigraphy || specimen.stratigraphy_en"
      :href="`https://geocollections.info/stratigraphy/${specimen.stratigraphy_id}`"
    >
      {{
        translate({ et: specimen.stratigraphy, en: specimen.stratigraphy_en })
      }}
    </a>

    <span v-if="specimen.stratigraphy_txt?.length">
      |
      <template v-for="(txt, index) in specimen.stratigraphy_txt" :key="index">
        <span>{{ txt }}</span
        ><span v-if="index < specimen.stratigraphy_txt.length - 1">,</span>
      </template>
    </span>
  </div>
</template>
