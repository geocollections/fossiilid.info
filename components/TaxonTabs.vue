<template>
  <div class="m-1 mt-3">
    <ul class="nav nav-tabs tab-links" style="flex-wrap: nowrap !important">
      <li class="nav-item">
        <a
          href="#"
          v-on:click="activeTab = 'overview'"
          class="nav-link"
          :class="{ active: activeTab === 'overview' }"
        >
          {{ $t("tabs.overview") }}
        </a>
      </li>
      <li class="nav-item" v-if="$parent.images && $parent.images.length > 0">
        <a
          href="#"
          v-on:click="activeTab = 'gallery'"
          class="nav-link"
          :class="{ active: activeTab === 'gallery' }"
        >
          {{ $t("tabs.gallery") }}
        </a>
      </li>
      <li
        class="nav-item"
        v-if="
          !!$parent.specimenCollectionCnt && $parent.specimenCollectionCnt > 0
        "
      >
        <a
          href="#"
          v-on:click="activeTab = 'specimens'"
          class="nav-link"
          :class="{ active: activeTab === 'specimens' }"
        >
          {{ $t("tabs.specimens") }}
          <span class="badge bg-secondary rounded-pill">
            {{ $parent.specimenCollectionCnt }}
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { useRootStore } from "~/stores/root";

export default {
  name: "TaxonTabs",
  computed: {
    ...mapWritableState(useRootStore, ["activeTab"]),
  },
};
</script>
