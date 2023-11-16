<template>
  <Head>
    <Title>{{ taxon?.taxon }}</Title>
    <Meta name="description" :content="description[0]?.description" />
  </Head>
  <section v-if="taxon" class="container">
    <div class="flex items-center gap-x-2 mb-4">
      <NuxtLink
        :href="'/' + taxon.fossil_group__id"
        v-if="taxon.fossil_group__id != null"
      >
        <img
          class="taxon-img"
          height="120"
          width="120"
          border="0"
          :src="`/fossilgroups/${taxon.fossil_group__id}.png`"
          :alt="taxon.fossil_group__taxon"
          :title="taxon.fossil_group__taxon"
        />
      </NuxtLink>
      <div>
        <div>
          {{
            $translate({
              et: taxon.rank__rank,
              en: taxon.rank__rank_en,
            })
          }}
        </div>
        <h1
          class="font-bold inline text-5xl"
          :class="isHigherTaxon(taxon.rank__rank_en) ? '' : 'italic'"
        >
          {{ taxon.taxon }}
          <span class="text-xl">{{ taxon.author_year }}</span>
        </h1>
        <h2
          v-if="taxon.fossil_group__id && isHigherTaxon(taxon.rank__rank_en)"
          class="text-2xl"
        >
          {{ taxonTitle }}
        </h2>
      </div>
    </div>
    <div
      class="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full h-10 inline-grid items-center mb-2"
      style="grid-template-columns: repeat(3, minmax(0px, 1fr))"
    >
      <UButton
        v-for="tab in tabs"
        variant="ghost"
        color="white"
        :class="{
          'bg-white dark:bg-gray-900': state.activeSection === tab.slot,
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
        @click="state.activeSection = tab.slot"
      >
        <span class="mr-1">
          {{ tab.label }}
        </span>
        <UBadge v-if="tab.count" variant="subtle">
          {{ tab.count }}
        </UBadge>
      </UButton>
    </div>
    <div v-if="state.activeSection === 'info'" class="grid grid-cols-3 gap-x-2">
      <div class="col-span-full lg:col-span-2 space-y-2">
        <div class="space-y-2" v-if="opinions.length > 0">
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
                <NuxtLink :href="`/${item.other_taxon}`">
                  {{ item.other_taxon__taxon }}
                </NuxtLink>
              </span>
            </template>
          </UAlert>
          <div
            class="border rounded-lg p-4 bg-white dark:bg-gray-800"
            style="width: 100%"
          >
            <div class="card-body">
              <div class="text-sm text-gray-500 pb-2">
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

              <div
                v-if="
                  taxon.fossil_group__id && taxon.fossil_group__id !== taxon.id
                "
              >
                {{ $t("header.f_fossil_group") }}:
                <NuxtLink :href="`/${taxon.fossil_group__id}`">
                  {{ taxon.fossil_group__taxon }}
                </NuxtLink>
              </div>
              <div v-if="taxon.id !== 29">
                {{ $t("header.f_belongs_to") }}:
                <NuxtLink
                  :class="isHigherTaxon(taxon.rank__rank_en) ? '' : 'italic'"
                  :href="`/${taxon.parent}`"
                >
                  {{ taxon.parent__taxon }}
                </NuxtLink>
              </div>
              <div v-if="opinions.length > 0">
                1 {{ $t("header.f_other_names") }}:
                <span v-for="(item, idx) in opinions" :key="idx">
                  <span v-if="isDefinedAndNotNull(item.other_taxon)">
                    <NuxtLink :href="`/${item.other_taxon}`">
                      {{ item.other_taxon__taxon }}
                    </NuxtLink>
                    <span v-if="idx !== opinions.length - 1">,</span>
                  </span>
                </span>
              </div>

              <div v-if="filteredCommonNames && filteredCommonNames.length > 0">
                <span v-for="item in filteredCommonNames">
                  {{ item.language }}:
                  <strong>{{ item.name }}</strong>
                  ;&ensp;
                </span>
              </div>
              <div
                v-if="
                  taxon.stratigraphy_base__stratigraphy ||
                  taxon.stratigraphy_top__stratigraphy
                "
              >
                {{ $t("header.f_stratigraphical_distribution") }}:

                <a
                  href="#"
                  v-if="taxon.stratigraphy_base_id"
                  @click="
                    openUrl({
                      parent_url: state.geocollectionUrl + '/stratigraphy',
                      object: taxon.stratigraphy_base_id.toString(),
                      width: 500,
                      height: 500,
                    })
                  "
                >
                  {{ taxon.stratigraphy_base__stratigraphy }}
                </a>
                <span
                  v-if="
                    taxon.stratigraphy_top__stratigraphy !==
                      taxon.stratigraphy_base__stratigraphy &&
                    taxon.stratigraphy_base__stratigraphy
                  "
                >
                  &rarr;
                </span>
                <a
                  href="#"
                  v-if="
                    taxon.stratigraphy_top_id &&
                    taxon.stratigraphy_base_id !== taxon.stratigraphy_top_id
                  "
                  @click="
                    openUrl({
                      parent_url: state.geocollectionUrl + '/stratigraphy',
                      object: taxon.stratigraphy_top_id.toString(),
                      width: 500,
                      height: 500,
                    })
                  "
                >
                  {{ taxon.stratigraphy_top__stratigraphy }}
                </a>
                <span v-if="taxon.stratigraphy_base__age_base">
                  ({{ $t("header.f_taxon_age_within") }}
                  {{ convertToTwoDecimal(taxon.stratigraphy_base__age_base) }}
                </span>
                <span v-if="taxon.stratigraphy_top__age_top">
                  &ndash;{{
                    convertToTwoDecimal(taxon.stratigraphy_top__age_top)
                  }}
                  {{ $t("header.f_taxon_age_within_unit") }})
                </span>
                <br />
              </div>
              <div
                v-if="taxon.rank__rank_en && taxon.rank__rank_en !== 'Species'"
              >
                <span v-if="store.mode === 'in_baltoscandia'">
                  {{ $t("header.f_baltic_species") }}
                </span>
                <span v-else-if="store.mode === 'in_estonia'">
                  {{ $t("header.f_estonian_species") }}
                </span>
                <span v-else>{{ $t("header.f_global_species") }}</span>
                <strong>
                  <a href="#species" v-if="state.numberOfSpecimen">
                    {{ state.numberOfSpecimen }}
                  </a>
                </strong>
              </div>
            </div>
          </div>
        </div>
        <lingallery
          style="width: 100%"
          v-if="images.length > 0"
          :height="200"
          :items="images"
        />
        <UCard v-if="taxonPage?.content">
          <template #header>
            {{ $t("header.f_taxon_intro") }}
          </template>
          <div
            id="content"
            class="text-justify"
            v-html="taxonPage.content"
          ></div>
          <template #footer>
            <span class="text-sm italic">
              {{ taxonPage.author_txt }} {{ taxonPage.date_txt }}
            </span>
          </template>
        </UCard>
        <UCard v-if="description.length > 0">
          <template #header>
            {{ $t("header.f_taxon_description_diagnosis") }}
          </template>
          <div v-for="item in description">
            <h3 class="mb-3" v-if="item.description">
              <a
                href="#"
                @click="
                  openUrl({
                    parent_url: 'http://geocollections.info/reference',
                    object: item.reference,
                    width: 500,
                    height: 500,
                  })
                "
              >
                <strong>{{ item.reference }}</strong>
              </a>
            </h3>
            <div v-html="item.description"></div>
          </div>
        </UCard>
        <UCard v-if="typeSpecimens.length > 0">
          <template #header>
            {{ $t("header.f_species_type_data") }}
          </template>
          <div
            :class="
              idx === typeSpecimens.length - 1 ? '' : 'border-bottom my-3'
            "
            v-for="(typeSpecimen, idx) in typeSpecimens"
          >
            <span
              v-if="
                typeSpecimen.type_type__value ||
                typeSpecimen.type_type__value_en
              "
            >
              <span>
                {{
                  $translate({
                    et: typeSpecimen.type_type__value,
                    en: typeSpecimen.type_type__value_en,
                  })
                }}
              </span>
              :
            </span>
            <span v-if="typeSpecimen.specimen === null">
              {{ typeSpecimen.repository }}
              {{ typeSpecimen.specimen_number }}
            </span>
            <span v-if="typeSpecimen.specimen">
              <a
                href="#"
                @click="
                  openUrl({
                    parent_url: 'http://geocollections.info/specimen',
                    object: typeSpecimen.specimen.toString(),
                    width: 500,
                    height: 500,
                  })
                "
              >
                {{ typeSpecimen.repository }}
                {{ typeSpecimen.specimen_number }}
              </a>
            </span>
            <span
              v-if="
                isAtLeastOneDefinedAndNotEmpty({
                  common: [
                    typeSpecimen.level,
                    typeSpecimen.attachment__filename,
                    typeSpecimen.remarks,
                  ],
                  et: [
                    typeSpecimen.stratigraphy__stratigraphy,
                    typeSpecimen.stratigraphy_free,
                    typeSpecimen.locality__locality,
                  ],
                  en: [
                    typeSpecimen.stratigraphy__stratigraphy_en,
                    typeSpecimen.stratigraphy_free_en,
                    typeSpecimen.locality__locality_en,
                  ],
                })
              "
            >
              ,
            </span>
            <a
              @click="
                openUrl({
                  parent_url: state.geocollectionUrl + '/locality',
                  object: typeSpecimen.locality.toString(),
                  width: 500,
                  height: 500,
                })
              "
              href="#"
              v-if="isDefinedAndNotNull(typeSpecimen.locality)"
            >
              {{
                $translate({
                  et: typeSpecimen.locality__locality,
                  en: typeSpecimen.locality__locality_en,
                })
              }}
            </a>
            ,
            <span
              v-if="
                isDifferentName({
                  et: [
                    typeSpecimen.locality__locality,
                    typeSpecimen.locality_free,
                  ],
                  en: [
                    typeSpecimen.locality__locality_en,
                    typeSpecimen.locality_free_en,
                  ],
                })
              "
            >
              (
              <span>
                {{
                  $translate({
                    et: typeSpecimen.locality_free,
                    en: typeSpecimen.locality_free_en,
                  })
                }}
              </span>
              )
            </span>
            <span v-if="isDefinedAndNotNull(typeSpecimen.level)">
              {{ typeSpecimen.level }},
            </span>
            <a
              @click="
                openUrl({
                  parent_url: state.geocollectionUrl + '/stratigraphy',
                  object: typeSpecimen.stratigraphy.toString(),
                  width: 500,
                  height: 500,
                })
              "
              href="#"
              v-if="isDefinedAndNotNull(typeSpecimen.stratigraphy)"
            >
              {{
                $translate({
                  et: typeSpecimen.stratigraphy__stratigraphy,
                  en: typeSpecimen.stratigraphy__stratigraphy_en,
                })
              }}
            </a>
            <span
              v-if="
                isDifferentName({
                  et: [
                    typeSpecimen.stratigraphy__stratigraphy,
                    typeSpecimen.stratigraphy_free,
                  ],
                  en: [
                    typeSpecimen.stratigraphy__stratigraphy_en,
                    typeSpecimen.stratigraphy_free_en,
                  ],
                })
              "
            >
              (
              <span>
                {{
                  $translate({
                    et: typeSpecimen.stratigraphy_free,
                    en: typeSpecimen.stratigraphy_free_en,
                  })
                }}
              </span>
              )
            </span>
            <span v-if="isDefinedAndNotNull(typeSpecimen.remarks)">
              {{ typeSpecimen.remarks }}
            </span>
            <span class="pl-3" v-if="typeSpecimen.attachment">
              <a
                @click="
                  openUrl({
                    parent_url: state.geocollectionUrl + '/file',
                    object: typeSpecimen.attachment.toString(),
                    width: 500,
                    height: 500,
                  })
                "
                href="#"
              >
                <img
                  class="img-thumbnail previewImage"
                  style="max-height: 80px"
                  :src="composeImgUrl(typeSpecimen.attachment__filename, false)"
                />
              </a>
            </span>
          </div>
        </UCard>
        <UCard v-if="synonyms.length > 0">
          <template #header>
            {{ $t("header.f_species_synonymy") }}
          </template>
          <div
            :class="idx === synonyms.length - 1 ? '' : 'border-bottom my-1'"
            v-for="(synonym, idx) in synonyms"
          >
            <span v-if="synonym.reference">
              <a
                href="#"
                @click="
                  openUrl({
                    parent_url: 'http://geocollections.info/reference',
                    object: synonym.reference.toString(),
                    width: 600,
                    height: 600,
                  })
                "
              >
                {{ synonym.year }}
              </a>
            </span>
            <span v-else="isDefinedAndNotNull(synonym.year)">
              {{ synonym.year }}
            </span>

            &nbsp;&nbsp;&nbsp;

            <em>{{ synonym.taxon_synonym }}</em>
            &mdash; {{ synonym.author }}
            <span v-if="isDefinedAndNotNull(synonym.pages)">
              , {{ $t("abbreviation.pp") }}. {{ synonym.pages }}
            </span>
            <span v-if="isDefinedAndNotNull(synonym.figures)">
              , {{ $t("abbreviation.fig") }}. {{ synonym.figures }}
            </span>
          </div>
        </UCard>
        <UCard v-if="references.length > 0">
          <template #header>
            {{ $t("header.f_taxon_references") }}
          </template>
          <Foldable :elLength="references.length">
            <div
              :class="idx === references.length - 1 ? '' : 'my-3'"
              v-for="(reference, idx) in references"
              style="padding-left: 3em; text-indent: -3em"
            >
              <a
                href="#"
                @click="
                  openUrl({
                    parent_url: 'http://geocollections.info/reference',
                    object: reference.id,
                    width: 500,
                    height: 500,
                  })
                "
              >
                {{ reference.author }}
                {{ reference.year }}.
              </a>
              <span>{{ reference.title }}.</span>

              <span v-if="reference.journal_name">
                <em>{{ reference.journal_name }}</em>
                {{ " " }}
                <strong>{{ reference.volume }}</strong>
                ,
                <span v-if="reference.number">{{ reference.number }},</span>
                <span v-if="isDefinedAndNotNull(reference.pages)">
                  {{ reference.pages }}.
                </span>
              </span>
              <span v-if="isDefinedAndNotNull(reference.book)">
                <em>{{ reference.book }}</em>
                , pp. {{ reference.pages }}.
              </span>

              <span v-if="reference.doi">
                <a
                  :href="'https://doi.org/' + reference.doi"
                  rel="noopener"
                  target="_blank"
                >
                  DOI:{{ reference.doi }}
                </a>
              </span>
            </div>
          </Foldable>
        </UCard>
        <UCard v-if="state.allSpecies && state.allSpecies.length > 0">
          <template #header>
            {{ $t("header.f_species_list") }}
          </template>
          <div>
            <div v-for="(item, idx) in state.allSpecies">
              {{ calculateSpeciesIdx(idx) }}.
              <a :href="'/' + item.id">
                <em>{{ item.taxon }}</em>
                {{ item.author_year }}
              </a>
              <template
                v-if="
                  item.stratigraphy_top__stratigraphy !==
                  item.stratigraphy_base__stratigraphy
                "
              >
                |
                <span>
                  {{
                    $translate({
                      et: item.stratigraphy_base__stratigraphy,
                      en: item.stratigraphy_base__stratigraphy_en,
                    })
                  }}
                </span>
                <span v-if="item.stratigraphy_top__stratigraphy">→</span>
                <span>
                  {{
                    $translate({
                      et: item.stratigraphy_top__stratigraphy,
                      en: item.stratigraphy_top__stratigraphy_en,
                    })
                  }}
                </span>
              </template>
              <template
                v-else-if="
                  item.stratigraphy_top__stratigraphy ===
                    item.stratigraphy_base__stratigraphy &&
                  item.stratigraphy_base__stratigraphy
                "
              >
                |
                <span>
                  {{
                    $translate({
                      et: item.stratigraphy_base__stratigraphy,
                      en: item.stratigraphy_base__stratigraphy_en,
                    })
                  }}
                </span>
              </template>
            </div>
          </div>
          <UPagination
            v-if="
              state.numberOfSpecimen > store.searchParameters.species.paginateBy
            "
            class="mt-2"
            v-model="store.searchParameters.species.page"
            :total="state.numberOfSpecimen"
            :page-count="store.searchParameters.species.paginateBy"
          />
        </UCard>

        <div class="row">
          <div v-if="distributionConop.length > 0">
            <h3>{{ $t("header.f_species_distribution_samples") }} (CONOP):</h3>
            <div
              :class="
                idx === distributionConop.length - 1 ? '' : 'border-bottom my-3'
              "
              v-for="(conop, idx) in distributionConop"
            >
              <a
                :href="
                  'http://geocollection.info/locality/' + conop.locality_id
                "
                target="_blank"
              >
                {{ conop.locality_et }}
              </a>
              : {{ conop.num }} {{ $t("f_species_link_samples") }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-full lg:col-span-1 space-y-2">
        <UCard
          v-if="map.length > 0"
          class="p-0"
          :ui="{ body: { padding: '' } }"
        >
          <ClientOnly>
            <MapComponent :map-data="map"></MapComponent>
            <template #fallback>
              <div
                style="
                  height: 300px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: #d4dadc;
                "
              >
                Loading...
              </div>
            </template>
          </ClientOnly>
        </UCard>
        <UAlert
          v-if="isNumberOfLocalitiesOnMapOver1000"
          variant="subtle"
          color="blue"
          title=""
        >
          <template #title>
            Map shows only the first
            <strong style="font-size: 0.9rem">1000</strong>
            localities
          </template>
        </UAlert>
        <TaxonomicalTree :id="taxon.id" />
        <SeeAlso
          v-if="
            taxon.taxon_id_tol ||
            taxon.taxon_id_eol ||
            taxon.taxon_id_nrm ||
            taxon.taxon_id_plutof ||
            taxon.taxon_id_pbdb ||
            taxonPage?.link_wikipedia
          "
          :taxon="taxon"
          :taxon-page="taxonPage"
        />

        <UCard
          v-if="
            !isHigherTaxon(taxon.rank__rank_en) && taxonOccurrence.length > 0
          "
        >
          <template #header>
            {{ $t("header.f_species_distribution_references") }}
          </template>
          <ul>
            <li v-for="reference in taxonOccurrence">
              <em>
                <a
                  href="#"
                  @click="
                    openUrl({
                      parent_url: 'http://geocollections.info/reference',
                      object: reference.reference,
                      width: 500,
                      height: 500,
                    })
                  "
                >
                  <strong>{{ reference.reference }}</strong>
                </a>
                <span>
                  {{
                    $translate({
                      et: reference.locality__locality,
                      en: reference.locality__locality_en,
                    })
                  }}
                </span>
                <span v-if="reference.depth || reference.depth_interval">
                  {{ reference.depth }} -
                  {{ reference.depth_interval }}
                </span>
                <span>
                  {{
                    $translate({
                      et: reference.stratigraphy_base__stratigraphy,
                      en: reference.stratigraphy_base__stratigraphy_en,
                    })
                  }}
                </span>
              </em>
            </li>
          </ul>
        </UCard>
        <UCard v-if="distributionSamples.length > 0">
          <template #header>
            {{ $t("header.f_species_distribution_samples") }}
          </template>
          <div class="my-2" v-for="sample in distributionSamples">
            <a
              :href="
                'http://geocollections.info/locality/' + sample.locality_id
              "
              target="_blank"
            >
              <i>
                {{
                  $translate({
                    et: sample.locality_et,
                    en: sample.locality_en,
                  })
                }}
              </i>
            </a>
            <span>({{ sample.depth_min }} ... {{ sample.depth_max }}):</span>
            <a
              target="_blank"
              :href="
                state.geocollectionUrl +
                '/specimen?taxon_1=1&taxon=' +
                taxon.taxon +
                '&taxon_2=1&locality_1=1&locality=' +
                sample.locality_en +
                '&locality_2=1&currentTable=sample&paginateBy=25&sort=id&sortdir=DESC'
              "
            >
              {{ sample.num }}
              {{ $t("header.f_species_link_samples") }}
            </a>
          </div>
        </UCard>
      </div>
    </div>
    <TabGallery v-if="state.activeSection === 'images'" :taxon="taxon" />
    <TabSpecimens v-if="state.activeSection === 'specimens'" :taxon="taxon" />
  </section>
</template>

<script setup lang="ts">
import filter from "lodash/filter";
import { useRootStore } from "../stores/root";
import dayjs from "dayjs";
import { useNewApiFetch } from "~/composables/useApiFetch";

const state = reactive({
  geocollectionUrl: "http://geocollections.info",
  fossilsUrl: "https://fossiilid.info",
  kividUrl: "http://www.kivid.info",
  fileUrl: "https://files.geocollections.info",
  isReferencesCollapsed: true,
  scroll: false,
  activeSection: "info",
  specimenCollectionCnt: 0,
  loaders: {
    isSpecimenCollectionLoaded: false,
  },
  accordion: {
    showAccordionReferences: false,
  },
  toggle: "",
  mapDataLoaded: false,
  sister_taxa: {},
  hierarchy: [] as any[],
  numberOfSpecimen: 0,
  requestingData: false,
  isSisterTaxaLoaded: false,
  isHierarchyLoaded: false,
  allSpecies: [] as Species[],
  response: {
    count: 0,
    results: [],
  },
});
const route = useRoute();
const store = useRootStore();
const { t, locale } = useI18n();

type Taxon = {
  id: number;
  taxon: string;
  parent?: string;
  parent__taxon?: string;
  rank__rank?: string;
  rank__rank_en?: string;
  fossil_group__id?: number;
  is_fossil_group?: boolean;
  fossil_group__taxon?: string;
  hierarchy_string?: string;
  author_year?: string;
  date_added?: string;
  date_changed?: string;
  stratigraphy_base__stratigraphy?: string;
  stratigraphy_base_id?: number;
  stratigraphy_top_id?: number;
  stratigraphy_base__age_base?: number;
  stratigraphy_top__age_top?: number;
  stratigraphy_top__stratigraphy?: string;
  taxon_id_tol?: number;
  taxon_id_eol?: number;
  taxon_id_nrm?: string;
  taxon_id_plutof?: number;
  taxon_id_pbdb?: number;
};

const taxonSearchParams = computed(() => {
  const parsedId = parseInt(route.params.id as string);
  if (Number.isNaN(parsedId)) {
    return {
      taxon__iexact: route.params.id,
    };
  }
  return { id: route.params.id };
});
const { data: taxonRes } = await useApiFetch<{ results?: Taxon[] }>("/taxon/", {
  query: {
    ...taxonSearchParams.value,
    fields: `id,taxon,parent,parent__taxon,rank__rank,rank__rank_en,fossil_group__id,is_fossil_group,fossil_group__taxon,hierarchy_string,author_year,date_added,date_changed,stratigraphy_base__stratigraphy,stratigraphy_base_id,stratigraphy_top_id,stratigraphy_base__age_base,stratigraphy_top__age_top,stratigraphy_top__stratigraphy,taxon_id_tol,taxon_id_eol,taxon_id_nrm,taxon_id_plutof,taxon_id_pbdb`,
    format: "json",
  },
});

const taxon = ref(taxonRes.value?.results?.[0]);
if (!taxon.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const [
  { data: commonNamesRes },
  { data: pageRes },
  { data: occurenceRes },
  { data: descriptionRes },
  { data: speciesMapRes },
  { data: opinionRes },
  { data: cntSpecimenCollectionRes },
  { data: referenceRes },
  { data: imagesRes },
] = await Promise.all([
  useApiFetch<{ results?: any[] }>("/taxon_common_name/", {
    query: {
      taxon: taxon.value.id,
      is_preferred: 1,
      fields: "language,name,is_preferred",
      format: "json",
    },
  }),
  useApiFetch<{ results?: any[] }>("/taxon_page/", {
    query: computed(() => ({
      taxon: taxon.value?.id,
      language: locale.value,
      fields: "content,author_txt,date_txt,link_wikipedia,title",
      format: "json",
    })),
  }),
  useApiFetch<{ results?: any[] }>("/taxon_occurrence/", {
    query: {
      taxon__taxon__icontains: taxon.value.taxon,
      fields:
        "reference,reference,locality__locality,locality__locality_en,depth_interval,depth,stratigraphy_base__stratigraphy,stratigraphy_base__stratigraphy_en",
      format: "json",
    },
  }),
  useApiFetch<{ results?: any[] }>("/taxon_description/", {
    query: {
      taxon: taxon.value.id,
      fields: "reference,reference,description",
      format: "json",
    },
  }),
  useApiFetch<{
    results: any[];
    count: number;
  }>("/solr/taxon_search/", {
    query: computed(() => ({
      q: `taxon_hierarchy:${taxon.value?.hierarchy_string}*${
        store.mode === "in_global" ? `` : ` AND ${store.mode}:1`
      }`,
      fq: ["{!collapse field--locality}", "rank:[14 TO 17]"],
      sort: "fossil_group asc,taxon asc",
      rows: 1000,
      start: 0,
      fl: "src,locality,locality_en,locality_id,latlong",
      format: "json",
    })),
  }),
  useApiFetch<{ results?: any[] }>("/taxon_opinion/", {
    query: {
      taxon: taxon.value.id,
      other_taxon__isnull: false,
      is_preferred: true,
      opinion_type__invalid: true,
      order_by: "-year",
      format: "json",
    },
  }),
  useApiFetch<{ count: number }>("/solr/specimen/", {
    query: {
      q: `hierarchy_string:(${taxon.value.hierarchy_string}*)`,
      rows: 1,
      format: "json",
    },
  }),
  useNewApiFetch<{ results: any[]; count: number }>(
    `/taxa/${taxon.value.id}/references/`,
    { query: { limit: 100 } },
  ),
  useNewApiFetch<{ results: any[]; count: number }>(
    `/taxa/${taxon.value.id}/images/`,
  ),
]);

const commonNames = ref(commonNamesRes.value?.results?.[0]);
const taxonPage = computed(() => pageRes.value?.results?.[0]);
const taxonOccurrence = ref(occurenceRes.value?.results ?? []);
const references = ref(referenceRes.value?.results ?? []);
const description = ref(descriptionRes.value?.results ?? []);
const map = computed(() => speciesMapRes.value?.results ?? []);
const cntLocalities = ref(speciesMapRes.value?.count);
const opinions = ref(opinionRes.value?.results ?? []);
const images = ref(buildGalleryImages(imagesRes.value?.results ?? []));
state.specimenCollectionCnt = cntSpecimenCollectionRes.value?.count ?? 0;

const tabs = computed(() => [
  { slot: "info", label: t("tabs.overview") },
  {
    slot: "images",
    label: t("tabs.gallery"),
    count: imagesRes.value?.count ?? 0,
    disabled: (imagesRes.value?.count ?? 0) < 1,
  },
  {
    slot: "specimens",
    label: t("tabs.specimens"),
    count: state.specimenCollectionCnt,
    disabled: state.specimenCollectionCnt < 1,
  },
]);
function getModeQueryParam(mode: string) {
  if (mode === "in_baltoscandia") {
    return { in_baltoscandia: 1 };
  } else if (mode === "in_estonia") {
    return { in_estonia: 1 };
  }
  return {};
}

type TaxonTypeSpecimen = {
  id: number;
  type_type__value: string;
  type_type__value_en: string;
  specimen?: number;
  specimen_number?: number;
  repository?: string;
  level?: string;
  attachment?: number;
  attachment__filename?: string;
  remarks?: string;
  stratigraphy: number;
  stratigraphy__stratigraphy: string;
  stratigraphy__stratigraphy_en: string;
  stratigraphy_free?: string;
  stratigraphy_free_en?: string;
  locality__locality: string;
  locality: number;
  locality_free: string;
  locality_free_en: string;
  locality__locality_en: string;
};

type TaxonSynonym = {
  id: number;
  reference?: number;
  year: string;
  taxon_synonym: string;
  pages?: string;
  figures?: string;
  author: string;
};

type TaxonConop = {
  locality_id: number;
  locality_et: string;
  num: number;
};
type TaxonDistributionSample = {
  locality_id: number;
  locality_et: string;
  locality_en: string;
  depth_min: number;
  depth_max: number;
  num: number;
};
const typeSpecimens = ref<TaxonTypeSpecimen[]>([]);
const synonyms = ref<TaxonSynonym[]>([]);
const distributionSamples = ref<TaxonDistributionSample[]>([]);
const distributionConop = ref<TaxonConop[]>([]);

if (taxon.value.rank__rank_en !== "Species") {
  const { data: speciesRes } = await useApiFetch<{
    count: number;
    results?: Species[];
  }>("/taxon/", {
    query: computed(() => ({
      hierarchy_string__istartswith: taxon.value?.hierarchy_string,
      rank__rank_en: "species",
      ...getModeQueryParam(store.mode),
      order_by: "taxon",
      fields:
        "taxon,author_year,id,stratigraphy_base__stratigraphy_en,stratigraphy_base__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_top__stratigraphy",
      page: store.searchParameters.species.page,
      paginate_by: store.searchParameters.species.paginateBy,
      format: "json",
    })),
  });
  state.allSpecies = speciesRes.value?.results ?? [];
  state.numberOfSpecimen = speciesRes.value?.count ?? 0;
  watch(
    () => speciesRes.value,
    (res) => {
      state.allSpecies = res?.results ?? [];
      state.numberOfSpecimen = res?.count ?? 0;
    },
  );
} else if (["Species", "Subspecies"].includes(taxon.value.rank__rank_en)) {
  const [
    { data: synonymRes },
    { data: typeSpecimenRes },
    { data: distributionSamplesRes },
    { data: distributionConopRes },
  ] = await Promise.all([
    useApiFetch<{ results?: TaxonSynonym[] }>("/taxon_synonym/", {
      query: {
        taxon: taxon.value.id,
        order_by: "year",
        format: "json",
      },
    }),
    useApiFetch<{ results?: TaxonTypeSpecimen[] }>("/taxon_type_specimen/", {
      query: {
        taxon: taxon.value.id,
        format: "json",
      },
    }),
    useApiFetch<{
      results?: TaxonDistributionSample[];
    }>("/taxon/", {
      query: {
        sql: "get_species_distribution_sample",
        keyword: taxon.value.taxon,
        format: "json",
      },
    }),
    useApiFetch<{
      results?: TaxonConop[];
    }>("/taxon/", {
      query: {
        sql: "get_species_distribution_conop",
        keyword: taxon.value.taxon,
        format: "json",
      },
    }),
  ]);
  synonyms.value = synonymRes.value?.results ?? [];
  typeSpecimens.value = typeSpecimenRes.value?.results ?? [];
  distributionSamples.value = distributionSamplesRes.value?.results ?? [];
  distributionConop.value = distributionConopRes.value?.results ?? [];
}

const dateAdded = computed(() => {
  return dayjs(taxon.value?.date_added).format("YYYY-MM-DD");
});
const dateChanged = computed(() => {
  return dayjs(taxon.value?.date_changed).format("YYYY-MM-DD");
});
const taxonTitle = computed(() => {
  let lang = locale.value;
  if (taxonPage.value && taxonPage.value.title) return taxonPage.value.title;
  let activeCommonName = filter(commonNames.value, function (o) {
    return o.language === lang && o.is_preferred === 1;
  });

  if (activeCommonName.length > 0) return activeCommonName[0].name;
});

const filteredCommonNames = computed(function () {
  let lang = locale.value;
  return filter(commonNames.value, function (o) {
    return o.language !== lang;
  });
});

const isNumberOfLocalitiesOnMapOver1000 = computed(() => {
  return cntLocalities.value !== undefined && cntLocalities.value > 1000;
});
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

function isDifferentName(obj: any) {
  let localizedName = locale.value === "et" ? obj["et"] : obj["en"];
  return localizedName[0] !== localizedName[1] && localizedName[1] !== "";
}

function composeImgUrl(uuid_filename: string | undefined, isFull: boolean) {
  if (uuid_filename) {
    return isFull
      ? state.fileUrl +
          "/large/" +
          uuid_filename.substring(0, 2) +
          "/" +
          uuid_filename.substring(2, 4) +
          "/" +
          uuid_filename
      : state.fileUrl +
          "/small/" +
          uuid_filename.substring(0, 2) +
          "/" +
          uuid_filename.substring(2, 4) +
          "/" +
          uuid_filename;
  }
}

function isDefinedAndNotNull(value: any) {
  return !!value && value !== null;
}
function arrayHasNonNullElement(arr: any[]) {
  let found = false;
  arr.forEach(function (el) {
    found = isDefinedAndNotNull(el);
  });
  return found;
}
function isAtLeastOneDefinedAndNotEmpty(arr: any) {
  let found = arrayHasNonNullElement(arr["common"]);
  if (found) return found;

  let localizedArr = locale.value === "et" ? arr["et"] : arr["en"];
  found = arrayHasNonNullElement(localizedArr);
  return found;
}
function isHigherTaxon(rank: string | undefined | null) {
  if (!rank) return false;
  // return !['Species','Subspecies','Genus','Supergenus','Subgenus'].includes(rank)
  return !(
    ["Species", "Subspecies", "Genus", "Supergenus", "Subgenus"].indexOf(
      rank,
    ) >= 0
  );
}
function calculateSpeciesIdx(idx: number) {
  return (
    idx +
    1 +
    store.searchParameters.species.paginateBy *
      store.searchParameters.species.page -
    store.searchParameters.species.paginateBy
  );
}
function convertToTwoDecimal(value: number) {
  return value.toFixed(1);
}

function setFancyBoxCaption(el: any, type: string) {
  let text = "",
    infoBtn = "",
    imgBtn = "",
    additionalInfo: any = {};
  switch (type) {
    case "selected_image":
      additionalInfo = {
        imageName: el.taxon_name,
        infoId: el.specimen,
        imageId: el.id,
        navigateId: el.taxon,
      };
      break;
    case "non_higher_taxon":
      additionalInfo = {
        imageName: el.specimen
          ? el.database__acronym + " " + el.specimen
          : el.database__acronym + " " + el.id,
        infoId: el.specimen,
        imageId: el.id ? el.id : el.specimen_image_id,
        navigateId: el.link ? el.link : el.taxon,
      };
      break;
    case "higher_taxon":
      additionalInfo = {
        imageName: el.taxon_name,
        infoId: el.specimen,
        imageId: el.id,
        navigateId: el.taxon,
      };
    default:
      break;
  }

  // if(this.isHigherTaxon(this.taxon.rank__rank_en)) {}
  text +=
    '<div><button type="button" class="bg-tomato-500 px-4 py-2 rounded-md text-lg font-bold" onclick="window.open(\'' +
    state.fossilsUrl +
    "/" +
    additionalInfo.navigateId +
    "?mode=in_baltoscandia&lang=en')\">Read more</button></div>";

  if (additionalInfo.infoId)
    infoBtn =
      '<button type="button" class="bg-blue-500 rounded-md px-4 py-2 font-bold" onclick="window.open(\'' +
      state.geocollectionUrl +
      "/specimen/" +
      additionalInfo.infoId +
      "')\">INFO</button>";
  if (additionalInfo.imageId)
    imgBtn =
      ' <button type="button" class="bg-gray-200 rounded-md px-4 py-2 text-black font-bold" onclick="window.open(\'' +
      state.geocollectionUrl +
      "/file/" +
      additionalInfo.imageId +
      "')\">IMAGE</button>";
  text +=
    "<div class='mt-3'><span>" +
    additionalInfo.imageName +
    "</span>&ensp;&ensp;" +
    infoBtn +
    imgBtn +
    "</div>";
  return text;
}

function setImageType(el: any) {
  if (el.specimen_image_id || el.specimen_image_id === null) {
    return "non_higher_taxon";
  } else if (el.link_id || el.link_id === null) {
    return "selected_image";
  }
  return "higher_taxon";
}

function setImageSrc(el: any, type: string) {
  const res = { thumbnail: null as string | null, src: null as string | null };
  if (type === "higher_taxon") {
    res.thumbnail =
      state.fileUrl +
      "/small/" +
      el.filename.substring(0, 2) +
      "/" +
      el.filename.substring(2, 4) +
      "/" +
      el.filename;
    res.src =
      state.fileUrl +
      "/large/" +
      el.filename.substring(0, 2) +
      "/" +
      el.filename.substring(2, 4) +
      "/" +
      el.filename;
  } else if (type === "non_higher_taxon") {
    res.thumbnail =
      state.fileUrl +
      "/small/" +
      el.uuid_filename.substring(0, 2) +
      "/" +
      el.uuid_filename.substring(2, 4) +
      "/" +
      el.uuid_filename;
    res.src =
      state.fileUrl +
      "/large/" +
      el.uuid_filename.substring(0, 2) +
      "/" +
      el.uuid_filename.substring(2, 4) +
      "/" +
      el.uuid_filename;
  } else if (type === "selected_image") {
    res.thumbnail =
      state.fileUrl +
      "/small/" +
      el.filename.substring(0, 2) +
      "/" +
      el.filename.substring(2, 4) +
      "/" +
      el.filename;
    res.src =
      state.fileUrl +
      "/large/" +
      el.filename.substring(0, 2) +
      "/" +
      el.filename.substring(2, 4) +
      "/" +
      el.filename;
  }
  return res;
}
function buildGalleryImages(taxonImages: any[]) {
  if (taxonImages.length === 0) return [];
  return taxonImages.map((el) => {
    const type = setImageType(el);
    return {
      ...el,
      type,
      caption: setFancyBoxCaption(el, type),
      ...setImageSrc(el, type),
    };
  });
}

type Species = {
  taxon: string;
  author_year?: string;
  id: string;
  stratigraphy_base__stratigraphy_en?: string;
  stratigraphy_base__stratigraphy?: string;
  stratigraphy_top__stratigraphy_en?: string;
  stratigraphy_top__stratigraphy?: string;
};

function handleScroll() {
  state.scroll = window.scrollY > 150;
}
</script>

<style scoped>
.col-lg-8 {
  padding-right: 0.1rem !important;
}

.col-lg-4 {
  padding-left: 0.1rem !important;
}

.css-loader {
  border: 12px solid #f3f3f3;
  border-top: 12px solid rgb(255, 164, 78);
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
