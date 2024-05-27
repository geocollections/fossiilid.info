<script setup lang="ts">
import type { HorizontalNavigationLink } from "#ui/types";

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
      $solrFetch<{ response: { numFound: number } }>("/specimen", {
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
      commonNames: commonNamesRes.results ?? [],
      image: imagesRes.results[0],
      imageCount: imagesRes.count,
      specimenCount: cntSpecimenCollectionRes.response.numFound,
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

const links = computed(() => {
  const links: HorizontalNavigationLink[] = [
    {
      to: localePath({ name: "id", params: route.params, query: route.query }),
      label: t("tabs.overview"),
      exact: true,
      icon: "i-heroicons-information-circle",
    },
  ];
  if (imageCount > 0) {
    links.push({
      to: localePath({ name: "id-gallery", params: route.params, query: route.query }),
      label: t("tabs.gallery"),
      badge: imageCount,
      exact: true,
      icon: "i-heroicons-photo",
    });
  }
  if (specimenCount > 0) {
    links.push({
      to: localePath({ name: "id-specimens", params: route.params, query: route.query }),
      label: t("tabs.specimens"),
      badge: specimenCount,
      exact: true,
      icon: "i-heroicons-bug-ant",
    });
  }
  return links;
});

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
    <UHorizontalNavigation :links="links" class="border-b mb-2 border-gray-200 dark:border-gray-800" />
    <NuxtPage :taxon="taxon" :taxon-page="taxonPage" />
  </section>
</template>
