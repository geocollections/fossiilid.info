<script setup lang="ts">
// @ts-expect-error no types for this package
import Wkt from "wicket/wicket";
import type {
  Circle,
  CircleMarker,
  FeatureGroup,
  LatLngExpression,
  LeafletMouseEvent,
  Map,
  Polygon,
  Rectangle,
  TileLayer,
} from "leaflet";

const { t, locale } = useI18n();
const { $apiFetch, $solrFetch, $L } = useNuxtApp();
const stateRoute = useStateRoute();
const localePath = useLocalePath();

const searchFormState = reactive({
  higherTaxon: undefined as TaxonOption | undefined,
  species: "",
  author: "",
  locality: "",
  stratigraphy: undefined as StratigraphyOption | undefined,
  isOutcrop: false,
  isNearMe: false,
  nearMeRange: 5,
  nearMeLatLng: null as { lat: number; lng: number } | null,
  selectedArea: null as Circle | Rectangle | Polygon | null,
});

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

interface TaxonOption {
  id: number;
  taxon?: string;
  hierarchy_string?: string;
}

const loadingHigherTaxaOptions = ref(false);

async function searchHigherTaxon(value: string) {
  if (value.length < 1)
    return [];
  loadingHigherTaxaOptions.value = true;
  const taxonOptionsRes = await $solrFetch<{ response: { docs: TaxonOption[] } }>(
    `/taxon`,
    {
      query: {
        q: "*",
        fq: [
          `taxon:${buildAutocompleteFilterSolrSearchValue(value)}`,
          "rank:[1 TO 13]",
        ],
        rows: "30",
        fl: "id,taxon,hierarchy_string",
        format: "json",
      },
    },
  );
  loadingHigherTaxaOptions.value = false;
  return taxonOptionsRes?.response.docs ?? [];
}

interface StratigraphyOption {
  id: number;
  stratigraphy?: string;
  stratigraphy_en?: string;
  hierarchy_string?: string;
}

const loadingStratigraphyOptions = ref(false);

async function searchStratigrahy(value: string) {
  if (value.length < 1)
    return [];
  loadingStratigraphyOptions.value = true;

  const stratigraphyOptionsRes = await $solrFetch<{
    response: { docs: StratigraphyOption[] };
  }>(`/stratigraphy`, {
    query: {
      q: "*",
      fq: [
        `stratigraphy:${buildAutocompleteFilterSolrSearchValue(
          value,
        )} OR stratigraphy_en:${buildAutocompleteFilterSolrSearchValue(value)}`,
        "type:1",
      ],
      rows: "30",
      fl: "stratigraphy,stratigraphy_en,id,hierarchy_string",
      format: "json",
    },
  });
  loadingStratigraphyOptions.value = false;
  return stratigraphyOptionsRes.response.docs ?? [];
}

function buildAutocompleteFilterSolrSearchValue(value: string) {
  const lowerFirstCh = value.charAt(0).toLowerCase();
  const upperFirstCh = value.charAt(0).toUpperCase();
  const str = value.substring(1).toLowerCase();
  return `/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`;
}
function buildSearchFilterQuery() {
  const result = [];
  if (searchFormState.higherTaxon) {
    result.push(
      `taxon_hierarchy:${searchFormState.higherTaxon.hierarchy_string}*`,
    );
  }
  if (searchFormState.stratigraphy) {
    result.push(
      `stratigraphy_hierarchy:${searchFormState.stratigraphy.hierarchy_string}* OR global_stratigraphy_hierarchy:${searchFormState.stratigraphy.hierarchy_string}*`,
    );
  }
  if (searchFormState.species) {
    result.push(
      `taxon:${buildAutocompleteFilterSolrSearchValue(
        searchFormState.species,
      )}`,
    );
  }
  if (searchFormState.author) {
    result.push(
      `author_year:${buildAutocompleteFilterSolrSearchValue(
        searchFormState.author,
      )}`,
    );
  }
  if (searchFormState.locality) {
    result.push(
      `locality:${buildAutocompleteFilterSolrSearchValue(
        searchFormState.locality,
      )} OR locality_en:${buildAutocompleteFilterSolrSearchValue(
        searchFormState.locality,
      )}`,
    );
  }
  if (searchFormState.isOutcrop)
    result.push("-locality:*puurauk");

  return result;
}
function getFilterQueryForWKT(polygon: string) {
  const coordsPairs = polygon.split(",");
  let reversedPairs = [] as string[];

  // second and fourth pairs' places are changed because solr getting error
  const firstLatCoord = coordsPairs[0].replace("POLYGON((", "").split(" ")[0];
  const secondLatCoord = coordsPairs[1].split(" ")[0];

  if (Number.parseFloat(firstLatCoord) <= Number.parseFloat(secondLatCoord)) {
    const coordsPairs_ = coordsPairs.slice(1, coordsPairs.length - 1);
    reversedPairs.push(coordsPairs[0]);
    reversedPairs = reversedPairs.concat(coordsPairs_.reverse());
    reversedPairs.push(coordsPairs[coordsPairs.length - 1]);
  }

  const changedWkt
    = reversedPairs.length > 0 ? reversedPairs.join(",") : coordsPairs.join(",");
  return `{!field f=latlong}isWithin(${changedWkt})`;
}

function getFilterQueryForCircle(circle: Circle) {
  const latlng = circle.getLatLng();
  const radius = Math.round((circle.getRadius() / 1000) * 10) / 10; // convert to km (from m) and round to 1 decmial place
  return `{!geofilt sfield=latlong}&d=${radius}&pt=${latlng.lat},${latlng.lng}`;
}
const paginationState = reactive({
  paginateBy: 100,
  page: 1,
  mapDataPaginateBy: 1000,
});

interface SearchResult {
  id: number;
  taxon?: string;
  taxon_id: number;
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
}

const map = ref<Map>();
const {
  populateLayerGroups,
  initGroups,
  groupedOverlays,
  setDefaultOverlays,
  groupsInitialized,
  resetLayerGroups,
} = useLeafletMap(map);

async function search() {
  const fl = `taxon_id,taxon,id,author_year,fossil_group,fossil_group_id,fad,fad_en,fad_id,lad,lad_en,lad_id,locality_en,locality_id,locality,latlong,src`;
  const fq = [
    ...buildSearchFilterQuery(),
    "{!collapse field=taxon}",
    "rank:[14 TO 17]",
  ];
  if (searchFormState.isNearMe) {
    const nearMeArea = getFilterQueryForCircle(state.circle as Circle);
    fq.push(nearMeArea);
  }
  else if (searchFormState.selectedArea) {
    fq.push(
      getGeoParam(searchFormState.selectedArea as Circle | Rectangle | Polygon),
    );
  }
  const res = await $solrFetch<{ response: { docs: SearchResult[]; numFound: number } }>(
    `/taxon_search`,
    {
      query: {
        q: "*",
        fl,
        fq,
        sort: "fossil_group asc,taxon asc",
        rows: paginationState.paginateBy,
        start: paginationState.paginateBy * (paginationState.page - 1),
        format: "json",
      },
    },
  );
  state.results = res.response.docs;
  state.numberOfResults = res.response.numFound;

  resultsHandling();
  fetchMapData();
}
interface MapSearchResult {
  locality_id?: number;
  locality_en?: string;
  locality?: string;
  latlong?: string;
  src?: number;
}

async function fetchMapData() {
  if (!map.value)
    return;
  const start = [paginationState.paginateBy * (paginationState.page - 1)];
  const fl = `locality_en,locality_id,locality,latlong,src`;
  const fq = [
    ...buildSearchFilterQuery(),
    "{!collapse field=taxon}",
    "rank:[14 TO 17]",
  ];
  if (searchFormState.isNearMe) {
    const nearMeArea = getFilterQueryForCircle(state.circle as Circle);
    fq.push(nearMeArea);
  }
  else if (searchFormState.selectedArea) {
    fq.push(
      getGeoParam(searchFormState.selectedArea as Circle | Rectangle | Polygon),
    );
  }
  const res = await $solrFetch<{ response: { docs: MapSearchResult[]; numFound: number } }>(
    `/taxon_search`,
    {
      query: {
        q: "*",
        fl,
        sort: "fossil_group asc,taxon asc",
        fq,
        rows: paginationState.mapDataPaginateBy,
        start,
        format: "json",
      },
    },
  );
  state.mapDataResult = res.response.docs;

  if (!groupsInitialized.value) {
    initGroups();
    // @ts-expect-error this is ok
    $L.control.groupedLayers({}, groupedOverlays.value, {}).addTo(map.value);
    setDefaultOverlays();
  }

  resetLayerGroups();
  populateLayerGroups(state.mapDataResult);
}

onMounted(() => {
  initialiseMap();
});

watch(() => paginationState.page, search);
watch(
  () => searchFormState.isNearMe,
  () => {
    if (searchFormState.isNearMe) {
      searchFormState.isOutcrop = true;
      getLocation();
    }
    else {
      state.circle?.remove();
      map.value?.closePopup();
      searchFormState.nearMeRange = 5;
      searchFormState.nearMeLatLng = null;
    }
  },
);
watch(
  () => searchFormState.nearMeRange,
  () => {
    if (!searchFormState.isNearMe)
      return;
    drawAreaNearMe();
    if (!searchFormState.nearMeLatLng)
      return;
    map.value?.setView(
      [searchFormState.nearMeLatLng.lat, searchFormState.nearMeLatLng.lng],
      12 - searchFormState.nearMeRange * 0.15,
    );
  },
  { deep: true },
);

function showRecordsInSelectedArea(layer: Circle | Rectangle | Polygon) {
  resetDrawnItemsColor();
  layer.setStyle({ color: "#ff2a12" });
  searchFormState.selectedArea = layer;
}
function generatePopup(
  layer: Circle | Polygon | Rectangle,
  latlng: LatLngExpression,
  map: Map,
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
  const localityRes = await $solrFetch<{ response: { numFound: number } }>(`/taxon_search`, {
    query: {
      q: "*",
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
  const taxonRes = await $solrFetch<{ response: { numFound: number } }>(`/taxon_search`, {
    query: {
      q: "*",
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
    "advancedsearch.js_map_popup_localitycount",
  )}: <b>${localityRes.response.numFound}</b>`;

  const speciesCountDiv = document.createElement("div");
  speciesCountDiv.innerHTML = `${t(
    "advancedsearch.js_map_popup_speciescount",
  )}: <b>${taxonRes.response.numFound}</b>`;

  rootDiv.append(localityCountDiv, speciesCountDiv);

  if (numberOfDrawnLayers > 1) {
    const button = document.createElement("button");
    button.className
      = "border flex items-center px-2 py-1 rounded bg-tomato text-white";
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
        </svg>
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
        "Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>, imagery &copy; <a href=\"https://carto.com/attribution\">CartoDB</a>",
      subdomains: "abcd",
    },
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
    if (!map.value)
      return;
    state.drawnItems?.addLayer(layer);
    generatePopup(layer as Circle | Rectangle | Polygon, [0, 0], map.value);
    layer.on("click", (e: LeafletMouseEvent) => {
      map.value?.closePopup();

      buildPopupContent(e.target).then((content) => {
        const latlng = e.target.getBounds().getCenter();
        e.target.getPopup().setLatLng(latlng);
        e.target.setPopupContent(content);
      });
    });
    layer.openPopup();
    const numberOfDrawnLayers = state.drawnItems?.getLayers().length ?? 0;

    if (numberOfDrawnLayers < 2)
      showRecordsInSelectedArea(layer as Circle | Rectangle | Polygon);
  });

  state.tileLayer = getBaseLayers();
  map.value.addLayer(state.tileLayer as TileLayer);

  $L.control
    // @ts-expect-error no types for this package
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
  }
  else {
    const wkt = new Wkt.Wkt();
    const geojson = shape.toGeoJSON();
    const geostr = JSON.stringify(geojson);

    wkt.read(geostr);

    return getFilterQueryForWKT(wkt.write());
  }
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
function resetSearchForm() {
  searchFormState.higherTaxon = undefined;
  searchFormState.species = "";
  searchFormState.author = "";
  searchFormState.locality = "";
  searchFormState.stratigraphy = undefined;
  searchFormState.isNearMe = false;
  searchFormState.isOutcrop = false;
  searchFormState.nearMeRange = 5;
  searchFormState.nearMeLatLng = null;
  searchFormState.selectedArea = null;
}

function clearSearch() {
  state.searchForm = setSearchParams();
  resetSearchForm();
  resetLayerGroups();
  state.drawnItems?.clearLayers();
  state.initialMessage = true;
  state.output = {};
  state.results = [];
}

function resultsHandling() {
  state.initialMessage = false;
  state.isLoadingResults = false;
  const output: {
    [id: number]: {
      fossil_group_id: number;
      fossil_group: string;
      node: any[];
    };
  } = {};

  for (const taxon of state.results) {
    if (taxon.fossil_group_id === undefined)
      taxon.fossil_group_id = -1;

    if (taxon.fossil_group === undefined)
      taxon.fossil_group = locale.value === "et" ? "Määramata" : "None";

    if (output[taxon.fossil_group_id] === undefined) {
      output[taxon.fossil_group_id] = {
        fossil_group_id: taxon.fossil_group_id,
        fossil_group: taxon.fossil_group,
        node: [],
      };
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
  if (!navigator.geolocation)
    return;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (!map.value)
        return;

      searchFormState.nearMeLatLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      drawAreaNearMe();
      map.value.setView(
        [searchFormState.nearMeLatLng.lat, searchFormState.nearMeLatLng.lng],
        12 - searchFormState.nearMeRange * 0.15,
      );
      // this_.applySearch();
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED)
        state.errorMessage = "Geolocation is not supported by this browser.";
    },
  );
}
function drawAreaNearMe() {
  if (!map.value)
    return;

  if (state.circle !== null) {
    state.circle.remove();
    map.value.closePopup();
  }
  if (!searchFormState.nearMeLatLng)
    return;

  state.circle = $L.circle(searchFormState.nearMeLatLng, {
    color: "#bada55",
    radius: searchFormState.nearMeRange * 1000,
    dashArray: "4",
  });
  state.circle.on("add", ({ target }) => {
    if (!map.value)
      return;
    generatePopup(target, target._latlng, map.value);
  });
  state.circle.addTo(map.value);
}
</script>

<template>
  <section class="container space-y-2">
    <h1 class="mb-4 text-center text-5xl">
      {{ $t("menu.detail_search") }}
    </h1>
    <div class="grid grid-cols-2 gap-2">
      <div
        class="col-span-full rounded border bg-white p-4 dark:border-gray-700 dark:bg-gray-800 lg:col-span-1"
      >
        <UForm class="space-y-2" :state="searchFormState" @submit="search">
          <UFormGroup :label="$t('advancedsearch.hightaxon')">
            <USelectMenu
              v-model="searchFormState.higherTaxon"
              by="id"
              option-attribute="taxon"
              :searchable="searchHigherTaxon"
              :loading="loadingHigherTaxaOptions"
              size="md"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            >
              <template v-if="searchFormState.higherTaxon" #trailing>
                <UButton
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  :padded="false"
                  @click="searchFormState.higherTaxon = undefined"
                />
              </template>
            </USelectMenu>
          </UFormGroup>
          <UFormGroup :label="$t('advancedsearch.species')">
            <UInput v-model="searchFormState.species" />
          </UFormGroup>
          <UFormGroup :label="$t('advancedsearch.author')">
            <UInput v-model="searchFormState.author" />
          </UFormGroup>
          <UFormGroup :label="$t('advancedsearch.locality')">
            <UInput v-model="searchFormState.locality" />
          </UFormGroup>
          <UFormGroup :label="$t('advancedsearch.stratigraphy')">
            <USelectMenu
              v-model="searchFormState.stratigraphy"
              by="id"
              :searchable="searchStratigrahy"
              :loading="loadingStratigraphyOptions"
              size="md"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            >
              <template v-if="searchFormState.stratigraphy" #trailing>
                <UButton
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  :padded="false"
                  @click="searchFormState.stratigraphy = undefined"
                />
              </template>
              <template #label>
                <span v-if="!searchFormState.stratigraphy">&nbsp;</span>
                <span v-else>
                  {{
                    $translate({
                      et: searchFormState.stratigraphy.stratigraphy,
                      en: searchFormState.stratigraphy.stratigraphy_en,
                    })
                  }}
                </span>
              </template>
              <template #option="{ option: stratigraphy }">
                {{
                  $translate({
                    et: stratigraphy.stratigraphy,
                    en: stratigraphy.stratigraphy_en,
                  })
                }}
              </template>
            </USelectMenu>
          </UFormGroup>
          <UCheckbox
            v-model="searchFormState.isOutcrop"
            :label="$t('advancedsearch.subsurfaceField')"
          />
          <UCheckbox
            v-model="searchFormState.isNearMe"
            :label="$t('advancedsearch.showNearMeField')"
          />
          <UFormGroup
            v-if="searchFormState.isNearMe"
            :label="`Radius ${searchFormState.nearMeRange} km`"
          >
            <URange v-model="searchFormState.nearMeRange" :min="0" :max="20" />
            <div class="flex justify-between">
              <span>0</span>
              <span>20</span>
            </div>
          </UFormGroup>
          <div class="flex items-center justify-end space-x-2">
            <UButton
              variant="outline"
              color="gray"
              icon="i-heroicons-trash"
              @click="clearSearch"
            >
              {{ $t("advancedsearch.btn_clear") }}
            </UButton>
            <UButton type="submit">
              {{ $t("advancedsearch.btn_search") }}
            </UButton>
          </div>
        </UForm>
      </div>
      <div
        class="col-span-full rounded border dark:border-gray-700 lg:col-span-1"
      >
        <div id="map" class="z-0 h-96 lg:h-full" style="cursor: default" />
      </div>
    </div>
    <div>
      <UAlert
        v-if="state.initialMessage && !state.isLoadingResults"
        color="blue"
        variant="subtle"
        :title="$t('advancedsearch.msg_add_criteria')"
      />
    </div>
    <div
      v-if="state.results.length > 0"
      class="rounded border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
    >
      <h1 id="results" class="pb-4 text-4xl">
        {{ $t("advancedsearch.results") }}: {{ state.numberOfResults }}
        {{ $t("advancedsearch.results_species") }}
      </h1>

      <UPagination
        v-if="state.numberOfResults > paginationState.paginateBy"
        v-model="paginationState.page"
        :ui="{ base: 'ml-auto my-2' }"
        :total="state.numberOfResults"
        :page-count="paginationState.paginateBy"
      />
      <div
        v-for="(group, idx) in state.output"
        :key="idx"
        class="border-t-2 border-dotted border-gray-400 pb-4 pt-2"
      >
        <span class="flex items-center gap-x-2">
          <img
            onerror="this.style.display='none'"
            :src="`/fossilgroups/${group.fossil_group_id}.png`"
            width="70"
            height="70"
          >
          <h2 class="text-2xl">
            <NuxtLink
              v-if="group.fossil_group_id"
              :to="stateRoute(localePath(`/${group.fossil_group_id}`))"
            >
              {{ group.fossil_group }}
            </NuxtLink>
            <span v-else>{{ group.fossil_group }}</span>
          </h2>
        </span>
        <div class="grid grid-cols-2 pl-4">
          <template v-for="species in group.node" :key="species.taxon_id">
            <div class="col-span-1">
              <NuxtLink :to="stateRoute(localePath(`/${species.taxon_id}`))">
                <em>{{ species.taxon }}</em>
                {{ species.author_year }}
              </NuxtLink>
            </div>
            <div
              v-if="species.fad && species.lad && species.fad !== species.lad"
              class="col-span-1"
            >
              <span
                v-translate="{ et: species.fad, en: species.fad_en }"
              />
              &rarr;
              <span
                v-translate="{ et: species.lad, en: species.lad_en }"
              />
            </div>
            <div v-else-if="species.fad === species.lad" class="col-span-1">
              <span
                v-translate="{ et: species.fad, en: species.fad_en }"
              />
            </div>
            <div v-else-if="species.fad" class="col-span-1">
              <span
                v-translate="{ et: species.fad, en: species.fad_en }"
              />
            </div>
          </template>
        </div>
      </div>
      <UPagination
        v-if="state.numberOfResults > paginationState.paginateBy"
        v-model="paginationState.page"
        :ui="{ base: 'ml-auto my-2' }"
        :total="state.numberOfResults"
        :page-count="paginationState.paginateBy"
      />
    </div>
  </section>
</template>

<style scoped>
#rangeInput {
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
#rangeInput span {
  position: relative;
  margin: 15px -5px 0 -5px;
  flex-basis: 0;
  flex-grow: 1;
  text-align: center;
  font-size: 0.85em;
  user-select: none;
}
#rangeInput span::after {
  content: "";
  position: absolute;
  width: 1px;
  height: 8px;
  left: 0;
  right: 0;
  margin: auto;
  top: -12px;
  background-color: #ccc;
}
#rangeInput input {
  width: 100%;
  margin: 5px 10px;
  position: relative;
  background-color: #ccc;
  border-radius: 99px;
  z-index: 10;
  height: 7px;
  -webkit-appearance: none;
  appearance: none;
}
#rangeInput input::-moz-range-thumb {
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 99px;
  background: #35b0f2;
  cursor: pointer;
}
#rangeInput input::-webkit-slider-thumb {
  box-shadow: none;
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 99px;
  background-color: #35b0f2;
  cursor: pointer;
  -webkit-appearance: none;
}
</style>
