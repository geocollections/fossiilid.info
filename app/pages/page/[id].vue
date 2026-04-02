<script setup lang="ts">
interface Webpage {
  id: number;
  content_en: string | null;
  content_et: string | null;
  menu_title_en: string | null;
  menu_title_et: string | null;
  title_en: string | null;
  title_et: string | null;
}

const route = useRoute();
const { locale } = useI18n();
const { data: pages } = await useApiFetch<{ results: Webpage[] }>("/webpages", {
  query: {
    id: route.params.id,
    format: "json",
  },
});

const page = computed(() => pages.value?.results[0]);

if (!page.value)
  clearError({ redirect: "/" });

const meta = computed(() => {
  return [page.value?.menu_title_et, page.value?.title_et].join(", ");
});
const currentContent = computed(() => {
  return locale.value === "et"
    ? page.value?.content_et
    : page.value?.content_en;
});
</script>

<template>
  <Head>
    <Title>
      {{ (page && page.menu_title_et) || "Fossiilid" }}
    </Title>
    <Meta vmid="keywords" name="keywords" :content="meta" />
  </Head>
  <section class="container rounded border bg-white p-4 dark:bg-gray-800">
    <div v-if="page" id="content" class="text-justify">
      <span class="card-body" v-html="currentContent" />
    </div>
  </section>
</template>

<style>
h1 {
  @apply pb-4;
  font-size: 2.5rem;
}
h3 {
  @apply pt-4;
  font-size: 1.75rem;
}
</style>
