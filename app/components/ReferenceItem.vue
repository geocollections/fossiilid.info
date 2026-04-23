<script setup lang="ts">
defineProps<{ reference: any }>();
</script>

<template>
  <div
    style="padding-left: 3em; text-indent: -3em"
  >
    <a :href="`https://kirjandus.geoloogia.info/reference/${reference.id}`">
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
        {{ reference.pages }}.</span>
    </span>
    <span v-else-if="isDefinedAndNotNull(reference.book)">
      {{ " " }}
      <em>{{ reference.book }}</em>, pp. {{ reference.pages }}.
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
</template>
