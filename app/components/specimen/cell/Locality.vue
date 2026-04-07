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
  <div class="space-y-1">
    <a
      v-if="specimen.locality || specimen.locality_en"
      :href="`https://geocollections.info/locality/${specimen.locality_id}`"
    >
      {{ translate({ et: specimen.locality, en: specimen.locality_en }) }}
    </a>

    <span v-if="specimen.locality_free">{{ specimen.locality_free }}</span>
  </div>
</template>
