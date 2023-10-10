<template>
  <div v-bind:class="langButtonsStyle()">
    <span @click="changeLang('ee')" class="p-2">
      EST &nbsp;
      <span class="flag-icon flag-icon-ee flag-icon-squared circle-flag"></span>
    </span>
    <span @click="changeLang('en')" class="p-2">
      ENG &nbsp;
      <span class="flag-icon flag-icon-gb flag-icon-squared circle-flag"></span>
    </span>
    <span @click="changeLang('fi')" class="p-2">
      FIN &nbsp;
      <span class="flag-icon flag-icon-fi flag-icon-squared circle-flag"></span>
    </span>
    <span @click="changeLang('se')" class="p-2">
      SWE &nbsp;
      <span class="flag-icon flag-icon-se flag-icon-squared circle-flag"></span>
    </span>
  </div>
</template>

<script>
import { mapActions } from "pinia";

import { useRootStore } from "../stores/root.js";
export default {
  name: "LangButtons",
  props: {
    langClass: String,
  },
  methods: {
    ...mapActions(useRootStore, ["setLang"]),
    langButtonsStyle() {
      return this.$props.langClass === "header"
        ? "lang-buttons p-3"
        : "footer-lang-buttons p-3";
    },
    changeLang(lang) {
      this.$i18n.locale = lang;
      if (lang === "ee") lang = "et";
      // this.$store.commit("SET_LANG", { lang });
      this.setLang(lang);
      // this.$localStorage.set("lang", lang);
      let query = this.$router.currentRoute.query;
      query.lang = lang;
      this.$router.push({ path: this.$router.currentRoute.path, query: query });

      // this.toastInfo(this.$t('messages.langChange'))
    },
    //
    // toastInfo(text) {
    //   this.$toast.info(text, 'Info', {
    //     position: 'bottomRight',
    //     timeout: 2000,
    //     pauseOnHover: false
    //   })
    // },
  },
};
</script>

<style lang="sass" scoped>
.lang-buttons
  position: absolute
  right: 0


.lang-buttons > span:hover
  cursor: pointer
  background-color: #f8f9fa


.lang-buttons > span:active
  font-weight: bold


.footer-lang-buttons > span:hover
  cursor: pointer
  background-color: #f8f9fa


.footer-lang-buttons > span:active
  font-weight: bold


.circle-flag
  border-radius: 100%
</style>
