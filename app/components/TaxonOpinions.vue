<script setup lang="ts">
import dayjs from "dayjs";
import type { Taxon } from "../pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();

const stateRoute = useStateRoute();
const localePath = useLocalePath();

const dateAdded = computed(() => {
  return dayjs(props.taxon.date_added).format("YYYY-MM-DD");
});
const dateChanged = computed(() => {
  return dayjs(props.taxon.date_changed).format("YYYY-MM-DD");
});

const { $apiFetchNew } = useNuxtApp();
const { locale } = useI18n();

interface TaxonName {
  language: string;
  name: string;
}

interface TaxonOpinion {
  taxon: {
    id: number;
    name: string;
  };
  other_taxon: {
    id: number;
    name: string;
  };
}

const { data } = useAsyncData(
  "opinions",
  async () => {
    const opinions = await $apiFetchNew<{
      results: TaxonOpinion[];
      count: number;
    }>(`/taxa/${props.taxon.id}/taxon-opinions/`, {
      query: {
        format: "json",
        taxon: props.taxon.id,
        other_taxon__isnull: false,
        is_preferred: true,
        opinion_type__invalid: true,
        expand: "other_taxon,taxon",
        ordering: "-year",
      },
    });

    const commonNames = await $apiFetchNew<{
      results: TaxonName[];
      count: number;
    }>(`/taxa/${props.taxon.id}/taxon-names/`, {
      query: {
        is_preferred: 1,
        language: locale.value,
        fields: "language,name",
        format: "json",
        limit: 1,
      },
    });
    return { opinions, commonNames };
  },
  {
    default: () => ({
      opinions: { results: [], count: 0 },
      commonNames: { results: [], count: 0 },
    }),
  },
);

const opinions = computed(() => {
  return data.value?.opinions.results || [];
});

const commonNames = computed(() => {
  return data.value?.commonNames.results || [];
});

function isHigherTaxon(rank: string | undefined | null) {
  if (!rank)
    return false;
  // return !['Species','Subspecies','Genus','Supergenus','Subgenus'].includes(rank)
  return !(
    ["Species", "Subspecies", "Genus", "Supergenus", "Subgenus"].includes(rank)
  );
}

function convertToDecimal(value: number) {
  return value.toFixed(1);
}

const store = useRootStore();
const geocollectionUrl = "https://geocollections.info" as const;
const numberOfSpecimen = ref(0);
</script>

<template>
  <div v-if="data.opinions.count > 0" class="space-y-2">
    <UAlert
      :title="$t('header.f_name_is_invalid')"
      :ui="{ title: 'text-red-800 dark:text-red-200' }"
      color="red"
      variant="subtle"
      style="width: 100%"
    >
      <template #title="{ title }">
        {{ title }}
        <span v-for="(item, index) in opinions" :key="index">
          <span v-if="index !== 0">,&nbsp;</span>
          <NuxtLink :to="stateRoute(localePath(`/${item.other_taxon.id}`))">
            {{ item.other_taxon.name }}
          </NuxtLink>
        </span>
      </template>
    </UAlert>
    <div
      class="rounded-lg border bg-white p-4 dark:bg-gray-800"
      style="width: 100%"
    >
      <div class="card-body">
        <div class="pb-2 text-sm text-gray-500">
          Taxon ID:
          <strong>{{ taxon.id }}</strong>
          <span v-if="taxon.date_added">
            |
            {{ dateAdded }}
          </span>
          <span v-if="taxon.date_changed">
            /
            {{ dateChanged }}
          </span>
        </div>

        <div v-if="taxon.fossil_group && taxon.fossil_group.id !== taxon.id">
          {{ $t("header.f_fossil_group") }}:
          <NuxtLink :to="stateRoute(localePath(`/${taxon.fossil_group.id}`))">
            {{ taxon.fossil_group.name }}
          </NuxtLink>
        </div>
        <div v-if="taxon.parent">
          {{ $t("header.f_belongs_to") }}:
          <NuxtLink
            :class="isHigherTaxon(taxon.rank?.rank_en) ? '' : 'italic'"
            :to="stateRoute(localePath(`/${taxon.parent.id}`))"
          >
            {{ taxon.parent.name }}
          </NuxtLink>
        </div>
        <div>
          {{ $t("header.f_other_names") }}:
          <span v-for="(item, idx) in opinions" :key="idx">
            <template v-if="item.other_taxon">
              <span v-if="idx !== 0">,&nbsp;</span>
              <NuxtLink :to="stateRoute(localePath(`/${item.other_taxon.id}`))">
                {{ item.other_taxon.name }}
              </NuxtLink>
            </template>
          </span>
        </div>

        <!-- NOTE: There is no case where taxon has opinions and common names. So this will never be true -->
        <div v-if="commonNames.length > 0">
          <span v-for="(item, idx) in commonNames" :key="idx">
            {{ item.language }}:
            <strong>{{ item.name }}</strong>
            ;&ensp;
          </span>
        </div>
        <div v-if="taxon.stratigraphy_base || taxon.stratigraphy_top">
          {{ $t("header.f_stratigraphical_distribution") }}:

          <a
            v-if="taxon.stratigraphy_base"
            :href="`${geocollectionUrl}/stratigraphy/${taxon.stratigraphy_base.id}`"
          >
            {{
              $translate({
                et: taxon.stratigraphy_base.name,
                en: taxon.stratigraphy_base.name_en,
              })
            }}
          </a>
          <template
            v-if="
              taxon.stratigraphy_top
                && taxon.stratigraphy_base
                && taxon.stratigraphy_top.id !== taxon.stratigraphy_base.id
            "
          >
            &rarr;
          </template>
          <a
            v-if="
              taxon.stratigraphy_top
                && taxon.stratigraphy_base?.id !== taxon.stratigraphy_top.id
            "
            :href="`${geocollectionUrl}/stratigraphy/${taxon.stratigraphy_top.id}`"
          >
            {{
              $translate({
                et: taxon.stratigraphy_top.name,
                en: taxon.stratigraphy_top.name_en,
              })
            }}
          </a>
          <span v-if="taxon.stratigraphy_base?.age_base">
            ({{ $t("header.f_taxon_age_within") }}
            {{ convertToDecimal(taxon.stratigraphy_base.age_base) }}
          </span>
          <span v-if="taxon.stratigraphy_top?.age_top">
            &ndash;
            {{ convertToDecimal(taxon.stratigraphy_top.age_top) }}
            {{ $t("header.f_taxon_age_within_unit") }})
          </span>
          <br>
        </div>
        <div v-if="taxon.rank?.rank_en !== 'Species'">
          <span v-if="store.mode === 'in_baltoscandia'">
            {{ $t("header.f_baltic_species") }}
          </span>
          <span v-else-if="store.mode === 'in_estonia'">
            {{ $t("header.f_estonian_species") }}
          </span>
          <span v-else>{{ $t("header.f_global_species") }}</span>
          <strong>
            <a v-if="numberOfSpecimen" href="#species">
              {{ numberOfSpecimen }}
            </a>
          </strong>
        </div>
      </div>
    </div>
  </div>
</template>
