<template>
  <div>
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<script>
import { useRootStore } from "./stores/root";
import { mapWritableState } from "pinia";

export default {
  name: "App",
  computed: {
    ...mapWritableState(useRootStore, ["mode"]),
  },
  created() {
    this.setLangAndMode();
  },
  watch: {
    mode: {
      handler(mode) {
        this.$router.replace({
          query: { ...this.$route.query, mode },
        });
      },
    },
    "$i18n.locale": {
      handler(lang) {
        this.$router.replace({
          query: { ...this.$route.query, lang },
        });
      },
    },
  },
  methods: {
    setLangAndMode() {
      this.$nextTick(() => {
        let lang = this.$i18n.locale,
          mode = this.mode;
        //check if manually set lang or mode value is correct otherwise set default

        if (
          this.$router.currentRoute.query?.mode &&
          this.checkIfModeIsCorrect(this.$router.currentRoute.query.mode)
        ) {
          this.mode = this.$router.currentRoute.query.mode;
        }

        if (
          this.$router.currentRoute.query?.lang &&
          this.checkIfLangIsCorrect(this.$router.currentRoute.query.lang)
        ) {
          this.$i18n.setLocale(this.$router.currentRoute.query.lang);
        }

        if (
          !this.$router.currentRoute.query?.mode ||
          !this.$router.currentRoute.query?.lang
        ) {
          //set values from cookies otherwise from default settings
          // if (
          //   this.$cookies.get("fossils_mode") &&
          //   this.checkIfModeIsCorrect(this.$cookies.get("fossils_mode"))
          // ) {
          //   mode = this.$cookies.get("fossils_mode");
          //   this.$store.commit("SET_MODE", { mode });
          // } else {
          //   //set default
          //   this.$cookies.set("fossils_mode", this.$store.state.mode);
          // }
          //
          // if (
          //   this.$cookies.get("fossils_lang") &&
          //   this.checkIfModeIsCorrect(this.$cookies.get("fossils_lang"))
          // ) {
          //   lang = this.$cookies.get("fossils_lang");
          //   this.$store.commit("SET_LANG", { lang });
          // } else {
          //   //set default
          //   this.$cookies.set("fossils_lang", this.$store.state.lang);
          // }
        }
        // this.$router.currentRoute.path
        this.$router.replace({
          query: { mode: mode, lang: lang },
        });
      });
    },
    checkIfModeIsCorrect: function (mode) {
      let isCorrect = false;
      switch (mode) {
        case "in_estonia":
        case "in_baltoscandia":
        case "in_global":
          isCorrect = true;
          break;
        default:
          break;
      }
      return isCorrect;
    },
    checkIfLangIsCorrect: function (lang) {
      let isCorrect = false;
      switch (lang) {
        case "et":
        case "en":
        case "se":
        case "fi":
          isCorrect = true;
          break;
        default:
          break;
      }
      return isCorrect;
    },
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style src="@fortawesome/fontawesome-free/css/fontawesome.css"></style>
<style src="@fortawesome/fontawesome-free/css/brands.css"></style>
<style src="@fortawesome/fontawesome-free/css/solid.css"></style>
