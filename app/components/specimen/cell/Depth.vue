<script setup lang="ts">
import type { Specimen } from "#shared/types/specimen";

defineProps<{
  specimen: Specimen;
}>();
</script>

<template>
  <span>
    {{ specimen.depth ?? "" }}
    <span v-if="specimen.depth_interval"> - {{ specimen.depth_interval }}</span>
  </span>
</template>
