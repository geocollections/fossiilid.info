<script setup lang="ts">
const { locale } = useI18n();
const stateRoute = useStateRoute();
const localePath = useLocalePath();
defineOgImage({
  url: "https://files.geocollections.info/img/fossiilid/fossiilid.png",
});
interface ApiListResponse<T> {
  count: number;
  results: T[];
}
interface TaxonPage {
  frontpage: string;
  taxon: number;
  taxon__taxon: string;
}

const { data: frontPage } = await useApiFetch<ApiListResponse<TaxonPage>>(
  "/taxon_page",
  {
    query: {
      on_frontpage: 1,
      language: locale.value === "se" ? "sv" : locale.value,
      fields: "frontpage,taxon,taxon__taxon",
      order_by: "frontpage_order",
      format: "json",
    },
  },
);
</script>

<template>
  <section class="container mx-auto space-y-10">
    <h1
      class="text-center text-3xl uppercase text-gray-500 dark:text-gray-300 sm:text-4xl md:text-5xl"
    >
      fossiilid.info
    </h1>
    <div
      v-if="frontPage"
      id="fossilgroups_box"
      class="flex flex-wrap justify-center"
    >
      <div
        v-for="(item, idx) in frontPage.results"
        :key="idx"
        class="text-center"
      >
        <NuxtLink
          class="text-primary"
          :to="stateRoute({ path: localePath(`/${item.taxon}`) })"
          :title="item.taxon__taxon"
        >
          <img
            :src="`https://files.geocollections.info/img/fossiilid/fossilgroups/${item.taxon}.png`"
            :alt="`${item.frontpage} (${item.taxon__taxon})`"
            width="150"
            height="150"
          >
          {{ item.frontpage }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style>
.css-loader {
  border: 10px solid #f3f3f3;
  border-top: 10px solid rgb(240, 95, 64);
  border-radius: 50%;
  width: 180px;
  height: 180px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
