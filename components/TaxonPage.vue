<script setup lang="ts">
import type { TaxonPage } from "~/pages/[id].vue";

defineProps<{
  taxonPage: TaxonPage;
}>();
</script>

<template>
  <UCard v-if="taxonPage?.content">
    <template #header>
      {{ $t("header.f_taxon_intro") }}
    </template>
    <div id="content" class="text-justify" v-html="taxonPage.content" />
    <template #footer>
      <span class="text-sm italic">
        {{ taxonPage.author_text }} {{ taxonPage.date_text }}
      </span>
    </template>
  </UCard>
</template>

<style lang="scss">
.figcaption {
  @apply text-sm;
  @apply m-2;
  @apply p-2;
  @apply bg-white;
  @apply border;
  @apply border-gray-300;
  @apply rounded-md;
}

.figcaption img {
  @apply pb-2;
  @apply border-b;
}

.figcaption p {
  @apply pt-2;
  @apply font-serif;
  @apply text-base;
}
</style>
