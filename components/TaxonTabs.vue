<template>
  <div class="m-1 mt-3">
    <ul class="nav nav-tabs tab-links" style="flex-wrap: nowrap !important">
      <li class="nav-item">
        <a
          href="#"
          v-on:click="store.activeTab = 'overview'"
          class="nav-link"
          :class="{ active: store.activeTab === 'overview' }"
        >
          {{ $t("tabs.overview") }}
        </a>
      </li>
      <li class="nav-item" v-if="imageCount > 0">
        <a
          href="#"
          v-on:click="store.activeTab = 'gallery'"
          class="nav-link"
          :class="{ active: store.activeTab === 'gallery' }"
        >
          {{ $t("tabs.gallery") }}
        </a>
      </li>
      <li class="nav-item" v-if="specimenCount > 0">
        <a
          href="#"
          v-on:click="store.activeTab = 'specimens'"
          class="nav-link"
          :class="{ active: store.activeTab === 'specimens' }"
        >
          {{ $t("tabs.specimens") }}
          <span class="badge bg-secondary rounded-pill">
            {{ specimenCount }}
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRootStore } from "~/stores/root";
defineProps({
  specimenCount: {
    type: Number,
    required: true,
  },
  imageCount: {
    type: Number,
    required: true,
  },
});
const store = useRootStore();
</script>
