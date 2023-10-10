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
      v-if="content"
    >
      <div class="fossilgroup_box" v-for="item in content">
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

<script>
import { mapState } from "pinia";
import { useRootStore } from "../stores/root.js";
export default defineNuxtComponent({
  computed: {
    ...mapState(useRootStore, ["errorMessage"]),
    content() {
      if (this.$i18n.locale === "et") return this.frontPage.et;
      else if (this.$i18n.locale === "en") return this.frontPage.en;
      else if (this.$i18n.locale === "fi") return this.frontPage.fi;
      else if (this.$i18n.locale === "se") return this.frontPage.se;
      return this.$i18n.locale === "et" ? this.frontPage.et : this.frontPage.en;
    },
  },

  watch: {
    "$i18n.locale": {
      async handler(newVal, oldVal) {
        const res = await $fetch(
          this.$i18n.locale === "se"
            ? `/taxon_page/?language=sv&on_frontpage=1&order_by=frontpage_order&fields=frontpage,taxon,taxon__taxon&format=json`
            : `/taxon_page/?language=${this.$i18n.locale}&on_frontpage=1&order_by=frontpage_order&fields=frontpage,taxon,taxon__taxon&format=json`,
          { baseURL: "https://api.geocollections.info" },
        );
        this.frontPage[this.$i18n.locale] = res.results;
      },
    },
  },
  async asyncData({ $i18n }) {
    const res = await $fetch(
      $i18n.locale.value === "se"
        ? `/taxon_page/?language=sv&on_frontpage=1&order_by=frontpage_order&fields=frontpage,taxon,taxon__taxon&format=json`
        : `/taxon_page/?language=${$i18n.locale.value}&on_frontpage=1&order_by=frontpage_order&fields=frontpage,taxon,taxon__taxon&format=json`,
      { baseURL: "https://api.geocollections.info" },
    );
    return {
      frontPage: {
        [$i18n.locale.value]: res.results,
      },
    };
  },
});
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
