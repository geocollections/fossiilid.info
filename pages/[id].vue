<template>
  <Head>
    <Title>{{ taxon?.taxon }}</Title>
    <Meta vmid="keywords" name="keywords" :content="meta" />
    <!-- <Meta vmid="description" name="description" :content="description ?? []" /> -->
  </Head>
  <section class="container-fluid">
    <div class="m-md-3 text-center" v-if="!taxon">
      <div class="css-loader" style="margin: auto"></div>
      <h5 class="mt-3">{{ $t("messages.pageLoading") }}</h5>
    </div>
    <div class="page-container" v-if="taxon">
      <div class="row mt-3" v-show="state.scroll">
        <span class="ml-auto">
          <button
            @click="topNavigation()"
            type="button"
            style="height: 3.5rem; width: 3.5rem"
            class="rounded-circle btn btn-primary fixed-bottom p-0 m-md-2"
            variant="primary"
          >
            <i
              style="
                color: white !important;
                font-weight: bolder !important;
                font-size: 1.5em !important;
              "
              class="fas fa-arrow-up"
            ></i>
          </button>
        </span>
      </div>
      <div class="ms-0">
        <table>
          <tbody>
            <tr>
              <td style="vertical-align: top; cal-align: top">
                <NuxtLink
                  :href="'/' + taxon.fossil_group__id"
                  v-if="taxon.fossil_group__id != null"
                >
                  <img
                    class="taxon-img"
                    style="max-width: 120px"
                    border="0"
                    :src="`/fossilgroups/${taxon.fossil_group__id}.png`"
                    :alt="taxon.fossil_group__taxon"
                    :title="taxon.fossil_group__taxon"
                  />
                </NuxtLink>
              </td>
              <td style="padding-left: 10px">
                <div
                  style="font-size: 0.9em"
                  v-translate="{
                    et: taxon.rank__rank,
                    en: taxon.rank__rank_en,
                  }"
                ></div>
                <h1
                  style="display: inline; font-weight: bold"
                  :class="
                    isHigherTaxon(taxon.rank__rank_en) ? '' : 'fst-italic'
                  "
                >
                  {{ taxon.taxon }}
                  <span style="font-size: 0.5em">{{ taxon.author_year }}</span>
                </h1>
                <h3
                  v-if="
                    taxon.fossil_group__id && isHigherTaxon(taxon.rank__rank_en)
                  "
                  style="padding-top: 8px"
                >
                  {{ taxonTitle }}
                </h3>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <TaxonTabs
        :specimenCount="state.specimenCollectionCnt"
        :imageCount="state.images.length"
      />
      <TabGallery v-if="store.activeTab === 'gallery'" :taxon="taxon" />
      <TabSpecimens v-if="store.activeTab === 'specimens'" :taxon="taxon" />
      <div class="row" v-if="store.activeTab === 'overview'">
        <div class="col-lg-8">
          <div
            class="row m-1"
            v-if="opinions.length > 0 && invalidTaxonName.length > 0"
          >
            <div
              class="alert alert-danger"
              style="width: 100%"
              v-if="computedOpinions.length > 0"
            >
              <div v-for="(item, index) in computedOpinions" :key="index">
                {{ $t("header.f_name_is_invalid") }}
                <NuxtLink :href="`/${item.other_taxon}`">
                  {{ item.other_taxon__taxon }}
                </NuxtLink>
              </div>
            </div>
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-body">
                <div style="font-size: small; color: #666; padding: 0 0 6px 0">
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
                    taxon.fossil_group__id &&
                    taxon.fossil_group__id !== taxon.id
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
                    :class="
                      isHigherTaxon(taxon.rank__rank_en) ? '' : 'fst-italic'
                    "
                    :href="`/${parent.id}`"
                  >
                    {{ parent.taxon }}
                  </NuxtLink>
                </div>
                <div
                  v-if="opinions.length > 0"
                  style="font-size: 0.9rem !important"
                >
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

                <div
                  v-if="filteredCommonNames && filteredCommonNames.length > 0"
                >
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
                  v-if="
                    taxon.rank__rank_en && taxon.rank__rank_en !== 'Species'
                  "
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
          <div class="m-1">
            <lingallery
              style="width: 100%"
              v-if="state.images && state.images.length > 0"
              ref="lingallery"
              :height="200"
              :items="state.images.slice(0, 10)"
            />
          </div>
          <div class="m-1">
            <SeeAlso
              v-if="
                (taxonPage && taxonPage.link_wikipedia !== null) ||
                taxon.taxon_id_tol !== null ||
                taxon.taxon_id_eol !== null ||
                taxon.taxon_id_nrm !== null ||
                taxon.taxon_id_plutof !== null ||
                taxon.taxon_id_pbdb !== null
              "
              :taxon="taxon"
              :taxon-page="taxonPage"
            />
          </div>
          <div class="row m-1" v-if="taxonPage && taxonPage.content">
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">{{ $t("header.f_taxon_intro") }}</div>
              <div class="card-body">
                <foldable>
                  <div id="taxon-details" v-html="taxonPage.content"></div>
                </foldable>
              </div>
              <div class="card-footer">
                <i style="font-size: 0.8em">
                  {{ taxonPage.author_txt }} {{ taxonPage.date_txt }}
                </i>
              </div>
            </div>
          </div>
          <div class="row m-1" v-if="description.length > 0">
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">
                {{ $t("header.f_taxon_description_diagnosis") }}
              </div>
              <div class="card-body">
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
                      <strong>{{ item.reference__reference }}</strong>
                    </a>
                  </h3>
                  <div v-html="item.description"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="row m-1" v-if="typeSpecimens.length > 0">
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">
                {{ $t("header.f_species_type_data") }}
              </div>
              <div class="card-body">
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
                    <span
                      v-translate="{
                        et: typeSpecimen.type_type__value,
                        en: typeSpecimen.type_type__value_en,
                      }"
                    ></span>
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
                    v-translate="{
                      et: typeSpecimen.locality__locality,
                      en: typeSpecimen.locality__locality_en,
                    }"
                  ></a>
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
                    <span
                      v-translate="{
                        et: typeSpecimen.locality_free,
                        en: typeSpecimen.locality_free_en,
                      }"
                    ></span>
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
                    v-translate="{
                      et: typeSpecimen.stratigraphy__stratigraphy,
                      en: typeSpecimen.stratigraphy__stratigraphy_en,
                    }"
                  ></a>
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
                    <span
                      v-translate="{
                        et: typeSpecimen.stratigraphy_free,
                        en: typeSpecimen.stratigraphy_free_en,
                      }"
                    ></span>
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
                        :src="
                          composeImgUrl(
                            typeSpecimen.attachment__filename,
                            false
                          )
                        "
                      />
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="row m-1" v-if="synonyms && synonyms.length > 0">
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">
                {{ $t("header.f_species_synonymy") }}
              </div>
              <div class="card-body">
                <div
                  :class="
                    idx === synonyms.length - 1 ? '' : 'border-bottom my-1'
                  "
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
              </div>
            </div>
          </div>
          <div
            class="row m-1"
            v-if="referencesCombined && referencesCombined.length > 0"
          >
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">
                {{ $t("header.f_taxon_references") }}
              </div>
              <div class="card-body">
                <foldable :elLength="referencesCombined.length">
                  <div
                    :class="idx === referencesCombined.length - 1 ? '' : 'my-3'"
                    v-for="(reference, idx) in referencesCombined"
                    style="padding-left: 3em; text-indent: -3em"
                  >
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
                      {{ reference.reference__author }}
                      {{ reference.reference__year }}.
                    </a>
                    <span>{{ reference.reference__title }}.</span>

                    <span v-if="reference.reference__journal__journal_name">
                      <em>{{ reference.reference__journal__journal_name }}</em>
                      <strong>{{ reference.reference__volume }}</strong>
                      ,
                      <span v-if="reference.reference__number">
                        {{ reference.reference__number }},
                      </span>
                      <span
                        v-if="isDefinedAndNotNull(reference.reference__pages)"
                      >
                        {{ reference.reference__pages }}.
                      </span>
                    </span>
                    <span v-if="isDefinedAndNotNull(reference.reference__book)">
                      <em>{{ reference.reference__book }}</em>
                      , pp. {{ reference.reference__pages }}.
                    </span>

                    <span v-if="reference.reference__doi">
                      <a
                        :href="'https://doi.org/' + reference.reference__doi"
                        rel="noopener"
                        target="_blank"
                      >
                        DOI:{{ reference.reference__doi }}
                      </a>
                    </span>
                  </div>
                </foldable>
              </div>
            </div>
          </div>
          <div
            class="row m-1"
            v-if="state.allSpecies && state.allSpecies.length > 0"
            id="species"
          >
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">{{ $t("header.f_species_list") }}</div>
              <div class="card-body">
                <div>
                  <div
                    style="font-size: 0.8em"
                    v-for="(item, idx) in state.allSpecies"
                  >
                    &ensp;&ensp;&ensp;{{ calculateSpeciesIdx(idx) }}.
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
                      <span
                        v-translate="{
                          et: item.stratigraphy_base__stratigraphy,
                          en: item.stratigraphy_base__stratigraphy_en,
                        }"
                      ></span>
                      <span v-if="item.stratigraphy_top__stratigraphy">→</span>
                      <span
                        v-translate="{
                          et: item.stratigraphy_top__stratigraphy,
                          en: item.stratigraphy_top__stratigraphy_en,
                        }"
                      ></span>
                    </template>
                    <template
                      v-else-if="
                        item.stratigraphy_top__stratigraphy ===
                          item.stratigraphy_base__stratigraphy &&
                        item.stratigraphy_base__stratigraphy
                      "
                    >
                      |
                      <span
                        v-translate="{
                          et: item.stratigraphy_base__stratigraphy,
                          en: item.stratigraphy_base__stratigraphy_en,
                        }"
                      ></span>
                    </template>
                  </div>
                  <div
                    class="col-xs-12 col-xs-6 pagination-center"
                    v-if="
                      state.numberOfSpecimen >
                      store.searchParameters.species.paginateBy
                    "
                  >
                    <BPagination
                      size="sm"
                      align="end"
                      :limit="5"
                      :hide-ellipsis="true"
                      :total-rows="state.numberOfSpecimen"
                      v-model="store.searchParameters.species.page"
                      :per-page="store.searchParameters.species.paginateBy"
                    ></BPagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div v-if="distributionConop.length > 0">
              <h3>
                {{ $t("header.f_species_distribution_samples") }} (CONOP):
              </h3>
              <div
                :class="
                  idx === distributionConop.length - 1
                    ? ''
                    : 'border-bottom my-3'
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
        <div class="col-lg-4">
          <b-row class="m-1" v-if="map !== undefined && map.length > 0">
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">
                {{ $t("header.f_distribution_map") }}
              </div>
              <div class="card-body no-padding">
                <ClientOnly>
                  <map-component :map-data="map"></map-component>
                </ClientOnly>
              </div>
            </div>
            <b-alert
              style="width: 100%; font-size: 0.8rem"
              class="mb-0"
              :model-value="true"
              variant="info"
              v-if="isNumberOfLocalitiesOnMapOver1000"
            >
              Map shows only the first
              <strong style="font-size: 0.9rem">1000</strong>
              localities
            </b-alert>
          </b-row>
          <div class="row m-1" v-if="isTaxonomicTreeIsLoaded">
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">
                {{ $t("header.fossils_classification") }}
              </div>
              <div class="card-body" style="font-size: 0.8em">
                <TaxonomicalTree
                  :lists="{ ranks: ranks }"
                  :hierarchy-data="hierarchyData"
                ></TaxonomicalTree>
              </div>
            </div>
          </div>

          <div
            class="row m-1"
            v-if="
              !isHigherTaxon(taxon.rank__rank_en) && taxonOccurrence.length > 0
            "
          >
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">
                {{ $t("header.f_species_distribution_references") }}
              </div>
              <div class="card-body" style="font-size: 0.8em">
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
                        <strong>{{ reference.reference__reference }}</strong>
                      </a>
                      <span
                        v-translate="{
                          et: reference.locality__locality,
                          en: reference.locality__locality_en,
                        }"
                      ></span>
                      <span v-if="reference.depth || reference.depth_interval">
                        {{ reference.depth }} - {{ reference.depth_interval }}
                      </span>
                      <span
                        v-translate="{
                          et: reference.stratigraphy_base__stratigraphy,
                          en: reference.stratigraphy_base__stratigraphy_en,
                        }"
                      ></span>
                    </em>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row m-1" v-if="distributionSamples.length > 0">
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">
                {{ $t("header.f_species_distribution_samples") }}
              </div>
              <div class="card-body" style="font-size: 0.8em">
                <div class="my-2" v-for="sample in distributionSamples">
                  <a
                    :href="
                      'http://geocollections.info/locality/' +
                      sample.locality_id
                    "
                    target="_blank"
                  >
                    <i
                      v-translate="{
                        et: sample.locality_et,
                        en: sample.locality_en,
                      }"
                    ></i>
                  </a>
                  <span>
                    ({{ sample.depth_min }} ... {{ sample.depth_max }}):
                  </span>
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
                    {{ sample.num }} {{ $t("header.f_species_link_samples") }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import uniqBy from "lodash/uniqBy";
import _map from "lodash/map";
import { useRootStore } from "../stores/root";
import dayjs from "dayjs";

const state = reactive({
  geocollectionUrl: "http://geocollections.info",
  fossilsUrl: "https://fossiilid.info",
  kividUrl: "http://www.kivid.info",
  fileUrl: "https://files.geocollections.info",
  isReferencesCollapsed: true,
  scroll: false,
  parent: {},
  images: [] as any[],
  activeSection: "overview",
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
  imagesLoading: true,
  allSpecies: [] as Species[],
  response: {
    count: 0,
    results: [],
  },
});
const route = useRoute();
const store = useRootStore();
const { locale } = useI18n();
const { $apiFetch } = useNuxtApp();

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
  { data: ranksRes },
  { data: commonNamesRes },
  { data: pageRes },
  { data: occurenceRes },
  { data: referenceRes },
  { data: reference2Res },
  { data: childrenRes },
  { data: descriptionRes },
  { data: speciesMapRes },
  { data: opinionRes },
  { data: hierarchyRes },
  { data: cntSpecimenCollectionRes },
  _imageRes,
] = await Promise.all([
  useApiFetch<{ results?: any[] }>("/taxon_rank/", {
    query: {
      order_by: "sort",
      format: "json",
    },
  }),
  useApiFetch<{ results?: any[] }>("/taxon_common_name/", {
    query: {
      taxon: taxon.value.id,
      is_preferred: 1,
      fields: "language,name,is_preferred",
      format: "json",
    },
  }),
  useApiFetch<{ results?: any[] }>("/taxon_page/", {
    query: {
      taxon: taxon.value.id,
      language: locale.value,
      fields: "content,author_txt,date_txt,link_wikipedia,title",
      format: "json",
    },
  }),
  useApiFetch<{ results?: any[] }>("/taxon_occurrence/", {
    query: {
      taxon__taxon__icontains: taxon.value.taxon,
      fields:
        "reference,reference__reference,locality__locality,locality__locality_en,depth_interval,depth,stratigraphy_base__stratigraphy,stratigraphy_base__stratigraphy_en",
      format: "json",
    },
  }),
  useApiFetch<{ results?: any[] }>("/taxon_occurrence/", {
    query: {
      taxon__hierarchy_string__istartswith: taxon.value.hierarchy_string,
      reference__isnull: false,
      order_by: "-reference__year",
      fields:
        "reference,reference__reference,reference__author,reference__year,reference__title,reference__journal__journal_name,reference__book,reference__volume,reference__number,reference__pages,reference__doi",
      distinct: true,
      format: "json",
    },
  }),
  useApiFetch<{ results?: any[] }>("/specimen_identification/", {
    query: {
      taxon__hierarchy_string__istartswith: taxon.value.hierarchy_string,
      reference__isnull: false,
      order_by: "-reference__year",
      fields:
        "reference,reference__reference,reference__author,reference__year,reference__title,reference__journal__journal_name,reference__book,reference__volume,reference__number,reference__pages,reference__doi",
      distinct: true,
      format: "json",
    },
  }),
  useApiFetch<{ results?: any[] }>("/taxon/", {
    query: computed(() => ({
      parent: taxon.value?.id,
      ...getModeQueryParam(store.mode),
      fields: "id,taxon,parent__taxon,parent_id,rank__rank_en,rank__rank",
      format: "json",
    })),
  }),
  useApiFetch<{ results?: any[] }>("/taxon_description/", {
    query: {
      taxon: taxon.value.id,
      fields: "reference,reference__reference,description",
      order_by: "-reference__year",
      format: "json",
    },
  }),
  useApiFetch<{
    results: any[];
    count: number;
  }>("/solr/taxon_search/", {
    query: {
      q: computed(
        () =>
          `taxon_hierarchy:${taxon.value?.hierarchy_string}*${
            store.mode === "in_global" ? `` : ` AND ${store.mode}:1`
          }`
      ),
      fq: ["{!collapse field--locality}", "rank:[14 TO 17]"],
      sort: "fossil_group asc,taxon asc",
      rows: 1000,
      start: 0,
      fl: "src,locality,locality_en,locality_id,latlong",
      format: "json",
    },
  }),
  useApiFetch<{ results?: any[] }>("/taxon_opinion/", {
    query: {
      taxon: taxon.value.id,
      order_by: "-reference__year",
      format: "json",
    },
  }),
  useApiFetch<{ results?: any[] }>("/taxon/", {
    query: {
      id__in: formatHierarchyString(taxon.value.hierarchy_string),
      fields: "id,taxon,rank__rank,rank__rank_en",
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
  getImages(),
]);

const ranks = ref(ranksRes.value?.results ?? []);
const commonNames = ref(commonNamesRes.value?.results?.[0]);
const taxonPage = ref(pageRes.value?.results?.[0]);
const taxonOccurrence = ref(occurenceRes.value?.results ?? []);
const references = ref(referenceRes.value?.results ?? []);
const references2 = ref(reference2Res.value?.results ?? []);
const children = computed(() => childrenRes.value?.results ?? []);
const description = ref(descriptionRes.value?.results ?? []);
const map = computed(() => speciesMapRes.value?.results ?? []);
const cntLocalities = ref(speciesMapRes.value?.count);
const opinions = ref(opinionRes.value?.results ?? []);
state.hierarchy = hierarchyRes.value?.results ?? [];
state.isHierarchyLoaded = true;
state.specimenCollectionCnt = cntSpecimenCollectionRes.value?.count ?? 0;

function getModeQueryParam(mode: string) {
  if (mode === "in_baltoscandia") {
    return { in_baltoscandia: 1 };
  } else if (mode === "in_estonia") {
    return { in_estonia: 1 };
  }
  return {};
}
watch(
  () => store.mode,
  () => searchSpecies()
);
watch(
  () => store.searchParameters.species,
  () => searchSpecies(),
  { deep: true }
);

const parent = ref();
const sisterTaxa = ref();

if (isDefinedAndNotNull(taxon.value.parent)) {
  const [{ data: parentRes }, { data: sisterTaxaRes }] = await Promise.all([
    useApiFetch<{ results?: any[] }>("/taxon/", {
      query: {
        id: taxon.value.parent,
        fields: "id,taxon,rank__rank_en",
        format: "json",
      },
    }),
    useApiFetch<{ results?: any[] }>("/taxon/", {
      query: computed(() => ({
        parent_id: taxon.value?.parent,
        ...getModeQueryParam(store.mode),
        fields: "id,taxon,parent__taxon,parent_id,rank__rank_en,rank__rank",
        format: "json",
      })),
    }),
  ]);
  parent.value = parentRes.value?.results?.[0] ?? [];
  sisterTaxa.value = sisterTaxaRes.value?.results ?? [];
  state.isSisterTaxaLoaded = true;
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
  await searchSpecies();
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
const hierarchyData = computed(() => {
  return {
    sortedSisters: sortedSisters.value,
    parent: parent.value,
    taxon: taxon.value,
    hierarchy: state.hierarchy,
    sortedSiblings: sortedSiblings.value,
    sortedSistersWithoutCurrentTaxon: sortedSistersWithoutCurrentTaxon.value,
  };
});
const taxonTitle = computed(() => {
  let lang = locale.value;
  if (taxonPage.value && taxonPage.value.title) return taxonPage.value.title;
  let activeCommonName = filter(commonNames.value, function (o) {
    return o.language === lang && o.is_preferred === 1;
  });

  if (activeCommonName.length > 0) return activeCommonName[0].name;
});
const invalidTaxonName = computed(() => {
  return filter(opinions.value, function (o) {
    return o.opinion_type__invalid === true && o.is_preferred === true;
  });
});
const referencesCombined = computed(() => {
  if (!references2.value && !references.value) return [];
  let refs = references.value.concat(references2.value);
  let uniqueRefs = uniqBy(refs, "reference");
  if (uniqueRefs.length < 4) state.accordion.showAccordionReferences = true;
  return orderBy(uniqueRefs, "reference__year", ["desc"]);
});
const filteredCommonNames = computed(function () {
  let lang = locale.value;
  return filter(commonNames.value, function (o) {
    return o.language !== lang;
  });
});

const sortedSiblings = computed(function () {
  return orderBy(children.value, "taxon");
});
const sortedSisters = computed(function () {
  return orderBy(sisterTaxa.value, "taxon");
});
const sortedSistersWithoutCurrentTaxon = computed(function () {
  return excludeCurrentTaxon(
    sortedSisters.value,
    taxon.value?.id.toString() ?? ""
  );
});

const isTaxonomicTreeIsLoaded = computed(() => {
  return state.isSisterTaxaLoaded && state.isHierarchyLoaded;
});

const commonNamesStrings = computed(() => {
  return _map(commonNames.value, "name");
});
const childrenStrings = computed(() => {
  return _map(sortedSiblings.value, "taxon");
});
const meta = computed(() => {
  return [
    taxon.value?.parent__taxon,
    taxon.value?.taxon,
    taxon.value?.fossil_group__taxon,
    commonNamesStrings.value,
    childrenStrings.value,
  ].join(", ");
});
const isNumberOfLocalitiesOnMapOver1000 = computed(() => {
  return cntLocalities.value !== undefined && cntLocalities.value > 1000;
});
const computedOpinions = computed(() => {
  return opinions.value.filter((item) => {
    return (
      isDefinedAndNotNull(item.other_taxon) &&
      item.is_preferred === true &&
      item.opinion_type__invalid === true
    );
  });
});
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

function handleImageResponse(response: { results: any[] }) {
  state.images = composeImageRequest(response.results);
  state.imagesLoading = false;
}
async function getImages() {
  state.imagesLoading = true;
  const selectedImagesRes = await $apiFetch<{ results: any[] }>("/taxon/", {
    query: {
      sql: "get_taxon_selected_images",
      keyword: taxon.value?.id,
      page: 1,
      paginateBy: 10,
      format: "json",
    },
  });
  if (selectedImagesRes.results.length === 0) {
    const imagesRes = await $apiFetch<{ results: any[] }>("/taxon/", {
      query: {
        sql: "get_taxon_images",
        keyword: taxon.value?.hierarchy_string,
        page: 1,
        paginateBy: 10,
        format: "json",
      },
    });
    handleImageResponse(imagesRes);
  } else {
    handleImageResponse(selectedImagesRes);
  }
}

function isDifferentName(obj: any) {
  let localizedName = locale.value === "et" ? obj["et"] : obj["en"];
  return localizedName[0] !== localizedName[1] && localizedName[1] !== "";
}
function isAllowedMorePaging(
  page: number,
  response: { results: any[] },
  paginateBy: number
) {
  return !(
    response.results === undefined ||
    response.results.length === 0 ||
    response.results.length / page < paginateBy
  );
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
      rank
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
function excludeCurrentTaxon(list: any[], itemID: string) {
  return list.filter((val) => {
    return itemID.indexOf(val.id) === -1;
  });
}
function convertToTwoDecimal(value: number) {
  return value.toFixed(1);
}
function formatHierarchyString(value: string | undefined) {
  return value ? value.replace(/-/g, ",") : value;
}

function topNavigation() {
  location.href = "#top";
}
function setFancyBoxCaption(el: any) {
  let text = "",
    infoBtn = "",
    imgBtn = "",
    additionalInfo: any = {};
  switch (el.type) {
    case "selected_image":
      additionalInfo = {
        imageName: el.link_taxon,
        infoId: el.specimen_id,
        imageId: el.attachment_id,
        navigateId: el.link_id,
      };
      break;
    case "non_higher_taxon":
      additionalInfo = {
        imageName: el.specimen__specimen_id
          ? el.database__acronym + " " + el.specimen__specimen_id
          : el.database__acronym + " " + el.id,
        infoId: el.specimen_id,
        imageId: el.id ? el.id : el.specimen_image_id,
        navigateId: el.link
          ? el.link
          : el.specimen__specimenidentification__taxon__id,
      };
      break;
    case "higher_taxon":
      additionalInfo = {
        imageName: el.taxon,
        infoId: el.specimen_id,
        imageId: el.attachment_id,
        navigateId: el.taxon_id,
      };
    default:
      break;
  }

  // if(this.isHigherTaxon(this.taxon.rank__rank_en)) {}
  text +=
    '<div><button type="button" class="btn btn-xs  btn-primary" onclick="window.open(\'' +
    state.fossilsUrl +
    "/" +
    additionalInfo.navigateId +
    "?mode=in_baltoscandia&lang=en')\">Read more</button></div>";

  if (additionalInfo.infoId)
    infoBtn =
      '<button type="button" class="btn btn-sm  btn-info" onclick="window.open(\'' +
      state.geocollectionUrl +
      "/specimen/" +
      additionalInfo.infoId +
      "')\">INFO</button>";
  if (additionalInfo.imageId)
    imgBtn =
      ' <button type="button" class="btn btn-sm btn-secondary" onclick="window.open(\'' +
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

function composeImageRequest(taxonImages: any[]) {
  if (taxonImages === undefined || taxonImages.length === 0) return [];
  if (taxonImages.length > 0) {
    taxonImages.forEach(function (el) {
      function setImageType(el: any) {
        if (el.specimen_image_id || el.specimen_image_id === null) {
          return "non_higher_taxon";
        } else if (el.link_id || el.link_id === null) {
          return "selected_image";
        }
        return "higher_taxon";
      }

      function setImageSrc(el: any) {
        if (el.type === "higher_taxon") {
          el.thumbnail =
            state.fileUrl +
            "/small/" +
            el.filename.substring(0, 2) +
            "/" +
            el.filename.substring(2, 4) +
            "/" +
            el.filename;
          el.src =
            state.fileUrl +
            "/large/" +
            el.filename.substring(0, 2) +
            "/" +
            el.filename.substring(2, 4) +
            "/" +
            el.filename;
        } else if (el.type === "non_higher_taxon") {
          el.thumbnail =
            state.fileUrl +
            "/small/" +
            el.uuid_filename.substring(0, 2) +
            "/" +
            el.uuid_filename.substring(2, 4) +
            "/" +
            el.uuid_filename;
          el.src =
            state.fileUrl +
            "/large/" +
            el.uuid_filename.substring(0, 2) +
            "/" +
            el.uuid_filename.substring(2, 4) +
            "/" +
            el.uuid_filename;
        } else if (el.type === "selected_image") {
          el.thumbnail = el.preview_url;
          el.src = el.image_url;
        }
        return el;
      }
      el.type = setImageType(el);
      el = setImageSrc(el);
      el.caption = setFancyBoxCaption(el);
    });
    return taxonImages;
  }
  return [];
}

function applyMode(mode: string, separator = "=", queryJoiner = "&") {
  let returnVal = "";
  if (mode === "in_baltoscandia")
    returnVal = `${queryJoiner}in_baltoscandia${separator}1`;
  else if (mode === "in_estonia")
    returnVal = `${queryJoiner}in_estonia${separator}1`;
  return returnVal;
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

async function searchSpecies() {
  const speciesRes = await $apiFetch<{ count: number; results?: Species[] }>(
    "/taxon/",
    {
      query: {
        hierarchy_string__istartswith: taxon.value?.hierarchy_string,
        rank__rank_en: "species",
        ...getModeQueryParam(store.mode),
        order_by: "taxon",
        fields:
          "taxon,author_year,id,stratigraphy_base__stratigraphy_en,stratigraphy_base__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_top__stratigraphy",
        page: store.searchParameters.species.page,
        paginate_by: store.searchParameters.species.paginateBy,
        format: "json",
      },
    }
  );
  state.allSpecies = speciesRes.results ?? [];
  state.numberOfSpecimen = speciesRes.count;
}

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
