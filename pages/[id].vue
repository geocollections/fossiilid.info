<template>
  <Head>
    <Title>{{ taxon.taxon }}</Title>
    <Meta vmid="keywords" name="keywords" :content="meta" />
    <Meta vmid="description" name="description" :content="description" />
  </Head>
  <section class="container-fluid my-5">
    <div class="m-md-3 text-center" v-if="!isTaxonExisted">
      <div class="css-loader" style="margin: auto"></div>
      <h5 class="mt-3">{{ $t("messages.pageLoading") }}</h5>
    </div>
    <div class="page-container" v-if="isTaxonExisted">
      <div class="row mt-3" v-show="scroll">
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
                <a
                  :href="'/' + taxon.fossil_group__id"
                  v-if="taxon.fossil_group__id != null"
                >
                  <img
                    class="taxon-img"
                    style="max-width: 120px"
                    border="0"
                    :src="'/fossilgroups/' + taxon.fossil_group__id + '.png'"
                    :alt="taxon.fossil_group__taxon"
                    :title="taxon.fossil_group__taxon"
                  />
                </a>
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
      <TaxonTabs />
      <TabGallery v-if="activeTab === 'gallery'" />
      <TabSpecimens v-if="activeTab === 'specimens'" />
      <div class="row" v-if="activeTab === 'overview'">
        <div class="col-lg-8">
          <div
            class="row m-1"
            v-if="
              isDefinedAndNotEmpty(opinions) &&
              isDefinedAndNotEmpty(invalidTaxonName)
            "
          >
            <div
              class="alert alert-danger"
              style="width: 100%"
              v-if="computedOpinions.length > 0"
            >
              <div v-for="(item, index) in computedOpinions" :key="index">
                {{ $t("header.f_name_is_invalid") }}
                <a :href="item.other_taxon">{{ item.other_taxon__taxon }}</a>
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
                    taxon.fossil_group__id > 0 &&
                    taxon.fossil_group__id !== taxon.id
                  "
                >
                  {{ $t("header.f_fossil_group") }}:
                  <a :href="'/' + taxon.fossil_group__id">
                    {{ taxon.fossil_group__taxon }}
                  </a>
                </div>
                <div v-if="taxon.id != 29">
                  {{ $t("header.f_belongs_to") }}:
                  <a
                    :class="
                      isHigherTaxon(taxon.rank__rank_en) ? '' : 'fst-italic'
                    "
                    :href="'/' + parent.id"
                  >
                    {{ parent.taxon }}
                  </a>
                </div>
                <div
                  v-if="isDefinedAndNotEmpty(opinions)"
                  style="font-size: 0.9rem !important"
                >
                  1 {{ $t("header.f_other_names") }}:
                  <span v-for="(item, idx) in opinions" :key="idx">
                    <span v-if="isDefinedAndNotNull(item.other_taxon)">
                      <a :href="item.other_taxon">
                        {{ item.other_taxon__taxon }}
                      </a>
                      <span v-if="idx != opinions.length - 1">,</span>
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
                    v-if="taxon.stratigraphy_base__stratigraphy"
                    @click="
                      openUrl({
                        parent_url: geocollectionUrl + '/stratigraphy',
                        object: taxon.stratigraphy_base_id,
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
                      taxon.stratigraphy_base__stratigraphy != null
                    "
                  >
                    &rarr;
                  </span>
                  <a
                    href="#"
                    v-if="
                      taxon.stratigraphy_top__stratigraphy &&
                      taxon.stratigraphy_base__stratigraphy !=
                        taxon.stratigraphy_top__stratigraphy
                    "
                    @click="
                      openUrl({
                        parent_url: geocollectionUrl + '/stratigraphy',
                        object: taxon.stratigraphy_top_id,
                        width: 500,
                        height: 500,
                      })
                    "
                  >
                    {{ taxon.stratigraphy_top__stratigraphy }}
                  </a>
                  <span v-if="taxon.stratigraphy_base__age_base != null">
                    ({{ $t("header.f_taxon_age_within") }}
                    {{ convertToTwoDecimal(taxon.stratigraphy_base__age_base) }}
                  </span>
                  <!--
                                           -->
                  <span v-if="taxon.stratigraphy_top__age_top != null">
                    &ndash;{{
                      convertToTwoDecimal(taxon.stratigraphy_top__age_top)
                    }}
                    {{ $t("header.f_taxon_age_within_unit") }})
                  </span>
                  <br />
                </div>
                <div
                  v-if="
                    taxon.rank__rank_en != null &&
                    taxon.rank__rank_en != 'Species'
                  "
                >
                  <span v-if="mode === 'in_baltoscandia'">
                    {{ $t("header.f_baltic_species") }}
                  </span>
                  <span v-else-if="mode === 'in_estonia'">
                    {{ $t("header.f_estonian_species") }}
                  </span>
                  <span v-else>{{ $t("header.f_global_species") }}</span>
                  <strong>
                    <a href="#species" v-if="numberOfSpecimen !== null">
                      {{ numberOfSpecimen }}
                    </a>
                  </strong>
                </div>
              </div>
            </div>
          </div>
          <div class="m-1">
            <lingallery
              style="width: 100%"
              v-if="images && images.length > 0"
              ref="lingallery"
              :height="200"
              :items="images.slice(0, 10)"
            />
          </div>
          <div class="m-1">
            <SeeAlso
              v-if="
                (taxonPage && taxonPage.link_wikipedia != null) ||
                taxon.taxon_id_tol != null ||
                taxon.taxon_id_eol != null ||
                taxon.taxon_id_nrm != null ||
                taxon.taxon_id_plutof != null ||
                taxon.taxon_id_pbdb != null
              "
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
          <!-- Row contains description-->
          <div class="row m-1" v-if="description">
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">
                {{ $t("header.f_taxon_description_diagnosis") }}
              </div>
              <div class="card-body">
                <div v-for="item in description" v-if="item.description">
                  <h3 class="mb-3">
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
          <!-- TYPE SPECIMEN DATA begins-->
          <div class="row m-1" v-if="taxonTypeSpecimen">
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">
                {{ $t("header.f_species_type_data") }}
              </div>
              <div class="card-body">
                <div
                  :class="
                    idx === taxonTypeSpecimen.length - 1
                      ? ''
                      : 'border-bottom my-3'
                  "
                  v-for="(item, idx) in taxonTypeSpecimen"
                >
                  <span
                    v-if="
                      item.type_type__value !== null ||
                      item.type_type__value_en !== null
                    "
                  >
                    <span
                      v-translate="{
                        et: item.type_type__value,
                        en: item.type_type__value_en,
                      }"
                    ></span>
                    :
                  </span>
                  <span v-if="item.specimen === null">
                    {{ item.repository }} {{ item.specimen_number }}
                  </span>
                  <span v-if="item.specimen !== null">
                    <a
                      href="#"
                      @click="
                        openUrl({
                          parent_url: 'http://geocollections.info/specimen',
                          object: item.specimen,
                          width: 500,
                          height: 500,
                        })
                      "
                    >
                      {{ item.repository }} {{ item.specimen_number }}
                    </a>
                  </span>
                  <!--
                        -->
                  <span
                    v-if="
                      isAtLeastOneDefinedAndNotEmpty({
                        common: [
                          item.level,
                          item.attachment__filename,
                          item.remarks,
                        ],
                        et: [
                          item.stratigraphy__stratigraphy,
                          item.stratigraphy_free,
                          item.locality__locality,
                        ],
                        en: [
                          item.stratigraphy__stratigraphy_en,
                          item.stratigraphy_free_en,
                          item.locality__locality_en,
                        ],
                      })
                    "
                  >
                    ,
                  </span>
                  <a
                    @click="
                      openUrl({
                        parent_url: geocollectionUrl + '/locality',
                        object: item.locality,
                        width: 500,
                        height: 500,
                      })
                    "
                    href="#"
                    v-if="isDefinedAndNotNull(item.locality)"
                    v-translate="{
                      et: item.locality__locality,
                      en: item.locality__locality_en,
                    }"
                  ></a>
                  ,
                  <span
                    v-if="
                      isDifferentName({
                        et: [item.locality__locality, item.locality_free],
                        en: [item.locality__locality_en, item.locality_free_en],
                      })
                    "
                  >
                    (
                    <span
                      v-translate="{
                        et: item.locality_free,
                        en: item.locality_free_en,
                      }"
                    ></span>
                    )
                  </span>
                  <span v-if="isDefinedAndNotNull(item.level)">
                    {{ item.level }},
                  </span>
                  <a
                    @click="
                      openUrl({
                        parent_url: geocollectionUrl + '/stratigraphy',
                        object: item.stratigraphy,
                        width: 500,
                        height: 500,
                      })
                    "
                    href="#"
                    v-if="isDefinedAndNotNull(item.stratigraphy)"
                    v-translate="{
                      et: item.stratigraphy__stratigraphy,
                      en: item.stratigraphy__stratigraphy_en,
                    }"
                  ></a>
                  <span
                    v-if="
                      isDifferentName({
                        et: [
                          item.stratigraphy__stratigraphy,
                          item.stratigraphy_free,
                        ],
                        en: [
                          item.stratigraphy__stratigraphy_en,
                          item.stratigraphy_free_en,
                        ],
                      })
                    "
                  >
                    (
                    <span
                      v-translate="{
                        et: item.stratigraphy_free,
                        en: item.stratigraphy_free_en,
                      }"
                    ></span>
                    )
                  </span>
                  <span v-if="isDefinedAndNotNull(item.remarks)">
                    {{ item.remarks }}
                  </span>
                  <span
                    class="pl-3"
                    v-if="isDefinedAndNotNull(item.attachment__filename)"
                  >
                    <a
                      @click="
                        openUrl({
                          parent_url: geocollectionUrl + '/file',
                          object: item.attachment,
                          width: 500,
                          height: 500,
                        })
                      "
                      href="#"
                    >
                      <img
                        class="img-thumbnail previewImage"
                        style="max-height: 80px"
                        :src="composeImgUrl(item.attachment__filename, false)"
                      />
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- TYPE SPECIMEN DATA ends-->
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
                  <span v-if="isDefinedAndNotNull(synonym.reference)">
                    <a
                      href="#"
                      @click="
                        openUrl({
                          parent_url: 'http://geocollections.info/reference',
                          object: synonym.reference,
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
                  <!--
                               -->
                  <span v-if="isDefinedAndNotNull(synonym.figures)">
                    , {{ $t("abbreviation.fig") }}. {{ synonym.figures }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="row m-1" v-if="references && references.length > 0">
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">
                {{ $t("header.f_taxon_references") }}
              </div>
              <div class="card-body">
                <foldable :elLength="references.length">
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
                          object: reference.reference,
                          width: 500,
                          height: 500,
                        })
                      "
                    >
                      {{ reference.reference__author }}
                      {{ reference.reference__year }}.
                    </a>
                    <!--$author, $year. $title. $journal_name: $number or $book, $pages. DOI:$doi.-->
                    <span>{{ reference.reference__title }}.</span>

                    <span
                      v-if="reference.reference__journal__journal_name != null"
                    >
                      <!-- if journal article -->
                      <em>{{ reference.reference__journal__journal_name }}</em>
                      <strong>{{ reference.reference__volume }}</strong>
                      ,
                      <span v-if="reference.reference__number != null">
                        {{ reference.reference__number }},
                      </span>
                      <span
                        v-if="isDefinedAndNotNull(reference.reference__pages)"
                      >
                        {{ reference.reference__pages }}.
                      </span>
                    </span>
                    <span v-if="isDefinedAndNotNull(reference.reference__book)">
                      <!-- if book article -->
                      <em>{{ reference.reference__book }}</em>
                      , pp. {{ reference.reference__pages }}.
                    </span>

                    <span v-if="reference.reference__doi !== null">
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
            v-if="allSpecies && allSpecies.length > 0"
            id="species"
          >
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">{{ $t("header.f_species_list") }}</div>
              <div class="card-body">
                <div v-if="allSpecies && allSpecies.length > 0">
                  <div
                    style="font-size: 0.8em"
                    v-for="(item, idx) in allSpecies"
                  >
                    &ensp;&ensp;&ensp;{{ calculateSpeciesIdx(idx) }}.
                    <a :href="'/' + item.id">
                      <em>{{ item.taxon }}</em>
                      {{ item.author_year }}
                    </a>
                    <template
                      v-if="
                        item.stratigraphy_top__stratigraphy !=
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
                      <span v-if="item.stratigraphy_top__stratigraphy != null">
                        →
                      </span>
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
                      numberOfSpecimen > searchParameters.species.paginateBy
                    "
                  >
                    <BPagination
                      size="sm"
                      align="end"
                      :limit="5"
                      :hide-ellipsis="true"
                      :total-rows="response.count"
                      v-model="searchParameters.species.page"
                      :per-page="searchParameters.species.paginateBy"
                    ></BPagination>
                  </div>
                </div>
                <div v-else>Selle rühma all ei ole liike registreeritud</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div v-if="isDefinedAndNotEmpty(distributionConop)">
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
          <ClientOnly>
            <b-row class="m-1" v-if="map !== undefined && map.length > 0">
              <div class="card px-0 rounded-0" style="width: 100%">
                <div class="card-header">
                  {{ $t("header.f_distribution_map") }}
                </div>
                <div class="card-body no-padding">
                  <map-component :map-data="map"></map-component>
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
          </ClientOnly>
          <div class="row m-1" v-if="isTaxonomicTreeIsLoaded">
            <div class="card px-0 rounded-0" style="width: 100%">
              <div class="card-header">
                {{ $t("header.fossils_classification") }}
              </div>
              <div class="card-body" style="font-size: 0.8em">
                <taxonomical-tree
                  :lists="lists"
                  :hierarchy-data="hierarchyData"
                ></taxonomical-tree>
              </div>
            </div>
          </div>

          <div
            class="row m-1"
            v-if="!isHigherTaxon(taxon.rank__rank_en) && taxonOccurrence"
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
          <div class="row m-1" v-if="isDefinedAndNotEmpty(distributionSamples)">
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
                      geocollectionUrl +
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

<script>
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import uniqBy from "lodash/uniqBy";
import map from "lodash/map";
import { useRootStore } from "../stores/root";
import { mapState, mapWritableState } from "pinia";
import TabGallery from "~/components/tabs/TabGallery.vue";
import TabSpecimens from "~/components/tabs/TabSpecimens.vue";
import Foldable from "~/components/Foldable.vue";
import Lingallery from "~/components/Lingallery.vue";
import SeeAlso from "~/components/SeeAlso.vue";
import dayjs from "dayjs";

export default defineNuxtComponent({
  components: { TabGallery, TabSpecimens, Foldable, Lingallery, SeeAlso },
  data() {
    return this.initialData();
  },
  computed: {
    ...mapWritableState(useRootStore, ["errorMessage", "activeTab"]),
    ...mapState(useRootStore, ["lang", "mode", "searchParameters"]),
    dateAdded() {
      return dayjs(this.taxon.date_added).format("YYYY-MM-DD");
    },
    dateChanged() {
      return dayjs(this.taxon.date_changed).format("YYYY-MM-DD");
    },
    hierarchyData() {
      return {
        sortedSisters: this.sortedSisters,
        parent: this.parent,
        taxon: this.taxon,
        hierarchy: this.hierarchy,
        sortedSiblings: this.sortedSiblings,
        sortedSistersWithoutCurrentTaxon: this.sortedSistersWithoutCurrentTaxon,
        taxon: this.taxon,
      };
    },
    taxon() {
      return this.taxon;
    },
    isTaxonExisted() {
      if (this.taxon && this.taxon.hasOwnProperty("id")) {
        return true;
      } else {
        let id = this.$route.params.id;
        this.errorMessage = `This taxon with id <strong>${id}</strong> is not existing or not available `;
        this.$router.push({ path: "/" });
        return false;
      }
    },
    taxonTitle: function () {
      let lang = this.$i18n.locale;
      if (this.taxonPage && this.taxonPage.title) return this.taxonPage.title;
      let activeCommonName = filter(this.commonNames, function (o) {
        return o.language === lang && o.is_preferred === 1;
      });

      if (activeCommonName.length > 0) return activeCommonName[0].name;
    },
    invalidTaxonName() {
      return filter(this.opinions, function (o) {
        return o.opinion_type__invalid === true && o.is_preferred === true;
      });
    },
    opinions() {
      return this.opinions;
    },
    description() {
      return this.description;
    },
    commonNames() {
      return this.commonNames;
    },
    taxonTypeSpecimen() {
      return this.typeSpecimen;
    },
    distributionSamples() {
      return this.distributionSamples;
    },
    distributionConop() {
      return this.distributionConop;
    },
    specimenIdentification() {
      return this.specimenIdentification;
    },
    taxonOccurrence() {
      return this.taxonOccurrence;
    },
    references() {
      if (
        (this.references === [] && this.references2 === []) ||
        this.references === false ||
        this.references2 === false ||
        this.references === undefined ||
        this.references2 === undefined
      )
        return {};
      let refs = this.references.concat(this.references2);
      let uniqueRefs = uniqBy(refs, "reference");
      if (uniqueRefs.length < 4) this.accordion.showAccordionReferences = true;
      return orderBy(uniqueRefs, "reference__year", ["desc"]);
    },
    siblings() {
      return this.children;
    },
    synonyms() {
      return this.synonims;
    },
    //is not actually used
    taxonList() {
      return this.taxonList;
    },
    // taxonPage: function () {
    //   let taxonPages = this.taxonPage;
    //   if (taxonPages === undefined || taxonPages.length === 0) return {};
    //   return taxonPages[0];
    // },
    filteredCommonNames: function () {
      let lang = this.$i18n.locale;
      return filter(this.commonNames, function (o) {
        return o.language !== lang;
      });
    },

    sortedSiblings: function () {
      return orderBy(this.siblings, "taxon");
    },
    sortedSisters: function () {
      return orderBy(this.sister_taxa, "taxon");
    },
    sortedSistersWithoutCurrentTaxon: function () {
      return this.excludeCurrentTaxon(
        this.sortedSisters,
        this.$route.params.id
      );
    },

    isTaxonomicTreeIsLoaded() {
      return this.isSisterTaxaLoaded && this.isHierarchyLoaded;
    },

    commonNamesStrings() {
      return map(this.commonNames, "name");
    },
    childrenStrings() {
      return map(this.sortedSiblings, "taxon");
    },
    meta() {
      return [
        this.taxon.parent__taxon,
        this.taxon.taxon,
        this.taxon.fossil_group__taxon,
        this.commonNamesStrings,
        this.childrenStrings,
      ].join(", ");
    },
    map_() {
      return this.map;
    },
    isMapLoaded() {
      return !!(
        this.map_ &&
        ["Species", "Subspecies", "Genus", "Supergenus", "Subgenus"].indexOf(
          this.taxon.rank__rank_en
        ) >= 0 &&
        // && ['Species','Subspecies','Genus','Supergenus','Subgenus'].includes(this.taxon.rank__rank_en)
        this.isDefinedAndNotNull(this.taxon.taxon)
      );
    },
    isNumberOfLocalitiesOnMapOver1000() {
      return this.cntLocalities !== undefined && this.cntLocalities > 1000;
    },
    computedOpinions() {
      return this.opinions.filter((item) => {
        return (
          this.isDefinedAndNotNull(item.other_taxon) &&
          item.is_preferred === true &&
          item.opinion_type__invalid === true
        );
      });
    },
  },

  async asyncData({ $pinia, $router, $i18n }) {
    const rootStore = useRootStore($pinia);
    const id = $router.currentRoute._value.params.id;
    const mode = rootStore.mode;
    const taxonRes = await $fetch(
      `/taxon/?id=${id}&fields=id,taxon,parent,parent__taxon,rank__rank,rank__rank_en,fossil_group__id,is_fossil_group,fossil_group__taxon,hierarchy_string,author_year,date_added,date_changed,stratigraphy_base__stratigraphy,stratigraphy_base_id,stratigraphy_top_id,stratigraphy_base__age_base,stratigraphy_top__age_top,stratigraphy_top__stratigraphy,taxon_id_tol,taxon_id_eol,taxon_id_nrm,taxon_id_plutof,taxon_id_pbdb&format=json`,
      { baseURL: "https://api.geocollections.info" }
    );
    const taxon = (taxonRes.results && taxonRes.results[0]) || false;
    let speciesMapMode = mode === "in_global" ? `` : ` AND ${mode}:1`;
    const applyMode = (mode, separator = "=", queryJoiner = "&") => {
      let returnVal = "";
      if (mode === "in_baltoscandia")
        returnVal = `${queryJoiner}in_baltoscandia${separator}1`;
      else if (mode === "in_estonia")
        returnVal = `${queryJoiner}in_estonia${separator}1`;
      return returnVal;
    };

    const [
      ranksRes,
      taxonCommonNamesRes,
      taxonPagesRes,
      taxonOccurrenceRes,
      referencesRes,
      references2Res,
      childrenRes,
      descriptionsRes,
      speciesMapRes,
      opinionsRes,
    ] = await Promise.all([
      $fetch(`/taxon_rank/?order_by=sort&format=json`, {
        baseURL: "https://api.geocollections.info",
      }),
      $fetch(
        `/taxon_common_name/?taxon=${id}&is_preferred=1&fields=language,name,is_preferred&format=json`,
        { baseURL: "https://api.geocollections.info" }
      ),
      $fetch(
        `/taxon_page/?taxon=${id}&language=${$i18n.locale.value}&fields=content,author_txt,date_txt,link_wikipedia,title&format=json`,
        { baseURL: "https://api.geocollections.info" }
      ),
      $fetch(
        `/taxon_occurrence/?taxon__taxon__icontains=${taxon.taxon}&fields=reference,reference__reference,locality__locality,locality__locality_en,depth_interval,depth,stratigraphy_base__stratigraphy,stratigraphy_base__stratigraphy_en&format=json`,
        { baseURL: "https://api.geocollections.info" }
      ),
      $fetch(
        `/taxon_occurrence/?taxon__hierarchy_string__istartswith=${taxon.hierarchy_string}&reference!=null&order_by=-reference__year&fields=reference,reference__reference,reference__author,reference__year,reference__title,reference__journal__journal_name,reference__book,reference__volume,reference__number,reference__pages,reference__doi&distinct=true&format=json`,
        { baseURL: "https://api.geocollections.info" }
      ),
      $fetch(
        `/specimen_identification/?taxon__hierarchy_string__istartswith=${taxon.hierarchy_string}&reference!=null&order_by=-reference__year&fields=reference,reference__reference,reference__author,reference__year,reference__title,reference__journal__journal_name,reference__book,reference__volume,reference__number,reference__pages,reference__doi&distinct=true&format=json`,
        { baseURL: "https://api.geocollections.info" }
      ),
      $fetch(
        `/taxon/?parent=${id}${applyMode(
          mode
        )}&fields=id,taxon,parent__taxon,parent_id,rank__rank_en,rank__rank&format=json`,
        { baseURL: "https://api.geocollections.info" }
      ),
      $fetch(
        `/taxon_description/?taxon=${id}&fields=reference,reference__reference,description&order_by=-reference__year&format=json`,
        { baseURL: "https://api.geocollections.info" }
      ),
      $fetch(
        `/solr/taxon_search/?q=taxon_hierarchy:${taxon.hierarchy_string}*${speciesMapMode}&fq=%7B%21collapse%20field--locality%7D&fq=rank:[14%20TO%2017]&sort=fossil_group asc,taxon asc&rows=1000&start=0&fl=src,locality,locality_en,locality_id,latlong&format=json`,
        { baseURL: "https://api.geocollections.info" }
      ),
      $fetch(
        `/taxon_opinion/?taxon=${id}&order_by=-reference__year&format=json`,
        { baseURL: "https://api.geocollections.info" }
      ),
    ]);

    const rankFields = {
      synonims: false,
      typeSpecimen: false,
      distributionSamples: false,
      distributionConop: false,
    };
    if (["Species", "Subspecies"].indexOf(taxon.rank__rank_en) >= 0) {
      const [
        synonymRes,
        typeSpecimenRes,
        distributionSamplesRes,
        distributionConopRes,
      ] = await Promise.all([
        $fetch(`/taxon_synonym/?taxon=${id}&order_by=year&format=json`, {
          baseURL: "https://api.geocollections.info",
        }),
        $fetch(`/taxon_type_specimen/?taxon=${id}&format=json`, {
          baseURL: "https://api.geocollections.info",
        }),
        $fetch(
          `/taxon/?sql=get_species_distribution_sample&keyword=${taxon.taxon}&format=json`,
          { baseURL: "https://api.geocollections.info" }
        ),
        $fetch(
          `/taxon/?sql=get_species_distribution_conop&keyword=${taxon.taxon}&format=json`
        ),
      ]);
      rankFields.typeSpecimen = typeSpecimenRes.results || false;
      rankFields.synonims = synonymRes.results || false;
      rankFields.distributionSamples = distributionSamplesRes.results || false;
      rankFields.distributionConop = distributionConopRes.results || false;
    }

    return {
      taxon: (taxonRes.results && taxonRes.results[0]) || false,
      commonNames:
        (taxonCommonNamesRes.results && taxonCommonNamesRes.results[0]) ||
        false,
      taxonPage: (taxonPagesRes.results && taxonPagesRes.results[0]) || false,
      taxonOccurence: taxonOccurrenceRes.results || false,
      references: referencesRes.results || false,
      references2: references2Res.results || false,
      children: childrenRes.results || false,
      description: descriptionsRes.results || false,
      map: speciesMapRes.results || false,
      cntLocalities: speciesMapRes.count || false,
      opinions: opinionsRes.results || false,
      lists: {
        ranks: ranksRes.results || false,
      },
      ...rankFields,
    };
  },

  beforeMount() {
    document.body.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    document.body.addEventListener("scroll", this.handleScroll);
  },

  async mounted() {
    window.addEventListener("scroll", this.handleScroll);
    if (this.taxon && this.taxon.hasOwnProperty("id")) {
      // Object.assign(this.$data, this.initialData());
      await this.loadFullTaxonInfo();
    }
  },

  methods: {
    initialData: function () {
      return {
        geocollectionUrl: "http://geocollections.info",
        fossilsUrl: "https://fossiilid.info",
        kividUrl: "http://www.kivid.info",
        fileUrl: "https://files.geocollections.info",
        isReferencesCollapsed: true,
        scroll: false,
        parent: {},
        images: [],
        activeSection: "overview",
        specimenCollectionCnt: false,
        loaders: {
          isSpecimenCollectionLoaded: false,
        },
        accordion: {
          showAccordionReferences: false,
        },
        toggle: "",
        mapDataLoaded: false,
        sister_taxa: {},
        hierarchy: {},
        numberOfSpecimen: null,
        requestingData: false,
        isSisterTaxaLoaded: false,
        isHierarchyLoaded: false,
        allSpecies: [],
        response: {
          count: 0,
          results: [],
        },
      };
    },
    async refreshData() {
      const taxon = this.taxon;
      const id = this.$route.params.id;
      let speciesMapMode =
        this.mode === "in_global" ? `` : ` AND ${this.mode}:1`;
      const mode = this.mode;
      const [
        taxonCommonNamesRes,
        taxonPagesRes,
        taxonOccurrenceRes,
        referencesRes,
        references2Res,
        childrenRes,
        descriptionsRes,
        speciesMapRes,
        opinionsRes,
      ] = await Promise.all([
        $fetch(
          `/taxon_common_name/?taxon=${id}&is_preferred=1&fields=language,name,is_preferred&format=json`,
          { baseURL: "https://api.geocollections.info" }
        ),
        $fetch(
          `/taxon_page/?taxon=${id}&language=${this.$i18n.locale}&fields=content,author_txt,date_txt,link_wikipedia,title&format=json`,
          { baseURL: "https://api.geocollections.info" }
        ),
        $fetch(
          `/taxon_occurrence/?taxon__taxon__icontains=${taxon.taxon}&fields=reference,reference__reference,locality__locality,locality__locality_en,depth_interval,depth,stratigraphy_base__stratigraphy,stratigraphy_base__stratigraphy_en&format=json`,
          { baseURL: "https://api.geocollections.info" }
        ),
        $fetch(
          `/taxon_occurrence/?taxon__hierarchy_string__istartswith=${taxon.hierarchy_string}&reference!=null&order_by=-reference__year&fields=reference,reference__reference,reference__author,reference__year,reference__title,reference__journal__journal_name,reference__book,reference__volume,reference__number,reference__pages,reference__doi&distinct=true&format=json`,
          { baseURL: "https://api.geocollections.info" }
        ),
        $fetch(
          `/specimen_identification/?taxon__hierarchy_string__istartswith=${taxon.hierarchy_string}&reference!=null&order_by=-reference__year&fields=reference,reference__reference,reference__author,reference__year,reference__title,reference__journal__journal_name,reference__book,reference__volume,reference__number,reference__pages,reference__doi&distinct=true&format=json`,
          { baseURL: "https://api.geocollections.info" }
        ),
        $fetch(
          `/taxon/?parent=${id}${this.applyMode(
            mode
          )}&fields=id,taxon,parent__taxon,parent_id,rank__rank_en,rank__rank&format=json`,
          { baseURL: "https://api.geocollections.info" }
        ),
        $fetch(
          `/taxon_description/?taxon=${id}&fields=reference,reference__reference,description&order_by=-reference__year&format=json`,
          { baseURL: "https://api.geocollections.info" }
        ),
        $fetch(
          `/solr/taxon_search/?q=taxon_hierarchy:${taxon.hierarchy_string}*${speciesMapMode}&fq=%7B%21collapse%20field--locality%7D&fq=rank:[14%20TO%2017]&sort=fossil_group asc,taxon asc&rows=1000&start=0&fl=src,locality,locality_en,locality_id,latlong&format=json`,
          { baseURL: "https://api.geocollections.info" }
        ),
        $fetch(
          `/taxon_opinion/?taxon=${id}&order_by=-reference__year&format=json`,
          { baseURL: "https://api.geocollections.info" }
        ),
      ]);
      this.commonNames =
        (taxonCommonNamesRes.results && taxonCommonNamesRes.results[0]) ||
        false;
      this.taxonPage =
        (taxonPagesRes.results && taxonPagesRes.results[0]) || false;
      this.taxonOccurence = taxonOccurrenceRes.results || false;
      this.references = referencesRes.results || false;
      this.references2 = references2Res.results || false;
      this.children = childrenRes.results || false;
      this.description = descriptionsRes.results || false;
      this.map = speciesMapRes.results || false;
      this.cntLocalities = speciesMapRes.count || false;
      this.opinions = opinionsRes.results || false;

      if (["Species", "Subspecies"].indexOf(taxon.rank__rank_en) >= 0) {
        const [
          synonymRes,
          typeSpecimenRes,
          distributionSamplesRes,
          distributionConopRes,
        ] = await Promise.all([
          $fetch(`/taxon_synonym/?taxon=${id}&order_by=year&format=json`, {
            baseURL: "https://api.geocollections.info",
          }),
          $fetch(`/taxon_type_specimen/?taxon=${id}&format=json`, {
            baseURL: "https://api.geocollections.info",
          }),
          $fetch(
            `/taxon/?sql=get_species_distribution_sample&keyword=${taxon.taxon}&format=json`,
            { baseURL: "https://api.geocollections.info" }
          ),
          $fetch(
            `/taxon/?sql=get_species_distribution_conop&keyword=${taxon.taxon}&format=json`
          ),
        ]);
        this.typeSpecimen = typeSpecimenRes.results || false;
        this.synonims = synonymRes.results || false;
        this.distributionSamples = distributionSamplesRes.results || false;
        this.distributionConop = distributionConopRes.results || false;
      }
    },
    applyMode(mode, separator = "=", queryJoiner = "&") {
      let returnVal = "";
      if (mode === "in_baltoscandia")
        returnVal = `${queryJoiner}in_baltoscandia${separator}1`;
      else if (mode === "in_estonia")
        returnVal = `${queryJoiner}in_estonia${separator}1`;
      return returnVal;
    },
    async loadFullTaxonInfo() {
      if (this.isDefinedAndNotNull(this.taxon.parent)) {
        const parentRes = await $fetch(
          `/taxon/?id=${this.taxon.parent}&fields=id,taxon,rank__rank_en&format=json`,
          { baseURL: "https://api.geocollections.info" }
        );
        this.parent = parentRes.results ? parentRes.results[0] : {};

        const sisterTaxaRes = await $fetch(
          `/taxon/?parent_id=${this.taxon.parent}${this.applyMode(
            this.mode
          )}&fields=id,taxon,parent__taxon,parent_id,rank__rank_en,rank__rank&format=json`,
          { baseURL: "https://api.geocollections.info" }
        );
        this.sister_taxa = sisterTaxaRes.results;
        this.isSisterTaxaLoaded = true;
      }

      if (this.taxon.rank__rank_en !== "Species") {
        await this.searchSpecies();
      }

      const hierarchyRes = await $fetch(
        `/taxon/?id__in=${this.formatHierarchyString(
          this.taxon.hierarchy_string
        )}&fields=id,taxon,rank__rank,rank__rank_en&format=json`,
        { baseURL: "https://api.geocollections.info" }
      );
      this.hierarchy = hierarchyRes.results;
      this.isHierarchyLoaded = true;

      await this.getImages();

      const cntSpecimenCollectionRes = await $fetch(
        `/solr/specimen/?q=hierarchy_string:(${this.taxon.hierarchy_string}*)&rows=1&format=json`,
        { baseURL: "https://api.geocollections.info" }
      );
      this.specimenCollectionCnt = cntSpecimenCollectionRes.count;
    },
    handleImageResponse(searchParameters, response) {
      searchParameters.allowPaging = this.isAllowedMorePaging(
        searchParameters.page,
        response,
        searchParameters.paginateBy
      );
      if (searchParameters.allowPaging) searchParameters.page += 1;
      this.images = this.composeImageRequest(response.results);
      this.imagesLoading = false;
      return searchParameters;
    },
    async getImages() {
      this.imagesLoading = true;
      const selectedImagesRes = await $fetch(
        `/taxon/?sql=get_taxon_selected_images&keyword=${this.taxon.id}&page=${this.searchParameters.selectedImages.page}&paginate_by=${this.searchParameters.selectedImages.paginateBy}&format=json`,

        { baseURL: "https://api.geocollections.info" }
      );
      if (selectedImagesRes.results.length === 0) {
        const imagesRes = await $fetch(
          `/taxon/?sql=get_taxon_images&keyword=${this.taxon.hierarchy_string}&page=${this.searchParameters.images.page}&paginate_by=${this.searchParameters.images.paginateBy}&format=json`,
          { baseURL: "https://api.geocollections.info" }
        );
        this.handleImageResponse(this.searchParameters.images, imagesRes);
        this.searchParameters.selectedImages.allowPaging = false;
      } else {
        this.handleImageResponse(
          this.searchParameters.selectedImages,
          selectedImagesRes
        );
      }
    },

    isDifferentName(obj) {
      let localizedName = this.$i18n.locale === "et" ? obj["et"] : obj["en"];
      return localizedName[0] !== localizedName[1] && localizedName[1] !== "";
    },
    isAllowedMorePaging(page, response, paginateBy) {
      return !(
        response.results === undefined ||
        response.results.length === 0 ||
        parseInt(response.results.length) / page < paginateBy
      );
    },
    //todo: utils
    composeImgUrl(uuid_filename, isFull) {
      if (uuid_filename && uuid_filename != null) {
        return isFull
          ? this.fileUrl +
              "/large/" +
              uuid_filename.substring(0, 2) +
              "/" +
              uuid_filename.substring(2, 4) +
              "/" +
              uuid_filename
          : this.fileUrl +
              "/small/" +
              uuid_filename.substring(0, 2) +
              "/" +
              uuid_filename.substring(2, 4) +
              "/" +
              uuid_filename;
      }
    },
    //todo: utils
    isDefinedAndNotEmpty(value) {
      return !!value && value.length > 0;
    },

    //todo: utils
    isDefinedAndNotNull(value) {
      return !!value && value !== null;
    },
    arrayHasNonNullElement(arr) {
      let this_ = this,
        found = false;
      arr.forEach(function (el) {
        found = this_.isDefinedAndNotNull(el);
      });
      return found;
    },
    isAtLeastOneDefinedAndNotEmpty(arr) {
      let found = this.arrayHasNonNullElement(arr["common"]);
      if (found) return found;

      let localizedArr = this.$i18n.locale === "et" ? arr["et"] : arr["en"];
      found = this.arrayHasNonNullElement(localizedArr);
      return found;
    },
    isHigherTaxon(rank) {
      // return !['Species','Subspecies','Genus','Supergenus','Subgenus'].includes(rank)
      return !(
        ["Species", "Subspecies", "Genus", "Supergenus", "Subgenus"].indexOf(
          rank
        ) >= 0
      );
    },
    calculateSpeciesIdx: function (idx) {
      return (
        idx +
        1 +
        this.searchParameters.species.paginateBy *
          this.searchParameters.species.page -
        this.searchParameters.species.paginateBy
      );
    },
    //todo: utils
    openUrl: function (params) {
      window.open(
        params.parent_url + "/" + params.object,
        "",
        "width=" + params.width + ",height=" + params.height,
        scrollbars
      );
    },
    excludeCurrentTaxon: function (list, itemID) {
      return list.filter(function (val, i) {
        return itemID.indexOf(val.id) === -1;
      }, this);
    },
    //todo: utils
    convertToTwoDecimal: function (value) {
      return value.toFixed(1);
    },
    //todo: utils
    formatHierarchyString: function (value) {
      return value ? value.replace(/-/g, ",") : value;
    },

    topNavigation: function () {
      location.href = "#top";
    },
    setFancyBoxCaption: function (el) {
      let text = "",
        infoBtn = "",
        imgBtn = "",
        additionalInfo = {};
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
        this.fossilsUrl +
        "/" +
        additionalInfo.navigateId +
        "?mode=in_baltoscandia&lang=en')\">Read more</button></div>";

      if (additionalInfo.infoId)
        infoBtn =
          '<button type="button" class="btn btn-sm  btn-info" onclick="window.open(\'' +
          this.geocollectionUrl +
          "/specimen/" +
          additionalInfo.infoId +
          "')\">INFO</button>";
      if (additionalInfo.imageId)
        imgBtn =
          ' <button type="button" class="btn btn-sm btn-secondary" onclick="window.open(\'' +
          this.geocollectionUrl +
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
    },

    //todo: utils
    composeImageRequest(taxonImages) {
      if (
        taxonImages === undefined ||
        taxonImages === {} ||
        taxonImages.length === 0
      )
        return;
      if (taxonImages.length > 0) {
        let this_ = this;
        taxonImages.forEach(function (el) {
          function setImageType(el) {
            if (el.specimen_image_id || el.specimen_image_id === null) {
              return "non_higher_taxon";
            } else if (el.link_id || el.link_id === null) {
              return "selected_image";
            }
            return "higher_taxon";
          }

          function setImageSrc(el) {
            if (el.type === "higher_taxon") {
              el.thumbnail =
                this_.fileUrl +
                "/small/" +
                el.filename.substring(0, 2) +
                "/" +
                el.filename.substring(2, 4) +
                "/" +
                el.filename;
              el.src =
                this_.fileUrl +
                "/large/" +
                el.filename.substring(0, 2) +
                "/" +
                el.filename.substring(2, 4) +
                "/" +
                el.filename;
            } else if (el.type === "non_higher_taxon") {
              el.thumbnail =
                this_.fileUrl +
                "/small/" +
                el.uuid_filename.substring(0, 2) +
                "/" +
                el.uuid_filename.substring(2, 4) +
                "/" +
                el.uuid_filename;
              el.src =
                this_.fileUrl +
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
          el.caption = this_.setFancyBoxCaption(el);
        });
        return taxonImages;
      }
      return [];
    },

    async searchSpecies() {
      const speciesRes = await $fetch(
        `/taxon/?hierarchy_string__istartswith=${
          this.taxon.hierarchy_string
        }&rank__rank_en=species${this.applyMode(
          this.mode
        )}&order_by=taxon&fields=taxon,author_year,id,stratigraphy_base__stratigraphy_en,stratigraphy_base__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_top__stratigraphy&page=${
          this.searchParameters.species.page
        }&paginate_by=${this.searchParameters.species.paginateBy}&format=json`,
        { baseURL: "https://api.geocollections.info" }
      );
      this.allSpecies = speciesRes.results;
      this.numberOfSpecimen = speciesRes.count;
      this.response.count = speciesRes.count;
      this.response.results = speciesRes.results;
    },

    handleScroll(e) {
      this.scroll = window.scrollY > 150;
    },
  },

  watch: {
    "searchParameters.species": {
      async handler() {
        await this.searchSpecies();
        await this.refreshData();
      },
      deep: true,
    },
    mode: {
      async handler() {
        await this.searchSpecies();
        await this.refreshData();
      },
      deep: true,
    },
  },
});
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
