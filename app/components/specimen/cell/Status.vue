<script setup lang="ts">
import type { Specimen } from "#shared/types/specimen";

const props = defineProps<{
  specimen: Specimen;
  locale: "et" | "en";
}>();

function translate(value: { et?: string; en?: string }) {
  return props.locale === "et"
    ? (value.et ?? value.en ?? "")
    : (value.en ?? value.et ?? "");
}
</script>

<template>
  <span>
    {{
      translate({
        et: specimen.original_status,
        en: specimen.original_status_en,
      })
    }}
  </span>
</template>
