<script setup lang="ts">
const props = defineProps<{ reference: any; copiedReference: any }>();
const emit = defineEmits(["copy"]);

const { t } = useI18n();

async function copyCitation() {
  const { data: citation } = await useNewApiFetch(`/references/${props.reference.id}`, {
    query: {
      format: "reference",
      style: "apa",
      reference_format: "json",
    },
  });
  try {
    await navigator.clipboard.writeText(citation.value?.text);
    emit("copy", props.reference.id);
  }
  catch (err) {
    console.error("Failed to copy:", err);
  }
}
</script>

<template>
  <li class="flex justify-between">
    <article
      class="reference-citation"
      style="padding-left: 3em; text-indent: -3em"
      role="article"
      :aria-label="t('reference.citation')"
    >
      <a
        :href="`https://kirjandus.geoloogia.info/reference/${reference.id}`"
        :aria-label="t('reference.viewFull')"
      >
        {{ reference.author }}
        <time :datetime="reference.year">{{ reference.year }}</time>.
      </a>

      <cite class="reference-title">{{ reference.title }}.</cite>

      <span
        v-if="reference.journal_name"
        class="journal-info"
        role="group"
        :aria-label="t('reference.journalDetails')"
      >
        {{ " " }}
        <cite class="journal-name">{{ reference.journal_name }}</cite>
        {{ " " }}
        <span v-if="reference.volume" class="volume">
          <strong :aria-label="t('reference.volume')">{{ reference.volume }}</strong>
          <span aria-hidden="true">,</span>
        </span>
        {{ " " }}
        <span v-if="reference.number" class="issue-number" :aria-label="t('reference.issue')">
          {{ reference.number }}<span aria-hidden="true">,</span>
        </span>
        {{ " " }}
        <span v-if="isDefinedAndNotNull(reference.pages)" class="pages" :aria-label="t('reference.pages')">
          {{ reference.pages }}.
        </span>
      </span>

      <span
        v-else-if="isDefinedAndNotNull(reference.book)"
        class="book-info"
        role="group"
        :aria-label="t('reference.bookDetails')"
      >
        {{ " " }}
        <cite class="book-title">{{ reference.book }}</cite>,
        <span class="pages" :aria-label="t('reference.pages')">pp. {{ reference.pages }}.</span>
      </span>

      <span v-else class="pages" :aria-label="t('reference.pages')">
        pp. {{ reference.pages }}.
      </span>

      <span v-if="reference.publisher" class="publisher" :aria-label="t('reference.publisher')">
        {{ " " }}
        {{ reference.publisher }}.
      </span>

      <span v-if="reference.doi" class="doi-link">
        <NuxtLink
          :href="`https://doi.org/${reference.doi}`"
          :aria-label="t('reference.doi')"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://doi.org/{{ reference.doi }}
        </NuxtLink>
      </span>
    </article>
    <UButton variant="outline" :icon="props.copiedReference === props.reference.id ? 'i-lucide-clipboard-check' : 'i-lucide-copy' " class="h-8 scale-90" :aria-label="t('reference.copy')" @click="copyCitation" />
  </li>
</template>
