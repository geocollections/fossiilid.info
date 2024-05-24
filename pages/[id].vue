<script setup lang="ts">
const route = useRoute();
const { t, locale } = useI18n();
const stateRoute = useStateRoute();
const localePath = useLocalePath();

const activeSection = ref("info");

export interface Taxon {
  id: number;
  name: string;
  parent?: {
    id: number;
    name: string;
  };
  rank?: {
    rank: string;
    rank_en: string;
  };

  fossil_group?: {
    id: number;
    name: string;
  };
  is_fossil_group?: boolean;
  hierarchy_string?: string;
  author_year?: string;
  date_added?: string;
  date_changed?: string;
  stratigraphy_base?: {
    id: number;
    name: string;
    name_en: string;
    age_base?: number;
  };
  stratigraphy_top?: {
    id: number;
    name: string;
    name_en: string;
    age_top?: number;
  };
  tol_id?: number;
  eol_id?: number;
  nrm_id?: string;
  plutof_id?: number;
  pbdb_id?: number;
}

export interface TaxonPage {
  title: string;
  content: string;
  author_text?: string;
  date_text?: string;
  link_wikipedia?: string;
}

const { $solrFetch, $apiFetchNew } = useNuxtApp();
const img = useImage();

const { data } = await useAsyncData(
  "taxon",
  async () => {
    const taxon = await $apiFetchNew<Taxon>(`/taxa/${route.params.id}/`, {
      query: {
        expand: "rank,fossil_group,stratigraphy_base,stratigraphy_top,parent",
        fields: [
          "id",
          "name",
          "parent.id",
          "parent.name",
          "rank.rank",
          "rank.rank_en",
          "fossil_group.id",
          "fossil_group.name",
          "is_fossil_group",
          "hierarchy_string",
          "author_year",
          "date_added",
          "date_changed",
          "stratigraphy_base.id",
          "stratigraphy_base.name",
          "stratigraphy_base.name_en",
          "stratigraphy_base.age_base",
          "stratigraphy_top.id",
          "stratigraphy_top.name",
          "stratigraphy_top.name_en",
          "stratigraphy_top.age_top",
          "tol_id",
          "eol_id",
          "nrm_id",
          "plutof_id",
          "pbdb_id",
        ].join(","),
        format: "json",
      },
      onResponseError: (_err) => {
        showError({
          statusCode: 404,
          statusMessage: "Page not found",
          fatal: true,
        });
      },
    });

    const [
      pageRes,
      commonNamesRes,
      descriptionRes,
      cntSpecimenCollectionRes,
      imagesRes,
    ] = await Promise.all([
      $apiFetchNew<{ results?: TaxonPage[] }>(
        `/taxa/${taxon.id}/taxon-pages/`,
        {
          query: {
            language: locale.value,
            fields: "title,content,author_txt,date_txt,link_wikipedia",
            format: "json",
            limit: 1,
          },
        },
      ),
      $apiFetchNew<{ results?: any[] }>(`/taxa/${taxon.id}/taxon-names/`, {
        query: {
          is_preferred: 1,
          language: locale.value,
          fields: "language,name",
          format: "json",
          limit: 1,
        },
      }),
      $apiFetchNew<{ results?: any[] }>(
        `/taxa/${taxon.id}/taxon-descriptions/`,
        {
          query: {
            fields: "description",
            format: "json",
            order_by: "-id",
            limit: 1,
          },
        },
      ),
      $solrFetch<{ count: number }>("/specimen/", {
        query: {
          q: `hierarchy_string:(${taxon.hierarchy_string}*)`,
          rows: 0,
          format: "json",
        },
      }),
      $apiFetchNew<{ results: any[]; count: number }>(
        `/taxa/${taxon.id}/images/`,
        {
          query: {
            format: "json",
            limit: 1,
          },
        },
      ),
    ]);
    return {
      taxon,
      taxonPage: pageRes.results?.[0],
      description: descriptionRes.results?.[0],
      commonNames: commonNamesRes.results?.[0],
      image: imagesRes.results[0],
      imageCount: imagesRes.count,
      specimenCount: cntSpecimenCollectionRes.count,
    };
  },
  {
    default: () => ({
      taxon: null as Taxon | null,
      description: null as any | null,
      commonNames: [] as any[],
      taxonPage: null as any | null,
      image: null as any | null,
      imageCount: 0,
      specimenCount: 0,
    }),
  },
);

const {
  taxon,
  taxonPage,
  description,
  commonNames,
  image,
  imageCount,
  specimenCount,
} = data.value;

const tabs = computed(() => [
  { slot: "info", label: t("tabs.overview") },
  {
    slot: "images",
    label: t("tabs.gallery"),
    count: imageCount,
    disabled: imageCount < 1,
  },
  {
    slot: "specimens",
    label: t("tabs.specimens"),
    count: specimenCount,
    disabled: specimenCount < 1,
  },
]);

const titleImage = computed(() => {
  if (!taxon?.fossil_group)
    return;
  return img(`/fossilgroups/${taxon.fossil_group.id}.png`);
});

const taxonTitle = computed(() => {
  if (taxonPage && taxonPage.title)
    return taxonPage.title;
  if (commonNames.length > 0)
    return commonNames[0].name;
  return null;
});

if (image) {
  defineOgImage({
    url: img(image.filename, { size: "large" }, { provider: "geocollections" }),
  });
}

function isHigherTaxon(rank: string | undefined | null) {
  if (!rank)
    return false;
  return !["Species", "Subspecies", "Genus", "Supergenus", "Subgenus"].includes(
    rank,
  );
}

const showTitleImage = ref(true);

function handleTitleImageError() {
  showTitleImage.value = false;
}
</script>

<template>
  <Head>
    <Title>{{ taxon?.name }}</Title>
    <Meta
      v-if="description?.description"
      name="description"
      :content="description?.description"
    />
  </Head>
  <section v-if="taxon" class="container">
    <div class="mb-4 flex items-center gap-x-2">
      <ClientOnly>
        <NuxtLink
          v-if="taxon.fossil_group?.id && showTitleImage"
          :href="stateRoute(localePath(`/${taxon.fossil_group.id}`))"
        >
          <img
            class="taxon-img"
            height="120"
            width="120"
            border="0"
            :src="titleImage"
            :alt="taxon.fossil_group.name"
            :title="taxon.fossil_group.name"
            @error="handleTitleImageError"
          >
        </NuxtLink>
      </ClientOnly>
      <div>
        <div>
          {{
            $translate({
              et: taxon.rank?.rank,
              en: taxon.rank?.rank_en,
            })
          }}
        </div>
        <h1
          class="inline text-5xl font-bold"
          :class="isHigherTaxon(taxon.rank?.rank_en) ? '' : 'italic'"
        >
          {{ taxon.name }}
          <span class="text-xl">{{ taxon.author_year }}</span>
        </h1>
        <h2
          v-if="taxon.fossil_group && isHigherTaxon(taxon.rank?.rank_en)"
          class="text-2xl"
        >
          {{ taxonTitle }}
        </h2>
      </div>
    </div>
    <div
      class="relative mb-2 inline-grid h-10 w-full items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
      style="grid-template-columns: repeat(3, minmax(0px, 1fr))"
    >
      <UButton
        v-for="(tab, index) in tabs"
        :key="index"
        variant="ghost"
        color="white"
        :class="{
          'bg-white dark:bg-gray-900': activeSection === tab.slot,
        }"
        :disabled="tab.disabled"
        :ui="{
          base: 'flex items-center justify-center text-sm h-8',
          color: {
            white: {
              ghost: 'dark:hover:disabled:bg-inherit hover:disabled:bg-inherit',
            },
          },
        }"
        :tabindex="!tab.disabled ? '0' : '-1'"
        @click="activeSection = tab.slot"
      >
        <span class="mr-1">
          {{ tab.label }}
        </span>
        <UBadge v-if="tab.count" variant="subtle">
          {{ tab.count }}
        </UBadge>
      </UButton>
    </div>
    <OverviewTaxon
      v-if="activeSection === 'info'"
      :taxon="taxon"
      :taxon-page="taxonPage"
    />
    <TabGallery v-if="activeSection === 'images'" :taxon="taxon" />
    <TabSpecimens v-if="activeSection === 'specimens'" :taxon="taxon" />
  </section>
</template>
