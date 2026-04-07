<script setup lang="ts">
import type { Specimen } from "#shared/types/specimen";

defineProps<{
  specimen: Specimen;
}>();
</script>

<template>
  <a
    v-if="specimen.image"
    data-fancybox="gallery3"
    :href="specimen.image_url"
    :data-caption="specimen.caption"
  >
    <img
      class="rounded border p-1"
      :src="specimen.image_preview_url"
      style="max-height: 6rem; max-width: 3rem"
    />
  </a>

  <div v-else />
</template>
