<script setup lang="ts">
import type { Specimen } from "#shared/types/specimen";

defineProps<{
  specimen: Specimen;
  href: string;
}>();
</script>

<template>
  <a :href="href"> {{ specimen.acronym }} {{ specimen.specimen_number }} </a>
</template>
