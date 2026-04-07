<script setup lang="ts">
import type { Taxon } from "#shared/types/taxon";

const props = defineProps<{
  specimen: Taxon;
  locale: "et" | "en";
}>();

function translate(value: { et?: string; en?: string }) {
  return props.locale === "et"
    ? (value.et ?? value.en ?? "")
    : (value.en ?? value.et ?? "");
}
</script>

<template>
  <div class="space-y-1">
    <div>
      <a :href="`/${specimen.taxon_id}`">{{ specimen.taxon ?? "" }}</a>

      <span v-if="specimen.taxon_txt?.length">
        |
        <template v-for="(txt, index) in specimen.taxon_txt" :key="index">
          <i>{{ txt }}</i
          ><span v-if="index < specimen.taxon_txt.length - 1">,</span>
        </template>
      </span>
    </div>

    <div v-if="specimen.rock_id">
      <a :href="`https://kivid.info/rock/${specimen.rock_id}`">
        {{ translate({ et: specimen.rock, en: specimen.rock_en }) }}
      </a>

      <span
        v-if="
          (specimen.rock_txt || specimen.rock_txt_en) &&
          (specimen.rock !== specimen.rock_txt ||
            specimen.rock_en !== specimen.rock_txt_en)
        "
      >
        |
        <i>{{
          translate({ et: specimen.rock_txt, en: specimen.rock_txt_en })
        }}</i>
      </span>
    </div>
  </div>
</template>
