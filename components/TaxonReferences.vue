<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{ taxon: Taxon }>();

const { data: referencesRes } = await useNewApiFetch<{
  results: any[];
  count: number;
}>(`/taxa/${props.taxon.id}/references/`, {
  query: {
    format: "json",
    limit: 100,
  },
});

const references = computed(() => referencesRes.value?.results ?? []);
</script>

<template>
  <UCard v-if="references.length > 0">
    <template #header>
      {{ $t("header.f_taxon_references") }}
    </template>
    <Foldable :el-length="references.length">
      <template
        v-for="(reference, idx) in references"
        :key="idx"
      >
        <ReferenceItem
          :class="idx === references.length - 1 ? '' : 'my-3'"
          :reference="reference"
        />
      </template>
    </Foldable>
  </UCard>
</template>
