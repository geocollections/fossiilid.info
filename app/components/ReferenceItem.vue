<script setup lang="ts">
import type { Reference } from "~/pages/[id].vue";

const props = defineProps<{ reference: Reference }>();
const { t } = useI18n();
const selected = ref(false);

function handleCopy() {
  selected.value = true;
  useTimeout(3000, {
    callback: () => {
      selected.value = false;
    },
  });
}

async function copyCitation() {
  const { data: citation } = await useNewApiFetch<{ text: string }>(`/references/${props.reference.id}`, {
    query: {
      format: "reference",
      style: "apa",
      reference_format: "json",
    },
  });

  if (citation.value === undefined) {
    return;
  }

  try {
    await navigator.clipboard.writeText(citation.value.text);
    handleCopy();
  }
  catch (err) {
    console.error("Failed to copy:", err);
  }
}
</script>

<template>
  <li class="flex justify-between group hover:ring ring-gray-200 md:p-2 rounded">
    <article
      class="reference-citation"
      style="padding-left: 3em; text-indent: -3em"
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
      >
        {{ " " }}
        <cite class="journal-name">{{ reference.journal_name }}</cite>
        {{ " " }}
        <span v-if="reference.volume" class="volume">
          <strong>{{ reference.volume }}</strong>
          <span aria-hidden="true">,</span>
        </span>
        {{ " " }}
        <span v-if="reference.number" class="issue-number">
          {{ reference.number }}<span aria-hidden="true">,</span>
        </span>
        {{ " " }}
        <span v-if="isDefinedAndNotNull(reference.pages)" class="pages">
          {{ reference.pages }}.
        </span>
      </span>

      <span
        v-else-if="isDefinedAndNotNull(reference.book)"
        class="book-info"
      >
        {{ " " }}
        <cite class="book-title">{{ reference.book }}</cite>,
        <span class="pages">pp. {{ reference.pages }}.</span>
      </span>

      <span v-else class="pages">
        pp. {{ reference.pages }}.
      </span>

      <span v-if="reference.publisher" class="publisher">
        {{ " " }}
        {{ reference.publisher }}.
      </span>

      <span v-if="reference.doi" class="doi-link whitespace-break-spaces break-all">
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
    <UButton variant="outline" :icon="selected ? 'i-lucide-clipboard-check' : 'i-lucide-copy' " class="h-8 scale-90 md:opacity-0 group-hover:opacity-90 " :aria-label="t('reference.copy')" @click="copyCitation" />
  </li>
</template>
