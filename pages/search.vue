<template>
  <section class="container-fluid my-5">
    <div
      class="page-container"
      style="max-width: 1280px; margin-left: auto; margin-right: auto"
    >
      <b-row class="text-center">
        <b-col>
          <h1 style="padding: 5px 0 20px 0">{{ $t("menu.detail_search") }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" class="ms-auto" style="padding-right: 0.1rem !important">
          <div class="card rounded-0" style="width: 100%; height: 100%">
            <div class="card-body">
              <b-row class="my-1">
                <b-col sm="4">
                  <label>{{ $t("advancedsearch.hightaxon") }}:</label>
                </b-col>
                <b-col sm="8">
                  <vue-multiselect
                    class="align-middle"
                    v-model="state.searchForm.higherTaxa"
                    deselect-label="Can't remove this value"
                    select-label=""
                    track-by="id"
                    label="taxon"
                    :options="taxonSearchState.options"
                    :searchable="true"
                    @search-change="searchTaxonOptions"
                    :allow-empty="true"
                    :show-no-results="false"
                    :loading="taxonSearchState.isLoading"
                    :hide-selected="false"
                    :internal-search="false"
                    :max-height="600"
                    :open-direction="'bottom'"
                  >
                    <template #singleLabel="{ option }">
                      <strong>{{ option.taxon }}</strong>
                    </template>
                    <template #noResult><b>NoRes</b></template>
                    <template #clear="props">
                      <div
                        class="multiselect__clear"
                        v-if="true"
                        @mousedown.prevent.stop="clearAll(props.search)"
                      ></div>
                    </template>
                  </vue-multiselect>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="4">
                  <label>{{ $t("advancedsearch.species") }}:</label>
                </b-col>
                <b-col sm="8">
                  <input
                    class="form-control form-control-sm"
                    type="text"
                    v-model="state.searchForm.speciesField"
                    v-on:keydown.enter="search"
                  />
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="4">
                  <label>{{ $t("advancedsearch.author") }}:</label>
                </b-col>
                <b-col sm="8">
                  <input
                    class="form-control form-control-sm"
                    type="text"
                    v-model="state.searchForm.authorField"
                    v-on:keydown.enter="search"
                  />
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="4">
                  <label>{{ $t("advancedsearch.locality") }}:</label>
                </b-col>
                <b-col sm="8">
                  <input
                    class="form-control form-control-sm"
                    type="text"
                    v-model="state.searchForm.localityField"
                    v-on:keydown.enter="search"
                  />
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="4">
                  <label>{{ $t("advancedsearch.stratigraphy") }}:</label>
                </b-col>
                <b-col sm="8">
                  <vue-multiselect
                    class="align-middle"
                    v-model="state.searchForm.stratigraphy"
                    deselect-label="Can't remove this value"
                    select-label=""
                    :custom-label="displayStratigraphyResults"
                    track-by="id"
                    :options="stratigraphySearchState.options"
                    :searchable="true"
                    @search-change="searchStratigraphyOptions"
                    :allow-empty="true"
                    :show-no-results="false"
                    :loading="stratigraphySearchState.isLoading"
                    :max-height="600"
                    :open-direction="'bottom'"
                  >
                    <template #singleLabel="{ option }">
                      <strong>
                        {{
                          $i18n.locale === "et"
                            ? option.stratigraphy
                            : option.stratigraphy_en
                        }}
                      </strong>
                    </template>
                    <template #noResult><b>NoRes</b></template>
                    <template #clear="props">
                      <div
                        class="multiselect__clear"
                        v-if="true"
                        @mousedown.prevent.stop="clearAll(props.search)"
                      ></div>
                    </template>
                  </vue-multiselect>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="12">
                  <b-form-checkbox
                    id="subsurfaceCheckbox"
                    v-model="state.searchForm.isSubsurface"
                  >
                    {{ $t("advancedsearch.subsurfaceField") }}
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="4">
                  <b-form-checkbox
                    id="nearMeSearchCheckbox"
                    v-model="state.searchForm.isNearMeSearch"
                  >
                    {{ $t("advancedsearch.showNearMeField") }}
                  </b-form-checkbox>
                </b-col>
                <b-col md="12" v-if="state.errorMessage !== null">
                  <b-alert :model-value="true" variant="warning">
                    {{ state.errorMessage }}
                  </b-alert>
                </b-col>
                <b-col sm="8" class="pt-2">
                  <vue-slider
                    ref="slider"
                    :min="0"
                    :max="20"
                    :piecewiseLabel="true"
                    width="100%"
                    :show="state.searchForm.isNearMeSearch === true"
                    :value="state.searchForm.radius"
                    @input="state.searchForm.radius = $event"
                    :disabled="state.errorMessage !== null"
                  >
                    <template #label="{ label, active }">
                      <span
                        style="
                          margin-left: -5px;
                          font-size: 0.7rem;
                          width: 40px !important;
                          display: inline-block;
                        "
                        :class="['custom-label', { active }]"
                        v-if="label % 20 === 0"
                      >
                        {{ label }} km
                      </span>
                    </template>
                  </vue-slider>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="4"></b-col>
                <b-col sm="8">
                  <button
                    @click="search"
                    type="button"
                    class="btn btn-primary p-2"
                    style="float: right; font-size: 0.8rem"
                  >
                    {{ $t("advancedsearch.btn_search") }}
                  </button>
                  <button
                    @click="clearSearch()"
                    type="button"
                    class="btn btn-outline-info p-2 me-2"
                    style="float: right; font-size: 0.8rem"
                  >
                    {{ $t("advancedsearch.btn_clear") }}
                  </button>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-col>
        <b-col md="6" class="me-auto" style="padding-left: 0.1rem !important">
          <div class="card rounded-0" style="width: 100%; height: 100%">
            <div class="card-body no-padding">
              <div id="map" style="height: 380px; cursor: default"></div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col md="12" v-if="state.initialMessage && !state.isLoadingResults">
          <b-alert
            :model-value="true"
            variant="info"
            v-if="!!state.initialMessage"
          >
            {{ $t("advancedsearch.msg_add_criteria") }}
          </b-alert>
        </b-col>

        <b-col md="12" v-if="!state.initialMessage">
          <b-row v-if="state.isLoadingResults">
            <spinner :show="state.isLoadingResults"></spinner>
            <span class="p-2">{{ $t("messages.pageLoading") }}</span>
          </b-row>
          <div class="card rounded-0">
            <div class="card-body">
              <h1 id="results" class="pb-4" v-if="state.results">
                {{ $t("advancedsearch.results") }}: {{ state.numberOfResults }}
                {{ $t("advancedsearch.results_species") }}
              </h1>
              <div class="col-xs-12 pagination-center">
                <b-pagination
                  v-if="state.numberOfResults > paginationState.paginateBy"
                  size="sm"
                  align="end"
                  :limit="5"
                  :hide-ellipsis="true"
                  :total-rows="state.numberOfResults"
                  v-model="paginationState.page"
                  :per-page="paginationState.paginateBy"
                ></b-pagination>
              </div>
              <div
                v-for="group in state.output"
                style="padding: 5px 0 20px 0; border-top: dotted 2px #ccc"
              >
                <span>
                  <img
                    onerror="this.style.display='none'"
                    :src="'/fossilgroups/' + group.fossil_group_id + '.png'"
                    style="width: 70px"
                  />
                  <h2 style="display: inline">
                    <a
                      v-if="group.fossil_group_id"
                      :href="'/' + group.fossil_group_id"
                    >
                      {{ group.fossil_group }}
                    </a>
                    <span v-else>{{ group.fossil_group }}</span>
                  </h2>
                </span>
                <b-row
                  v-for="species in group.node"
                  style="padding-left: 1rem"
                  v-bind:key="species.taxon_id"
                >
                  <b-col sm="6">
                    <a :href="'/' + species.taxon_id">
                      <em>{{ species.taxon }}</em>
                      {{ species.author_year }}
                    </a>
                  </b-col>
                  <b-col
                    v-if="
                      species.fad && species.lad && species.fad !== species.lad
                    "
                    sm="6"
                  >
                    <span
                      v-translate="{ et: species.fad, en: species.fad_en }"
                    ></span>
                    &rarr;
                    <span
                      v-translate="{ et: species.lad, en: species.lad_en }"
                    ></span>
                  </b-col>
                  <b-col v-else-if="species.fad === species.lad" sm="6">
                    <span
                      v-translate="{ et: species.fad, en: species.fad_en }"
                    ></span>
                  </b-col>
                  <b-col v-else-if="species.fad" sm="6">
                    <span
                      v-translate="{ et: species.fad, en: species.fad_en }"
                    ></span>
                  </b-col>
                </b-row>
              </div>
              <div class="col-xs-12 pagination-center">
                <b-pagination
                  v-if="state.numberOfResults > paginationState.paginateBy"
                  size="sm"
                  align="end"
                  :limit="5"
                  :hide-ellipsis="true"
                  :total-rows="state.numberOfResults"
                  v-model="paginationState.page"
                  :per-page="paginationState.paginateBy"
                ></b-pagination>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </section>
</template>

<script setup lang="ts">
import VueMultiselect from "vue-multiselect";
import VueSlider from "~/components/vue2-slider.vue";
import { useRootStore } from "~/stores/root";
const { searchParameters } = useRootStore();
const { t, locale } = useI18n();
const { $apiFetch } = useNuxtApp();

const taxonSearchState = reactive({
  options: [],
  isLoading: false,
  value: null,
});
async function searchTaxonOptions(value) {
  if (value.length < 1) return;
  taxonSearchState.isLoading = true;
  const taxonOptionsRes = await $apiFetch(`/solr/taxon`, {
    query: {
      fq: [
        `taxon:${buildAutocompleteFilterSolrSearchValue(value)}`,
        "rank:[1 TO 13]",
      ],
      rows: "30",
      fl: "id,taxon,hierarchy_string",
      format: "json",
    },
  });
  taxonSearchState.options = taxonOptionsRes.results;
  taxonSearchState.isLoading = false;
}

const stratigraphySearchState = reactive({
  options: [],
  isLoading: false,
  value: null,
});

async function searchStratigraphyOptions(value) {
  if (value.length < 1) return;
  stratigraphySearchState.isLoading = true;
  const stratigraphyOptionsRes = await $apiFetch(`/solr/stratigraphy`, {
    query: {
      fq: [
        `stratigraphy:${buildAutocompleteFilterSolrSearchValue(
          value
        )} OR stratigraphy_en:${buildAutocompleteFilterSolrSearchValue(value)}`,
        "type:1",
      ],
      rows: "30",
      fl: "stratigraphy,stratigraphy_en,id,hierarchy_string",
      format: "json",
    },
  });
  stratigraphySearchState.options = stratigraphyOptionsRes.results;
  stratigraphySearchState.isLoading = false;
}

function buildAutocompleteFilterSolrSearchValue(value) {
  let lowerFirstCh = value.charAt(0).toLowerCase();
  let upperFirstCh = value.charAt(0).toUpperCase();
  let str = value.substring(1).toLowerCase();
  return `/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`;
}
function buildSearchFilterQuery() {
  const result = [];
  if (state.searchForm.higherTaxa) {
    result.push(
      `taxon_hierarchy:${state.searchForm.higherTaxa.hierarchy_string}*`
    );
  }
  if (state.searchForm.stratigraphy) {
    result.push(
      `stratigraphy_hierarchy:${state.searchForm.stratigraphy.hierarchy_string}* OR global_stratigraphy_hierarchy:${state.searchForm.stratigraphy.hierarchy_string}*`
    );
  }
  if (state.searchForm.speciesField) {
    result.push(
      `taxon:${buildAutocompleteFilterSolrSearchValue(
        state.searchForm.speciesField
      )}`
    );
  }
  if (state.searchForm.authorField) {
    result.push(
      `author_year:${buildAutocompleteFilterSolrSearchValue(
        state.searchForm.authorField
      )}`
    );
  }
  if (state.searchForm.localityField) {
    result.push(
      `locality:${buildAutocompleteFilterSolrSearchValue(
        state.searchForm.localityField
      )} OR locality_en:${buildAutocompleteFilterSolrSearchValue(
        state.searchForm.localityField
      )}`
    );
  }
  if (state.searchForm.isSubsurface) {
    result.push("-locality:*puurauk");
  }
  return result;
}
function getFilterQueryForWKT(polygon: string) {
  let coordsPairs = polygon.split(","),
    reversedPairs = [];

  // second and fourth pairs' places are changed because solr getting error
  let firstLatCoord = coordsPairs[0].replace("POLYGON((", "").split(" ")[0];
  let secondLatCoord = coordsPairs[1].split(" ")[0];

  if (parseFloat(firstLatCoord) <= parseFloat(secondLatCoord)) {
    let coordsPairs_ = coordsPairs.slice(1, coordsPairs.length - 1);
    reversedPairs.push(coordsPairs[0]);
    reversedPairs = reversedPairs.concat(coordsPairs_.reverse());
    reversedPairs.push(coordsPairs[coordsPairs.length - 1]);
  }

  let changedWkt =
    reversedPairs.length > 0 ? reversedPairs.join(",") : coordsPairs.join(",");
  return `{!field f--latlong}isWithin(${changedWkt})`;
}

function getFilterQueryForCircle(circle) {
  var latlng = circle.getLatLng();
  var radius = Math.round((circle.getRadius() / 1000) * 10) / 10; // convert to km (from m) and round to 1 decmial place
  return `{!geofilt sfield=latlong}&d=${radius}&pt=${latlng.lat},${latlng.lng}`;
}
const paginationState = reactive({
  paginateBy: 100,
  page: 1,
  mapDataPaginateBy: 1000,
});

async function search() {
  let fl = `taxon,id,author_year,fossil_group,fossil_group_id,fad,fad_en,fad_id,lad,lad_en,lad_id,locality_en,locality_id,locality,latlong,src`;
  const fq = [
    ...buildSearchFilterQuery(),
    "{!collapse field--taxon}",
    "rank:[14 TO 17]",
  ];
  if (state.searchForm.geoparams) {
    fq.push(state.searchForm.geoparams);
  }
  const res = await $apiFetch(`solr/taxon_search`, {
    query: {
      fl,
      fq,
      sort: "fossil_group asc,taxon asc",
      rows: paginationState.paginateBy,
      start: paginationState.paginateBy * (paginationState.page - 1),
      format: "json",
    },
  });
  state.results = res.results;
  state.numberOfResults = res.count;
  resultsHandling();

  fetchMapData();
}
async function fetchMapData() {
  let start = [paginationState.paginateBy * (paginationState.page - 1)];
  let collapse = `{!collapse field--locality}`;
  let fl = `locality_en,locality_id,locality,latlong,src`;
  const fq = [
    ...buildSearchFilterQuery(),
    "{!collapse field--taxon}",
    "rank:[14 TO 17]",
  ];
  if (state.searchForm.geoparams) {
    fq.push(state.searchForm.geoparams);
  }
  const res = await $apiFetch(`solr/taxon_search`, {
    query: {
      fl,
      sort: "fossil_group asc,taxon asc",
      fq,
      rows: paginationState.mapDataPaginateBy,
      start,
      format: "json",
    },
  });
  state.mapDataResult = res.results;

  for (const i = 0; i < layers.length; i++) {
    layers[i].clearLayers();
  }

  resetLayers();
  getLocationsObject(state.mapDataResult);
  initLayers();
  checkAllLayers();
}

const state = reactive({
  query: "",
  searchForm: setSearchParams(),
  initialMessage: true,
  errorMessage: null,
  output: {},
  map: null,
  tileLayer: null,
  circle: null,
  drawControls: null,
  drawnItems: null,
  layer: null,
  searchResults: [],
  isLoadingResults: false,
  isHigherTaxaLoading: false,
  isLocLoading: false,
  isStratLoading: false,
  results: [],
  mapDataResult: [],
  numberOfResults: 0,
  isPopupQueryTriggered: false,
  openPopup: null,
});
const map = ref();
const { layers, initLayers, resetLayers, checkAllLayers, getLocationsObject } =
  useLeafletMap(map);

onMounted(() => {
  initialiseMap();
});

watch(() => paginationState.page, search);
watch(
  () => state.searchForm.isNearMeSearch,
  () => {
    if (state.searchForm.isNearMeSearch === true) {
      state.searchForm.isSubsurface = true;
      getLocation();
    } else {
      state.circle.remove();
      map.value.closePopup();
      state.searchForm.nearMeArea = false;
      state.searchForm.geoparams = null;
      state.searchForm.nearMeArea = null;
      state.searchForm.radius = 5;
      state.searchForm.latlng = null;
    }
  }
);
watch(
  () => state.searchForm.radius,
  () => {
    if (state.searchForm.isNearMeSearch === false) return;
    state.searchForm.nearMeArea = getParamsForCircle(state.circle);
    state.searchForm.nearMeArea = getFilterQueryForCircle(state.circle);
    drawAreaNearMe();
    map.value.setView(
      [state.searchForm.latlng.lat, state.searchForm.latlng.lng],
      12 - state.searchForm.radius * 0.15
    );
  },
  { deep: true }
);

async function getSpeciesCountInArea(geomParams, speciesID) {
  const res = await $apiFetch(`solr/taxon_search`, {
    query: {
      fl: "taxon",
      sort: "fossil_group asc,taxon asc",
      fq: [
        ...buildSearchFilterQuery(),
        geomParams,
        "{!collapse field=locality}",
        "rank:[14 TO 17]",
      ],
      rows: 1,
      format: "json",
    },
  });
  console.log("species element: ", document.getElementById(speciesID));

  if (document.getElementById(speciesID) !== null) {
    document.getElementById(speciesID).innerHTML = res.count ? res.count : 0;
  }
}
async function getOccurrenceCountInArea(geomParams, occurrenceID) {
  const res = await $apiFetch(`solr/taxon_search`, {
    query: {
      fl: "taxon",
      sort: "fossil_group asc,taxon asc",
      fq: [
        ...buildSearchFilterQuery(),
        geomParams,
        "{!collapse field=taxon}",
        "rank:[14 TO 17]",
      ],
      rows: 1,
      format: "json",
    },
  });

  if (document.getElementById(occurrenceID) !== null) {
    document.getElementById(occurrenceID).innerHTML = res.count ? res.count : 0;
  }
}
function showRecordsInSelectedArea(layer, geomParams) {
  resetDrawnItemsColor();
  layer.setStyle({ color: "#ff2a12" });
  state.searchForm.geoparams = geomParams;
}
function generatePopup(layer, latlng, query, map) {
  var geomParams = "";
  if (typeof layer.getRadius === "function") {
    // circle
    geomParams = getFilterQueryForCircle(layer, query);
  } else {
    var wkt = new Wkt.Wkt();
    var geojson = layer.toGeoJSON();
    var geostr = JSON.stringify(geojson);

    wkt.read(geostr);

    geomParams = getFilterQueryForWKT(wkt.write(), query);
  }

  state.searchForm.geoparams = geomParams;

  // map.closePopup();
  if (typeof layer.getLatLng === "function") {
    latlng = layer.getLatLng();
    if (
      map._popup !== null &&
      state.openPopup !== null &&
      layer &&
      state.openPopup.getLatLng().lat.toFixed(2) ===
        layer.getLatLng().lat.toFixed(2) &&
      state.openPopup.getLatLng().lng.toFixed(2) ===
        layer.getLatLng().lng.toFixed(2)
    ) {
      layer.off("click", state.openPopup);
      return;
    }
  }

  if (map._popup) {
    map.closePopup(state.openPopup);
    if (map._popup !== null) latlng = layer.getBounds().getCenter();
    return;
    // if(map._popup.getLatLng()  &&  map._popup.getLatLng().lat === latlng.lat && map._popup.getLatLng().lng === latlng.lng)
  } else {
    latlng = layer.getBounds().getCenter();
  }

  var coordsStr = latlng.lat + "-" + latlng.lng;
  var speciesID = "speciesCount-" + coordsStr;
  var occurrenceID = "occurrenceCount-" + coordsStr;
  let numberOfDrawnLayers = Object.keys(state.drawnItems._layers).length;

  let content = `${t(
    "advancedsearch.js_map_popup_localitycount"
  )}: <b id="${speciesID}">${t("advancedsearch.calculating")}</b>
    <br />
    ${t(
      "advancedsearch.js_map_popup_speciescount"
    )}: <b id="${occurrenceID}">${t("advancedsearch.calculating")}</b>`;

  if (numberOfDrawnLayers > 1) {
    content += `<br />
      <a id="showOnlyTheseRecords" href="#map" onclick="return;">
        <span class="fa fa-search"></span>
        ${t("advancedsearch.js_map_popup_linkText")}
      </a>`;
  }
  getSpeciesCountInArea(geomParams, speciesID);
  getOccurrenceCountInArea(geomParams, occurrenceID);

  state.openPopup = L.popup({
    closeOnClick: false,
    autoClose: false,
  })
    .setLatLng(latlng)
    .setContent(content)
    .openOn(map);

  $("#showOnlyTheseRecords").on("click", function (event) {
    map.closePopup(state.openPopup);
    showRecordsInSelectedArea(layer, geomParams);
  });

  if (numberOfDrawnLayers === 1) {
    showRecordsInSelectedArea(layer, geomParams);
  }
}
function removeDrawnItems() {
  map.value.closePopup();
  map.value.eachLayer(function (layer) {
    if (layer.options.hasOwnProperty("stroke")) {
      map.value.removeLayer(layer);
    }
  });

  Object.keys(state.drawnItems._layers).forEach(function (el) {
    delete state.drawnItems._layers[el];
  });
}
function resetDrawnItemsColor() {
  map.value.eachLayer(function (layer) {
    if (layer.options.hasOwnProperty("stroke")) {
      layer.setStyle({ color: "#bada55" });
    }
  });
}
function getParamsForWKT(wkt) {
  let coordsPairs = wkt.split(","),
    reversedPairs = [];
  // second and fourth pairs' places are changed because solr getting error
  let firstLatCoord = coordsPairs[0].replace("POLYGON((", "").split(" ")[0];
  let secondLatCoord = coordsPairs[1].split(" ")[0];

  if (parseFloat(firstLatCoord) <= parseFloat(secondLatCoord)) {
    let coordsPairs_ = coordsPairs.slice(1, coordsPairs.length - 1);
    reversedPairs.push(coordsPairs[0]);
    reversedPairs = reversedPairs.concat(coordsPairs_.reverse());
    reversedPairs.push(coordsPairs[coordsPairs.length - 1]);
  }

  let changedWkt =
    reversedPairs.length > 0 ? reversedPairs.join(",") : coordsPairs.join(",");
  return `fq=%7B%21field%20f--latlong%7DisWithin(${changedWkt})`;
}

function getParamsForCircle(circle) {
  var latlng = circle.getLatLng();
  var radius = Math.round((circle.getRadius() / 1000) * 10) / 10; // convert to km (from m) and round to 1 decmial place
  return `fq=%7B%21geofilt%7D&d=${radius}&pt=${latlng.lat},${latlng.lng}&sfield=latlong`;
}

function getBaseLayers() {
  // Google map layers
  state.tileLayer = L.tileLayer(
    "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, imagery &copy; <a href="https://carto.com/attribution">CartoDB</a>',
      subdomains: "abcd",
      mapid: "",
      token: "",
    }
  );
  //     L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w',
  //     {
  //         minZoom: 4,
  //         maxZoom: 18,
  //         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //     }
  // );
  //     L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, imagery &copy; <a href="https://carto.com/attribution">CartoDB</a>',
  //     subdomains: 'abcd',
  //     mapid: '',
  //     token: ''
  // });
  // var roadLayer = L.gridLayer.googleMutant({ type: 'roadmap' });
  // var terrainLayer = L.gridLayer.googleMutan type: 'terrain' });
  // var hybridLayer = L.gridLayer.googleMutant({ type: 'satellite' });
  // var blackWhiteLayer = new L.StamenTileLayer('toner');

  var baseLayers = {};
  baseLayers[t("advancedsearch.js_map_layers_Minimal")] = state.tileLayer;
  // baseLayers[this.$t('advancedsearch.js.map.layers.Road')] = roadLayer;
  // baseLayers[this.$t('advancedsearch.js.map.layers.Terrain')] = terrainLayer;
  // baseLayers[this.$t('advancedsearch.js.map.layers.Satellite')] = hybridLayer;
  // baseLayers[this.$t('advancedsearch.js.map.layers.BlackWhite')] = blackWhiteLayer;

  return baseLayers;
}
function getStoredMapLayer() {
  var storedLayerName;
  try {
    storedLayerName = localStorage.getItem("defaultMapLayer");
  } catch (e) {
    // localStorage not available
    storedLayerName = t("advancedsearch.js_map_layers_Minimal");
  }
  return storedLayerName;
}
function initialiseMap() {
  // document.getElementById("map").style.cursor = "default";
  // initialise map
  map.value = L.map("map", {
    // fullscreenControl: true,
    // fullscreenControlOptions: {
    //     position: 'topleft'
    // },
    zoomControl: false,
    minZoom: 1,
    scrollWheelZoom: true,
  });
  map.value.setView([0, 0], 0);
  drawI18N();
  L.control
    .zoom({
      position: "topleft",
      zoomInTitle: t("advancedsearch.js_map_zoomin"),
      zoomOutTitle: t("advancedsearch.js_map_zoomout"),
    })
    .addTo(map.value);

  // add edit drawing toolbar
  // Initialise the FeatureGroup to store editable layers
  state.drawnItems = new L.FeatureGroup();
  map.value.addLayer(state.drawnItems);

  // Initialise the draw control and pass it the FeatureGroup of editable layers
  state.drawControls = new L.Control.Draw({
    // edit: {
    //     featureGroup: MAP_VAR.drawnItems
    // },
    draw: {
      circlemarker: false,
      marker: false,
      polyline: false,
      rectangle: {
        shapeOptions: {
          color: "#bada55",
        },
      },
      circle: {
        shapeOptions: {
          color: "#bada55",
        },
      },
      polygon: {
        allowIntersection: false, // Restricts shapes to simple polygons
        drawError: {
          color: "#e1e100", // Color the shape will turn when intersects
          message: "<strong>Oh snap!<strong> you can't draw that!", // Message that will show when intersect
        },
        shapeOptions: {
          color: "#bada55",
        },
      },
    },
  });

  map.value.addControl(state.drawControls);

  map.value.on("draw:created", (e) => {
    var layer = e.layer;

    var center =
      typeof layer.getLatLng === "function"
        ? layer.getLatLng()
        : layer.getBounds().getCenter();

    layer.on("click", function (e) {
      generatePopup(layer, e.latlng, state.query, map.value);
    });

    state.drawnItems.addLayer(layer);

    if (state.isPopupQueryTriggered === false) {
      layer.fireEvent("click");
    }
  });

  map.value.on("draw:edited", (e) => {
    var layers = e.layers;

    layers.eachLayer(function (layer) {
      generatePopup(layer, layer._latlng, state.query, map.value);
    });
  });

  var baseLayers = getBaseLayers();

  // add the default base layer
  var storedLayerName = getStoredMapLayer();

  var defaultLayerName;
  if (storedLayerName in baseLayers) {
    defaultLayerName = storedLayerName;
  } else {
    defaultLayerName = t("advancedsearch.js_map_layers_Minimal");
  }

  var defaultBaseLayer = baseLayers[defaultLayerName];
  map.value.addLayer(defaultBaseLayer);

  L.control
    .coordinates({ position: "bottomright", useLatLngOrder: true })
    .addTo(map.value); // coordinate plugin
  L.Util.requestAnimFrame(
    map.value.invalidateSize,
    map.value,
    !1,
    map.value._container
  );
}
// /**
//          Translations for leaflet-draw library
//          */
function drawI18N() {
  L.Control.Fullscreen.title = t("advancedsearch.draw_actions_title");
  L.drawLocal.draw.toolbar.actions.title = t(
    "advancedsearch.draw_actions_title"
  );
  L.drawLocal.draw.toolbar.actions.text = t("advancedsearch.draw_actions_text");
  L.drawLocal.draw.toolbar.finish.title = t("advancedsearch.draw_finish_title");
  L.drawLocal.draw.toolbar.finish.text = t("advancedsearch.draw_finish_text");
  L.drawLocal.draw.toolbar.undo.title = t("advancedsearch.draw_undo_title");
  L.drawLocal.draw.toolbar.undo.text = t("advancedsearch.draw_undo_text");
  L.drawLocal.draw.toolbar.buttons.polygon = t(
    "advancedsearch.draw_buttons_polygon"
  );
  L.drawLocal.draw.toolbar.buttons.rectangle = t(
    "advancedsearch.draw_buttons_rectangle"
  );
  L.drawLocal.draw.toolbar.buttons.circle = t(
    "advancedsearch.draw_buttons_circle"
  );
  L.drawLocal.draw.handlers.polygon.tooltip.start = t(
    "advancedsearch.draw_polygon_tooltip_start"
  );
  L.drawLocal.draw.handlers.polygon.tooltip.cont = t(
    "advancedsearch.draw_polygon_tooltip_cont"
  );
  L.drawLocal.draw.handlers.polygon.tooltip.end = t(
    "advancedsearch.draw_polygon_tooltip_end"
  );
  L.drawLocal.draw.handlers.rectangle.tooltip.start = t(
    "advancedsearch.draw_rectangle_tooltip_start"
  );
  L.drawLocal.draw.handlers.simpleshape.tooltip.end = t(
    "advancedsearch.draw_simpleshape_tooltip_end"
  );
  L.drawLocal.draw.handlers.circle.tooltip.start = t(
    "advancedsearch.draw_circle_tooltip_start"
  );
  L.drawLocal.draw.handlers.circle.radius = t(
    "advancedsearch.draw_circle_radius"
  );
  L.drawLocal.edit.toolbar.buttons.edit = t(
    "advancedsearch.draw_edit_toolbar_buttons_edit"
  );
  L.drawLocal.edit.toolbar.actions.save.text = t(
    "advancedsearch.draw_edit_toolbar_actions_save_text"
  );
  L.drawLocal.edit.toolbar.actions.save.title = t(
    "advancedsearch.draw_edit_toolbar_actions_save_title"
  );
  L.drawLocal.edit.toolbar.actions.cancel.title = t(
    "advancedsearch.draw_edit_toolbar_actions_cancel_title"
  );
  L.drawLocal.edit.toolbar.actions.cancel.text = t(
    "advancedsearch.draw_edit_toolbar_actions_cancel_text"
  );
  L.drawLocal.edit.handlers.edit.tooltip.text = t(
    "advancedsearch.draw_edit_handlers_edit_tooltip_text"
  );
  L.drawLocal.edit.handlers.edit.tooltip.subtext = t(
    "advancedsearch.draw_edit_handlers_edit_tooltip_subtext"
  );
  // L.drawLocal.edit.toolbar.buttons.remove.remove = t('advancedsearch.draw_edit_toolbar_buttons_remove_remove');
  L.drawLocal.edit.toolbar.actions.clearAll.text = t(
    "advancedsearch.draw_edit_toolbar_actions_clearAll_text"
  );
  L.drawLocal.edit.toolbar.actions.clearAll.title = t(
    "advancedsearch.draw_edit_toolbar_actions_clearAll_title"
  );
  L.drawLocal.edit.handlers.remove.tooltip.text = t(
    "advancedsearch.draw_edit_handlers_remove_tooltip_text"
  );
}
//
// Stratigraphy search
function displayStratigraphyResults(item) {
  return locale.value === "et"
    ? `${item.stratigraphy}`
    : `${item.stratigraphy_en}`;
}
function setSearchParams() {
  return {
    higherTaxa: null,
    speciesField: null,
    authorField: null,
    localityField: null,
    freeTextLocality: null,
    stratigraphy: null,
    isSubsurface: false,
    isNearMeSearch: false,
    geoparams: null,
    nearMeArea: null,
    radius: 5,
    latlng: null,
  };
}
function clearSearch() {
  // state.searchForm = setSearchParams();
  Object.assign(state.searchForm, setSearchParams());
  resetLayers();
  removeDrawnItems();
  state.initialMessage = true;
  state.output = {};
  state.results = null;
}

function resultsHandling() {
  state.initialMessage = false;
  state.isLoadingResults = false;
  let output = {},
    fossilGroupOrder = [];

  for (const taxon of state.results) {
    if (taxon.fossil_group_id === undefined)
      taxon.fossil_group = locale.value === "et" ? "Määramata" : "None";
    if (output[taxon.fossil_group_id] === undefined) {
      output[taxon.fossil_group_id] = {
        fossil_group_id: taxon.fossil_group_id,
        fossil_group: taxon.fossil_group,
        node: [],
      };
      fossilGroupOrder.push(taxon.fossil_group_id);
    }
    output[taxon.fossil_group_id].node.push({
      taxon: taxon.taxon,
      taxon_id: taxon.taxon_id,
      author_year: taxon.author_year,
      fad: taxon.fad,
      fad_en: taxon.fad_en,
      lad: taxon.lad,
      lad_en: taxon.lad_en,
    });
  }

  state.output = Object.values(output);
}

function getLocation() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    function (position) {
      let geoparams = {
        getRadius() {
          return state.searchForm.radius * 1000;
        },
        getLatLng() {
          return {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        },
      };
      state.searchForm.latlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      state.searchForm.nearMeArea = getParamsForCircle(geoparams);
      drawAreaNearMe();
      map.value.setView(
        [state.searchForm.latlng.lat, state.searchForm.latlng.lng],
        12 - state.searchForm.radius * 0.15
      );

      // this_.applySearch();
    },
    function (error) {
      if (error.code == error.PERMISSION_DENIED)
        state.errorMessage = "Geolocation is not supported by this browser.";
    }
  );
}
function drawAreaNearMe() {
  state.type = "circle";

  if (state.circle !== null) {
    state.circle.remove();
    map.value.closePopup();
    delete state.drawnItems._layers[state.circle._leaflet_id];
  }

  state.circle = new L.Circle(
    state.searchForm.latlng,
    state.searchForm.radius * 1000,
    state.drawControls.options.draw.circle.shapeOptions
  );
  state.circle.on("add", ({ layer }) => {
    generatePopup(state.circle, [0, 0], null, map.value);
  });
  state.circle.addTo(map.value);
}
</script>
