<template>
  <section class="my-5">
    <div class="col-lg-12" v-if="errorMessage">
      <div role="alert" class="alert alert-warning">
        <span v-html="errorMessage"></span>
      </div>
    </div>
    <div
      id="fossilgroups_box"
      style="max-width: 1280px !important; text-align: center"
      v-if="frontPage"
    >
      <div class="fossilgroup_box" v-for="item in frontPage.results">
        <a :href="'/' + item.taxon" :title="item.taxon__taxon">
          <img
            :src="
              'https://files.geocollections.info/img/fossiilid/fossilgroups/' +
              item.taxon +
              '.png'
            "
            :alt="item.frontpage + ' (' + item.taxon__taxon + ')'"
          />
          {{ item.frontpage }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRootStore } from "~/stores/root";

const { errorMessage } = useRootStore();
const { locale } = useI18n();

type ApiListResponse<T> = {
  count: number;
  results: T[];
};
type TaxonPage = {
  frontpage: string;
  taxon: number;
  taxon__taxon: string;
};

const { data: frontPage } = useApiFetch<ApiListResponse<TaxonPage>>(
  "/taxon_page",
  {
    query: {
      on_frontpage: 1,
      language: locale.value === "se" ? "sv" : locale,
      fields: "frontpage,taxon,taxon__taxon",
      order_by: "frontpage_order",
      format: "json",
    },
  }
);
</script>

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
