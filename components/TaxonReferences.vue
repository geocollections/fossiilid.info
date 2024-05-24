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
    <Foldable :elLength="references.length">
      <div
        :class="idx === references.length - 1 ? '' : 'my-3'"
        v-for="(reference, idx) in references"
        style="padding-left: 3em; text-indent: -3em"
      >
        <a :href="`https://geocollections.info/reference/${reference.id}`">
          {{ reference.author }}
          {{ reference.year }}.
        </a>
        <span>{{ reference.title }}.</span>
        <span v-if="reference.journal_name">
          {{ " " }}
          <em>{{ reference.journal_name }}</em>
          {{ " " }}
          <span v-if="reference.volume">
            <strong>{{ reference.volume }}</strong>
            <span>,</span>
          </span>
          {{ " " }}
          <span v-if="reference.number"> {{ reference.number }},</span>
          {{ " " }}
          <span v-if="isDefinedAndNotNull(reference.pages)">
            {{ reference.pages }}.</span
          >
        </span>
        <span v-else-if="isDefinedAndNotNull(reference.book)">
          {{ " " }}
          <em>{{ reference.book }}</em
          >, pp. {{ reference.pages }}.
        </span>
        <span v-else> pp. {{ reference.pages }}.</span>
        <span v-if="reference.publisher">
          {{ " " }}
          {{ reference.publisher }}.
        </span>
        <span v-if="reference.doi">
          <NuxtLink :href="`https://doi.org/${reference.doi}`">
            DOI:{{ reference.doi }}
          </NuxtLink>
        </span>
      </div>
    </Foldable>
  </UCard>
</template>
