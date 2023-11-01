<template>
  <section class="container-fluid">
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
                <b-col
                  v-if="state.searchForm.isNearMeSearch"
                  sm="8"
                  class="pt-2"
                >
                  <VueSlider
                    ref="slider"
                    :min="0"
                    :max="20"
                    :piecewiseLabel="true"
                    width="100%"
                    :show="state.searchForm.isNearMeSearch"
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
                  </VueSlider>
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
              <div
                id="map"
                ref="map"
                style="height: 380px; cursor: default"
              ></div>
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
            <BSpinner variant="warning" style="width: 44px; height: 44px" />
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
// @ts-ignore
import Wkt from "wicket/wicket";
import type {
  FeatureGroup,
  LeafletMouseEvent,
  CircleMarker,
  TileLayer,
  Circle,
  Polygon,
  Rectangle,
  LatLngExpression,
  Map,
} from "leaflet";
const { t, locale } = useI18n();
const { $apiFetch, $L } = useNuxtApp();

type TaxonOption = {
  id: number;
  taxon?: string;
  hierarchy_string?: string;
};

const taxonSearchState = reactive({
  options: [] as TaxonOption[],
  isLoading: false,
});

async function searchTaxonOptions(value: string) {
  if (value.length < 1) return;
  taxonSearchState.isLoading = true;
  const taxonOptionsRes = await $apiFetch<{ results: TaxonOption[] }>(
    `/solr/taxon`,
    {
      query: {
        fq: [
          `taxon:${buildAutocompleteFilterSolrSearchValue(value)}`,
          "rank:[1 TO 13]",
        ],
        rows: "30",
        fl: "id,taxon,hierarchy_string",
        format: "json",
      },
    }
  );
  taxonSearchState.options = taxonOptionsRes.results;
  taxonSearchState.isLoading = false;
}

type StratigraphyOption = {
  id: number;
  stratigraphy?: string;
  stratigraphy_en?: string;
  hierarchy_string?: string;
};

const stratigraphySearchState = reactive({
  options: [] as StratigraphyOption[],
  isLoading: false,
  value: null,
});

async function searchStratigraphyOptions(value: string) {
  if (value.length < 1) return;
  stratigraphySearchState.isLoading = true;
  const stratigraphyOptionsRes = await $apiFetch<{
    results: StratigraphyOption[];
  }>(`/solr/stratigraphy`, {
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

function buildAutocompleteFilterSolrSearchValue(value: string) {
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
    reversedPairs = [] as string[];

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

function getFilterQueryForCircle(circle: Circle) {
  var latlng = circle.getLatLng();
  var radius = Math.round((circle.getRadius() / 1000) * 10) / 10; // convert to km (from m) and round to 1 decmial place
  return `{!geofilt sfield=latlong}&d=${radius}&pt=${latlng.lat},${latlng.lng}`;
}
const paginationState = reactive({
  paginateBy: 100,
  page: 1,
  mapDataPaginateBy: 1000,
});

type SearchResult = {
  id: number;
  taxon?: string;
  author_year?: string;
  fossil_group?: string;
  fossil_group_id?: number;
  fad?: string;
  fad_en?: string;
  fad_id?: number;
  lad?: string;
  lad_en?: string;
  lad_id?: number;
  locality_en?: string;
  locality_id?: number;
  locality?: string;
  latlong?: string;
  src?: number;
};

async function search() {
  let fl = `taxon,id,author_year,fossil_group,fossil_group_id,fad,fad_en,fad_id,lad,lad_en,lad_id,locality_en,locality_id,locality,latlong,src`;
  const fq = [
    ...buildSearchFilterQuery(),
    "{!collapse field--taxon}",
    "rank:[14 TO 17]",
  ];
  if (state.searchForm.isNearMeSearch) {
    const nearMeArea = getFilterQueryForCircle(state.circle as Circle);
    fq.push(nearMeArea);
  } else if (state.searchForm.selectedArea) {
    fq.push(
      getGeoParam(state.searchForm.selectedArea as Circle | Rectangle | Polygon)
    );
  }
  const res = await $apiFetch<{ results: SearchResult[]; count: number }>(
    `solr/taxon_search`,
    {
      query: {
        fl,
        fq,
        sort: "fossil_group asc,taxon asc",
        rows: paginationState.paginateBy,
        start: paginationState.paginateBy * (paginationState.page - 1),
        format: "json",
      },
    }
  );
  state.results = res.results;
  state.numberOfResults = res.count;

  resultsHandling();
  fetchMapData();
}
type MapSearchResult = {
  locality_id?: number;
  locality_en?: string;
  locality?: string;
  latlong?: string;
  src?: number;
};

async function fetchMapData() {
  if (!map.value) return;
  let start = [paginationState.paginateBy * (paginationState.page - 1)];
  let fl = `locality_en,locality_id,locality,latlong,src`;
  const fq = [
    ...buildSearchFilterQuery(),
    "{!collapse field--taxon}",
    "rank:[14 TO 17]",
  ];
  if (state.searchForm.isNearMeSearch) {
    const nearMeArea = getFilterQueryForCircle(state.circle as Circle);
    fq.push(nearMeArea);
  } else if (state.searchForm.selectedArea) {
    fq.push(
      getGeoParam(state.searchForm.selectedArea as Circle | Rectangle | Polygon)
    );
  }
  const res = await $apiFetch<{ results: MapSearchResult[]; count: number }>(
    `solr/taxon_search`,
    {
      query: {
        fl,
        sort: "fossil_group asc,taxon asc",
        fq,
        rows: paginationState.mapDataPaginateBy,
        start,
        format: "json",
      },
    }
  );
  state.mapDataResult = res.results;

  if (!groupsInitialized.value) {
    initGroups();
    // @ts-ignore
    $L.control.groupedLayers({}, groupedOverlays.value, {}).addTo(map.value);
    setDefaultOverlays();
  }

  resetLayerGroups();
  populateLayerGroups(state.mapDataResult);
}

const state = reactive({
  searchForm: setSearchParams(),
  initialMessage: true,
  errorMessage: null as string | null,
  output: {} as {
    [id: number]: {
      fossil_group_id: number;
      fossil_group: string;
      node: any[];
    };
  },
  tileLayer: null as TileLayer | null,
  circle: null as CircleMarker<any> | null,
  drawnItems: null as FeatureGroup | null,
  isLoadingResults: false,
  results: [] as SearchResult[],
  mapDataResult: [] as MapSearchResult[],
  numberOfResults: 0,
});

const map = ref<Map>();
const {
  populateLayerGroups,
  initGroups,
  groupedOverlays,
  setDefaultOverlays,
  groupsInitialized,
  resetLayerGroups,
} = useLeafletMap(map);

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
      state.circle?.remove();
      map.value?.closePopup();
      state.searchForm.radius = 5;
      state.searchForm.latlng = null;
    }
  }
);
watch(
  () => state.searchForm.radius,
  () => {
    if (state.searchForm.isNearMeSearch === false) return;
    drawAreaNearMe();
    if (!state.searchForm.latlng) return;
    map.value?.setView(
      [state.searchForm.latlng.lat, state.searchForm.latlng.lng],
      12 - state.searchForm.radius * 0.15
    );
  },
  { deep: true }
);

function showRecordsInSelectedArea(layer: Circle | Rectangle | Polygon) {
  resetDrawnItemsColor();
  layer.setStyle({ color: "#ff2a12" });
  state.searchForm.selectedArea = layer;
}
function generatePopup(
  layer: Circle | Polygon | Rectangle,
  latlng: LatLngExpression,
  map: Map
) {
  buildPopupContent(layer).then((content) => {
    map.closePopup();
    const popup = $L
      .popup({
        closeOnClick: false,
        autoClose: false,
      })
      .setLatLng(latlng)
      .setContent(content);

    layer.bindPopup(popup);
    layer.openPopup();
  });
}

async function buildPopupContent(layer: Circle | Rectangle | Polygon) {
  const geomParams = getGeoParam(layer);
  const localityRes = await $apiFetch<{ count: number }>(`solr/taxon_search`, {
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
  const taxonRes = await $apiFetch<{ count: number }>(`solr/taxon_search`, {
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

  const numberOfDrawnLayers = state.drawnItems?.getLayers().length ?? 0;
  const rootDiv = document.createElement("div");
  const localityCountDiv = document.createElement("div");
  localityCountDiv.innerHTML = `${t(
    "advancedsearch.js_map_popup_localitycount"
  )}: <b>${localityRes.count}</b>`;

  const speciesCountDiv = document.createElement("div");
  speciesCountDiv.innerHTML = `${t(
    "advancedsearch.js_map_popup_speciescount"
  )}: <b>${taxonRes.count}</b>`;

  rootDiv.append(localityCountDiv, speciesCountDiv);

  if (numberOfDrawnLayers > 1) {
    const button = document.createElement("button");
    button.innerHTML = `
        <span class="fa fa-search"></span>
        ${t("advancedsearch.js_map_popup_linkText")}
`;
    button.onclick = () => {
      map.value?.closePopup();
      showRecordsInSelectedArea(layer);
    };
    rootDiv.append(button);
  }

  return rootDiv;
}

function resetDrawnItemsColor() {
  state.drawnItems?.setStyle({ color: "#bada55" });
}

function getBaseLayers() {
  // Google map layers
  return $L.tileLayer(
    "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, imagery &copy; <a href="https://carto.com/attribution">CartoDB</a>',
      subdomains: "abcd",
    }
  );
}

function initialiseMap() {
  map.value = $L.map("map", {
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: "topleft",
    },
    zoomControl: false,
    minZoom: 1,
    scrollWheelZoom: true,
  });
  map.value.setView([0, 0], 0);
  $L.control
    .zoom({
      position: "topleft",
      zoomInTitle: t("advancedsearch.js_map_zoomin"),
      zoomOutTitle: t("advancedsearch.js_map_zoomout"),
    })
    .addTo(map.value);

  // Initialise the FeatureGroup to store editable layers
  state.drawnItems = $L.featureGroup();
  map.value.addLayer(state.drawnItems as FeatureGroup);

  // Initialise Leaflet-Geoman
  map.value.pm.addControls({
    position: "topleft",
    drawCircleMarker: false,
    drawMarker: false,
    drawPolyline: false,
    drawText: false,
    editControls: false,
  });
  map.value.pm.setGlobalOptions({
    allowSelfIntersection: false,
    snappable: false,
  });
  map.value.pm.setPathOptions({
    color: "#bada55",
  });

  map.value.on("pm:create", ({ layer }) => {
    if (!map.value) return;
    state.drawnItems?.addLayer(layer);
    generatePopup(layer as Circle | Rectangle | Polygon, [0, 0], map.value);
    layer.on("click", function (e: LeafletMouseEvent) {
      map.value?.closePopup();

      buildPopupContent(e.target).then((content) => {
        const latlng = e.target.getBounds().getCenter();
        e.target.getPopup().setLatLng(latlng);
        e.target.setPopupContent(content);
      });
    });
    layer.openPopup();
    const numberOfDrawnLayers = state.drawnItems?.getLayers().length ?? 0;

    if (numberOfDrawnLayers < 2) {
      showRecordsInSelectedArea(layer as Circle | Rectangle | Polygon);
    }
  });

  state.tileLayer = getBaseLayers();
  map.value.addLayer(state.tileLayer as TileLayer);

  $L.control
    // @ts-ignore
    .coordinates({
      position: "bottomright",
      useLatLngOrder: true,
      enableUserInput: false,
    })
    .addTo(map.value);
}
function getGeoParam(shape: Circle | Rectangle | Polygon) {
  if ("getRadius" in shape) {
    return getFilterQueryForCircle(shape);
  } else {
    var wkt = new Wkt.Wkt();
    var geojson = shape.toGeoJSON();
    var geostr = JSON.stringify(geojson);

    wkt.read(geostr);

    return getFilterQueryForWKT(wkt.write());
  }
}

function displayStratigraphyResults(item: StratigraphyOption) {
  return locale.value === "et"
    ? `${item.stratigraphy}`
    : `${item.stratigraphy_en}`;
}
function setSearchParams() {
  return {
    higherTaxa: null as TaxonOption | null,
    speciesField: null,
    authorField: null,
    localityField: null,
    freeTextLocality: null,
    stratigraphy: null as StratigraphyOption | null,
    isSubsurface: false,
    isNearMeSearch: false,
    selectedArea: null as Circle | Rectangle | Polygon | null,
    radius: 5,
    latlng: null as { lat: number; lng: number } | null,
  };
}
function clearSearch() {
  state.searchForm = setSearchParams();
  resetLayerGroups();
  state.drawnItems?.clearLayers();
  state.initialMessage = true;
  state.output = {};
  state.results = [];
}

function resultsHandling() {
  state.initialMessage = false;
  state.isLoadingResults = false;
  let output: {
    [id: number]: {
      fossil_group_id: number;
      fossil_group: string;
      node: any[];
    };
  } = {};

  for (const taxon of state.results) {
    if (taxon.fossil_group_id === undefined) {
      taxon.fossil_group_id = -1;
    }
    if (taxon.fossil_group === undefined) {
      taxon.fossil_group = locale.value === "et" ? "Määramata" : "None";
    }
    if (output[taxon.fossil_group_id] === undefined) {
      output[taxon.fossil_group_id] = {
        fossil_group_id: taxon.fossil_group_id,
        fossil_group: taxon.fossil_group,
        node: [],
      };
    }
    output[taxon.fossil_group_id].node.push({
      taxon: taxon.taxon,
      taxon_id: taxon.id,
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
      if (!map.value) return;

      state.searchForm.latlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
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
  if (!map.value) return;

  if (state.circle !== null) {
    state.circle.remove();
    map.value.closePopup();
  }
  if (!state.searchForm.latlng) return;

  state.circle = $L.circle(state.searchForm.latlng, {
    color: "#bada55",
    radius: state.searchForm.radius * 1000,
    dashArray: "4",
  });
  state.circle.on("add", ({ target }) => {
    if (!map.value) return;
    generatePopup(target, target._latlng, map.value);
  });
  state.circle.addTo(map.value);
}
</script>
