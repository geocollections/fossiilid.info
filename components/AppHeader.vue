<template>
  <header class="border-bottom">
    <span id="top"></span>
    <div class="container-fluid">
      <nav
        id="mainNav"
        class="navbar navbar-expand-md navbar-light border-bottom fixed-top px-3"
      >
        <NuxtLink
          class="navbar-brand"
          :style="{
            color: scroll ? '#eb3812' : '',
            // 'letter-spacing': scroll ? '0px':'2px',
            'font-size': scroll ? '18px' : 'larger',
            'text-transform': 'uppercase',
            'font-weight': '700 !important',
          }"
          to="/"
        >
          {{ $t("header.title") }}
        </NuxtLink>
        <button
          class="mb-2 mt-2 navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#nav_collapse"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse navbar-collapse"
          id="nav_collapse"
          style="display: none"
        >
          <ul class="navbar-nav ms-auto">
            <form class="d-flex my-lg-0 me-5">
              <vue-multiselect
                class="align-middle"
                style="width: 20em !important"
                id="search"
                :custom-label="displayResults"
                track-by="code"
                :placeholder="$t('search.fossils_search')"
                :options="searchResults"
                :searchable="true"
                :loading="isLoading"
                :max-height="600"
                :show-no-results="false"
                :show-labels="false"
                @select="onSelect"
                @search-change="simpleTaxonSearchApiCall"
              >
                <template slot="noResult"><b>NoRes</b></template>
              </vue-multiselect>
              &ensp;
              <a href="/search" class="nav-link">
                <i class="fas fa-search-plus"></i>
              </a>
            </form>
            <li class="nav-item dropdown" right>
              <a
                class="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-expanded="false"
              >
                {{ $t(modeText) }}
              </a>
              <ul class="dropdown-menu">
                <button
                  class="dropdown-item"
                  @click="changeMode('in_estonia')"
                  :class="mode === 'in_estonia' ? 'fw-bold' : ''"
                >
                  {{ $t("header.in_estonia_mode") }}
                </button>
                <button
                  class="dropdown-item"
                  @click="changeMode('in_baltoscandia')"
                  :class="mode === 'in_baltoscandia' ? 'fw-bold' : ''"
                >
                  {{ $t("header.in_baltoscandia_mode") }}
                </button>
                <button
                  class="dropdown-item"
                  @click="changeMode('in_global')"
                  :class="mode === 'in_global' ? 'fw-bold' : ''"
                >
                  {{ $t("header.global_mode") }}
                </button>
              </ul>
            </li>
            <li class="nav-item dropdown" right>
              <a
                class="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-expanded="false"
              >
                {{ langCode }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    class="dropdown-item p-2"
                    @click="changeLang('et')"
                    :class="$i18n.locale === 'et' ? 'fw-bold' : ''"
                  >
                    EST &nbsp;
                    <span
                      class="flag-icon flag-icon-ee flag-icon-squared circle-flag"
                    ></span>
                  </button>
                </li>
                <li>
                  <button
                    @click="changeLang('en')"
                    :class="$i18n.locale === 'en' ? 'fw-bold' : ''"
                    class="dropdown-item p-2"
                  >
                    ENG &nbsp;
                    <span
                      class="flag-icon flag-icon-gb flag-icon-squared circle-flag"
                    ></span>
                  </button>
                </li>
                <li>
                  <button
                    @click="changeLang('fi')"
                    :class="$i18n.locale === 'fi' ? 'fw-bold' : ''"
                    class="dropdown-item p-2"
                  >
                    FIN &nbsp;
                    <span
                      class="flag-icon flag-icon-fi flag-icon-squared circle-flag"
                    ></span>
                  </button>
                </li>
                <li>
                  <button
                    @click="changeLang('se')"
                    :class="$i18n.locale === 'se' ? 'fw-bold' : ''"
                    class="dropdown-item p-2"
                  >
                    SWE &nbsp;
                    <span
                      class="flag-icon flag-icon-se flag-icon-squared circle-flag"
                    ></span>
                  </button>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown" right>
              <a
                class="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-expanded="false"
              >
                {{ $t("menu.more") }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <NuxtLink to="/page/28" class="dropdown-item">
                    {{ $t("menu.fossils") }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/page/29" class="dropdown-item">
                    {{ $t("menu.collecting") }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/page/30" class="dropdown-item">
                    {{ $t("menu.identifying") }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="https://geocollections.info"
                    class="dropdown-item"
                  >
                    {{ $t("menu.geocollections") }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
</template>
<script>
import VueMultiselect from "vue-multiselect";
import LangButtons from "../components/LangButtons.vue";

import { mapWritableState } from "pinia";
import { useRootStore } from "../stores/root";
export default defineNuxtComponent({
  name: "app-header",
  components: {
    VueMultiselect,
    LangButtons,
  },

  data() {
    return {
      scroll: false,
      searchResults: [],
      isLoading: false,
      selectedTaxon: null,
    };
  },
  computed: {
    ...mapWritableState(useRootStore, ["mode"]),
    langCode() {
      let code = "ENG";
      switch (this.$i18n.locale) {
        case "et":
          code = "EST";
          break;
        case "se":
          code = "SWE";
          break;
        case "fi":
          code = "FIN";
          break;
        default:
          break;
      }
      return code;
    },
    modeText() {
      if (this.mode === "in_baltoscandia") return "header.in_baltoscandia_mode";
      else if (this.mode === "in_estonia") return "header.in_estonia_mode";
      else return "header.global_mode";
    },
  },
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    simpleTaxonSearchApiCall(value) {
      if (value.length < 3) this.searchResults = [];
      if (value.length > 2) {
        this.isLoading = true;
        $fetch(`taxon/?sql=simple_taxon_search&keyword=${value}&format=json`, {
          baseURL: "https://api.geocollections.info",
        }).then((response) => {
          this.isLoading = false;
          this.searchResults = response.results;
        });
      }
    },
    onSelect(value) {
      this.selectedTaxon = null;
      location.replace("/" + value.id);
    },
    displayResults: function (item) {
      return `${item.name}`;
    },
    changeLang(lang) {
      this.$i18n.setLocale(lang);
    },
    changeMode: function (mode) {
      this.mode = mode;
    },
    handleScroll(e) {
      this.scroll = document.documentElement.scrollTop > 1;
    },
  },
});
</script>
