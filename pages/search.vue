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
      <!--<div id="debug"></div>-->
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
                    v-model="searchParams.higherTaxa"
                    deselect-label="Can't remove this value"
                    select-label=""
                    track-by="taxan_id"
                    label="taxon"
                    :options="searchResults"
                    :searchable="true"
                    @search-change="autocompliteHigherTaxaSearch"
                    :allow-empty="true"
                    :show-no-results="false"
                    :loading="isHigherTaxaLoading"
                    :max-height="600"
                    :open-direction="'bottom'"
                  >
                    <template slot="singleLabel" slot-scope="{ option }">
                      <strong>{{ option.taxon }}</strong>
                    </template>
                    <template slot="noResult"><b>NoRes</b></template>
                    <template slot="clear" slot-scope="props">
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
                    v-model="searchParams.speciesField"
                    v-on:keydown.enter="applySearch"
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
                    v-model="searchParams.authorField"
                    v-on:keydown.enter="applySearch"
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
                    v-model="searchParams.localityField"
                    v-on:keydown.enter="applySearch"
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
                    v-model="searchParams.stratigraphyField"
                    deselect-label="Can't remove this value"
                    select-label=""
                    :custom-label="displayStratigraphyResults"
                    track-by="taxan_id"
                    :options="searchResults"
                    :searchable="true"
                    @search-change="autocompliteStratigraphySearch"
                    :allow-empty="true"
                    :show-no-results="false"
                    :loading="isStratLoading"
                    :max-height="600"
                    :open-direction="'bottom'"
                  >
                    <template slot="singleLabel" slot-scope="{ option }">
                      <strong>
                        {{
                          $i18n.locale === "et"
                            ? option.stratigraphy
                            : option.stratigraphy_en
                        }}
                      </strong>
                    </template>
                    <template slot="noResult"><b>NoRes</b></template>
                    <template slot="clear" slot-scope="props">
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
                    v-model="searchParams.isSubsurface"
                  >
                    {{ $t("advancedsearch.subsurfaceField") }}
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="4">
                  <b-form-checkbox
                    id="nearMeSearchCheckbox"
                    v-model="searchParams.isNearMeSearch"
                  >
                    {{ $t("advancedsearch.showNearMeField") }}
                  </b-form-checkbox>
                </b-col>
                <b-col md="12" v-if="errorMessege !== null">
                  <b-alert :model-value="true" variant="warning">
                    {{ errorMessege }}
                  </b-alert>
                </b-col>
                <b-col sm="8" class="pt-2">
                  <vue-slider
                    ref="slider"
                    :min="0"
                    :max="20"
                    :piecewiseLabel="true"
                    width="100%"
                    :show="searchParams.isNearMeSearch === true"
                    v-model="searchParams.radius"
                    :disabled="errorMessege !== null"
                  >
                    <template slot="label" slot-scope="{ label, active }">
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
                    @click="applySearch()"
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
        <ClientOnly>
          <b-col md="6" class="me-auto" style="padding-left: 0.1rem !important">
            <div class="card rounded-0" style="width: 100%; height: 100%">
              <div class="card-body no-padding">
                <div id="map" style="height: 380px"></div>
              </div>
            </div>
          </b-col>
        </ClientOnly>
      </b-row>
      <b-row class="pt-3">
        <b-col md="12" v-if="initialMessege && !isLoadingResults">
          <b-alert :model-value="true" variant="info" v-if="!!initialMessege">
            {{ $t("advancedsearch.msg_add_criteria") }}
          </b-alert>
        </b-col>

        <b-col md="12" v-if="!initialMessege">
          <b-row v-if="isLoadingResults">
            <spinner :show="isLoadingResults"></spinner>
            <span class="p-2">{{ $t("messages.pageLoading") }}</span>
          </b-row>
          <div class="card rounded-0">
            <div class="card-body">
              <h1 id="results" class="pb-4" v-if="results">
                {{ $t("advancedsearch.results") }}: {{ numberOfResutls }}
                {{ $t("advancedsearch.results_species") }}
              </h1>
              <div class="col-xs-12 pagination-center">
                <b-pagination
                  v-if="
                    numberOfResutls > searchParameters.advancedSearch.paginateBy
                  "
                  size="sm"
                  align="right"
                  :limit="5"
                  :hide-ellipsis="true"
                  :total-rows="numberOfResutls"
                  v-model="searchParameters.advancedSearch.page"
                  :per-page="searchParameters.advancedSearch.paginateBy"
                ></b-pagination>
              </div>
              <div
                v-for="group in output"
                style="padding: 5px 0 20px 0; border-top: dotted 2px #ccc"
              >
                <span>
                  <img
                    onerror="this.style.display='none'"
                    :src="
                      '/static/fossilgroups/' + group.fossil_group_id + '.png'
                    "
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
                  v-if="
                    numberOfResutls > searchParameters.advancedSearch.paginateBy
                  "
                  size="sm"
                  align="right"
                  :limit="5"
                  :hide-ellipsis="true"
                  :total-rows="numberOfResutls"
                  v-model="searchParameters.advancedSearch.page"
                  :per-page="searchParameters.advancedSearch.paginateBy"
                ></b-pagination>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </section>
</template>
<script>
import VueMultiselect from "vue-multiselect";

import Spinner from "../components/Spinner.vue";
import vueSlider from "../components/vue2-slider.vue";
import MapComponent from "../components/MapComponent.vue";
import { mapWritableState } from "pinia";
import { useRootStore } from "~/stores/root";
export default {
  name: "advanced-search-page",
  components: {
    Spinner,
    VueMultiselect,
    vueSlider,
  },
  mixins: [MapComponent],
  data() {
    return {
      query: "",
      searchParams: this.setSearchParams(),
      initialMessege: true,
      errorMessege: null,
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
      numberOfResutls: 0,
      isPopupQueryTriggered: false,
      openPopup: null,
    };
  },

  computed: {
    ...mapWritableState(useRootStore, ["searchParameters"]),
  },
  methods: {
    getSpeciesCountInArea: function (geomParams, speciesID) {
      $fetch(
        `solr/taxon_search/?${
          this.getQueryParameters(geomParams) +
          "fq=%7B%21collapse%20field=locality%7D&"
        }q=rank:[14%20TO%2017]&fl=taxon&rows=1&format=json`,
        { baseURL: "https://api.geocollections.info" }
      )
        .then((response) => {
          if (document.getElementById(speciesID) !== null) {
            document.getElementById(speciesID).innerHTML = response.count
              ? response.count
              : 0;
          }
        })
        .catch(function (error) {
          console.error(error);
        });
      // fetchSpeciesCountInArea(
      //   this.getQueryParameters(geomParams) +
      //     "fq=%7B%21collapse%20field--locality%7D&"
      // )
      //   .then((response) => {
      //     if (document.getElementById(speciesID) !== null) {
      //       document.getElementById(speciesID).innerHTML = response.count
      //         ? response.count
      //         : 0;
      //     }
      //   })
      //   .catch(function (error) {
      //     console.error(error);
      //   });
    },
    getOccurrenceCountInArea: function (geomParams, occurrenceID) {
      $fetch(
        `solr/taxon_search/?${
          this.getQueryParameters(geomParams) +
          "fq=%7B%21collapse%20field=taxon%7D&"
        }q=rank:[14%20TO%2017]&fl=taxon&rows=1&format=json`,
        { baseURL: "https://api.geocollections.info" }
      )
        .then((response) => {
          if (document.getElementById(occurrenceID) !== null) {
            document.getElementById(occurrenceID).innerHTML = response.count
              ? response.count
              : 0;
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    showRecordsInSelectedArea: function (this_, layer, geomParams) {
      this_.resetDrawnItemsColor();
      layer.setStyle({ color: "#ff2a12" });
      this_.searchParams.geoparams = geomParams;
    },
    generatePopup: function (layer, latlng, query, map) {
      var geomParams = "",
        this_ = this;
      if (typeof layer.getRadius === "function") {
        // circle
        geomParams = this.getParamsForCircle(layer, query);
      } else {
        var wkt = new Wkt.Wkt();
        var geojson = layer.toGeoJSON();
        var geostr = JSON.stringify(geojson);

        wkt.read(geostr);

        geomParams = this.getParamsForWKT(wkt.write(), query);
      }

      // map.closePopup();
      if (typeof layer.getLatLng === "function") {
        latlng = layer.getLatLng();
        if (
          map._popup !== null &&
          this.openPopup !== null &&
          layer &&
          this.openPopup.getLatLng().lat.toFixed(2) ===
            layer.getLatLng().lat.toFixed(2) &&
          this.openPopup.getLatLng().lng.toFixed(2) ===
            layer.getLatLng().lng.toFixed(2)
        ) {
          layer.off("click", this.openPopup);
          return;
        }
      }

      if (map._popup) {
        map.closePopup(this.openPopup);
        if (map._popup !== null) latlng = layer.getBounds().getCenter();
        return;
        // if(map._popup.getLatLng()  &&  map._popup.getLatLng().lat === latlng.lat && map._popup.getLatLng().lng === latlng.lng)
      } else {
        latlng = layer.getBounds().getCenter();
      }

      var coordsStr = latlng.lat + "-" + latlng.lng;
      var speciesID = "speciesCount-" + coordsStr;
      var occurrenceID = "occurrenceCount-" + coordsStr;
      this_.getSpeciesCountInArea(geomParams, speciesID);
      this_.getOccurrenceCountInArea(geomParams, occurrenceID);
      let numberOfDrawnLayers = Object.keys(this_.drawnItems._layers).length;

      let content =
        this.$t("advancedsearch.js_map_popup_localitycount") +
        ": " +
        '<b id="' +
        speciesID +
        '">' +
        this.$t("advancedsearch.calculating") +
        "</b>" +
        "<br />" +
        this.$t("advancedsearch.js_map_popup_speciescount") +
        ": " +
        '<b id="' +
        occurrenceID +
        '">' +
        this.$t("advancedsearch.calculating") +
        "</b>";

      if (numberOfDrawnLayers > 1) {
        content +=
          "<br />" +
          '<a id="showOnlyTheseRecords" href="#map" onclick="return;">' +
          '<span class="fa fa-search"></span> ' +
          this.$t("advancedsearch.js_map_popup_linkText") +
          "</a>";
      }

      this.openPopup = L.popup({
        closeOnClick: false,
        autoClose: false,
      })
        .setLatLng(latlng)
        .setContent(content)
        .openOn(map);

      $("#showOnlyTheseRecords").on("click", function (event) {
        map.closePopup(this.openPopup);
        this_.showRecordsInSelectedArea(this_, layer, geomParams);
      });

      if (numberOfDrawnLayers === 1) {
        this_.showRecordsInSelectedArea(this_, layer, geomParams);
      }
    },
    removeDrawnItems: function () {
      let this_ = this;
      this.map.closePopup();
      this.map.eachLayer(function (layer) {
        if (layer.options.hasOwnProperty("stroke")) {
          this_.map.removeLayer(layer);
        }
      });

      Object.keys(this.drawnItems._layers).forEach(function (el) {
        delete this_.drawnItems._layers[el];
      });
    },
    resetDrawnItemsColor: function () {
      this.map.eachLayer(function (layer) {
        if (layer.options.hasOwnProperty("stroke")) {
          layer.setStyle({ color: "#bada55" });
        }
      });
    },
    getParamsForWKT: function (wkt) {
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
        reversedPairs.length > 0
          ? reversedPairs.join(",")
          : coordsPairs.join(",");
      return `fq=%7B%21field%20f--latlong%7DisWithin(${changedWkt})`;
    },

    getParamsForCircle: function (circle) {
      var latlng = circle.getLatLng();
      var radius = Math.round((circle.getRadius() / 1000) * 10) / 10; // convert to km (from m) and round to 1 decmial place
      return `fq=%7B%21geofilt%7D&d=${radius}&pt=${latlng.lat},${latlng.lng}&sfield=latlong`;
    },

    getBaseLayers: function () {
      // Google map layers
      this.tileLayer = L.tileLayer(
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
      // var terrainLayer = L.gridLayer.googleMutant({ type: 'terrain' });
      // var hybridLayer = L.gridLayer.googleMutant({ type: 'satellite' });
      // var blackWhiteLayer = new L.StamenTileLayer('toner');

      var baseLayers = {};
      baseLayers[this.$t("advancedsearch.js_map_layers_Minimal")] =
        this.tileLayer;
      // baseLayers[this.$t('advancedsearch.js.map.layers.Road')] = roadLayer;
      // baseLayers[this.$t('advancedsearch.js.map.layers.Terrain')] = terrainLayer;
      // baseLayers[this.$t('advancedsearch.js.map.layers.Satellite')] = hybridLayer;
      // baseLayers[this.$t('advancedsearch.js.map.layers.BlackWhite')] = blackWhiteLayer;

      return baseLayers;
    },

    getStoredMapLayer: function () {
      var storedLayerName;
      try {
        storedLayerName = localStorage.getItem("defaultMapLayer");
      } catch (e) {
        // localStorage not available
        storedLayerName = this.$t("advancedsearch.js_map_layers_Minimal");
      }
      return storedLayerName;
    },
    initialiseMap: function () {
      let this_ = this;

      document.getElementById("map").style.cursor = "default";
      let MAP_VAR = this;
      // initialise map
      MAP_VAR.map = L.map("map", {
        // fullscreenControl: true,
        // fullscreenControlOptions: {
        //     position: 'topleft'
        // },
        zoomControl: false,
        minZoom: 1,
        scrollWheelZoom: true,
      });
      this.setView();
      this.drawI18N();
      L.control
        .zoom({
          position: "topleft",
          zoomInTitle: this.$t("advancedsearch.js_map_zoomin"),
          zoomOutTitle: this.$t("advancedsearch.js_map_zoomout"),
        })
        .addTo(MAP_VAR.map);

      // add edit drawing toolbar
      // Initialise the FeatureGroup to store editable layers
      MAP_VAR.drawnItems = new L.FeatureGroup();
      MAP_VAR.map.addLayer(MAP_VAR.drawnItems);

      // Initialise the draw control and pass it the FeatureGroup of editable layers
      this.drawControls = new L.Control.Draw({
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

      MAP_VAR.map.addControl(this.drawControls);

      /*  Common map (Leaflet) functions */
      function addClickEventForVector(layer, query, map) {
        layer.on("click", function (e) {
          //prevent new search if selected area popup already triggered
          this_.generatePopup(layer, e.latlng, query, map, this_);
        });
      }

      // function yourCustomLog(msg) {
      //     document.getElementById('debug').innerHTML = document.getElementById('debug').innerHTML+"</br>"+msg;
      // }
      //
      // window.console.log = yourCustomLog;
      // window.console.error = yourCustomLog;

      MAP_VAR.map.on("draw:created", function (e) {
        var layer = e.layer;

        var center =
          typeof layer.getLatLng === "function"
            ? layer.getLatLng()
            : layer.getBounds().getCenter();
        addClickEventForVector(layer, MAP_VAR.query, MAP_VAR.map);
        MAP_VAR.drawnItems.addLayer(layer);
        // "run next" - trigger the popup a bit later for maxiumum browser compatibility
        if (MAP_VAR.isPopupQueryTriggered === false) {
          setTimeout(function () {
            layer.fireEvent("click");
          }, 200);
        }
      });

      MAP_VAR.map.on("draw:edited", function (e) {
        var layers = e.layers;

        layers.eachLayer(function (layer) {
          this_.generatePopup(layer, layer._latlng, MAP_VAR.query, MAP_VAR.map);
        });
      });

      var baseLayers = this.getBaseLayers();

      // add the default base layer
      var storedLayerName = this.getStoredMapLayer();

      var defaultLayerName;
      if (storedLayerName in baseLayers) {
        defaultLayerName = storedLayerName;
      } else {
        defaultLayerName = this.$t("advancedsearch.js_map_layers_Minimal");
      }

      var defaultBaseLayer = baseLayers[defaultLayerName];
      MAP_VAR.map.addLayer(defaultBaseLayer);

      L.control
        .coordinates({ position: "bottomright", useLatLngOrder: true })
        .addTo(MAP_VAR.map); // coordinate plugin
      //Layers menu
      // L.control.layers(baseLayers, {}, { collapsed: true, position: 'bottomleft' }).addTo(MAP_VAR.map);
      L.Util.requestAnimFrame(
        MAP_VAR.map.invalidateSize,
        MAP_VAR.map,
        !1,
        MAP_VAR.map._container
      );

      // MAP_VAR.map.on('baselayerchange', onBaseLayerChange);
    },
    /**
         Translations for leaflet-draw library
         */
    drawI18N: function () {
      L.Control.Fullscreen.title = this.$t("advancedsearch.draw_actions_title");
      L.drawLocal.draw.toolbar.actions.title = this.$t(
        "advancedsearch.draw_actions_title"
      );
      L.drawLocal.draw.toolbar.actions.text = this.$t(
        "advancedsearch.draw_actions_text"
      );
      L.drawLocal.draw.toolbar.finish.title = this.$t(
        "advancedsearch.draw_finish_title"
      );
      L.drawLocal.draw.toolbar.finish.text = this.$t(
        "advancedsearch.draw_finish_text"
      );
      L.drawLocal.draw.toolbar.undo.title = this.$t(
        "advancedsearch.draw_undo_title"
      );
      L.drawLocal.draw.toolbar.undo.text = this.$t(
        "advancedsearch.draw_undo_text"
      );
      L.drawLocal.draw.toolbar.buttons.polygon = this.$t(
        "advancedsearch.draw_buttons_polygon"
      );
      L.drawLocal.draw.toolbar.buttons.rectangle = this.$t(
        "advancedsearch.draw_buttons_rectangle"
      );
      L.drawLocal.draw.toolbar.buttons.circle = this.$t(
        "advancedsearch.draw_buttons_circle"
      );
      L.drawLocal.draw.handlers.polygon.tooltip.start = this.$t(
        "advancedsearch.draw_polygon_tooltip_start"
      );
      L.drawLocal.draw.handlers.polygon.tooltip.cont = this.$t(
        "advancedsearch.draw_polygon_tooltip_cont"
      );
      L.drawLocal.draw.handlers.polygon.tooltip.end = this.$t(
        "advancedsearch.draw_polygon_tooltip_end"
      );
      L.drawLocal.draw.handlers.rectangle.tooltip.start = this.$t(
        "advancedsearch.draw_rectangle_tooltip_start"
      );
      L.drawLocal.draw.handlers.simpleshape.tooltip.end = this.$t(
        "advancedsearch.draw_simpleshape_tooltip_end"
      );
      L.drawLocal.draw.handlers.circle.tooltip.start = this.$t(
        "advancedsearch.draw_circle_tooltip_start"
      );
      L.drawLocal.draw.handlers.circle.radius = this.$t(
        "advancedsearch.draw_circle_radius"
      );
      L.drawLocal.edit.toolbar.buttons.edit = this.$t(
        "advancedsearch.draw_edit_toolbar_buttons_edit"
      );
      L.drawLocal.edit.toolbar.actions.save.text = this.$t(
        "advancedsearch.draw_edit_toolbar_actions_save_text"
      );
      L.drawLocal.edit.toolbar.actions.save.title = this.$t(
        "advancedsearch.draw_edit_toolbar_actions_save_title"
      );
      L.drawLocal.edit.toolbar.actions.cancel.title = this.$t(
        "advancedsearch.draw_edit_toolbar_actions_cancel_title"
      );
      L.drawLocal.edit.toolbar.actions.cancel.text = this.$t(
        "advancedsearch.draw_edit_toolbar_actions_cancel_text"
      );
      L.drawLocal.edit.handlers.edit.tooltip.text = this.$t(
        "advancedsearch.draw_edit_handlers_edit_tooltip_text"
      );
      L.drawLocal.edit.handlers.edit.tooltip.subtext = this.$t(
        "advancedsearch.draw_edit_handlers_edit_tooltip_subtext"
      );
      // L.drawLocal.edit.toolbar.buttons.remove.remove = this.$t('advancedsearch.draw_edit_toolbar_buttons_remove_remove');
      L.drawLocal.edit.toolbar.actions.clearAll.text = this.$t(
        "advancedsearch.draw_edit_toolbar_actions_clearAll_text"
      );
      L.drawLocal.edit.toolbar.actions.clearAll.title = this.$t(
        "advancedsearch.draw_edit_toolbar_actions_clearAll_title"
      );
      L.drawLocal.edit.handlers.remove.tooltip.text = this.$t(
        "advancedsearch.draw_edit_handlers_remove_tooltip_text"
      );
    },

    // Stratigraphy search
    displayStratigraphyResults: function (item) {
      return this.$i18n.locale === "et"
        ? `${item.stratigraphy}`
        : `${item.stratigraphy_en}`;
    },
    autocompliteStratigraphySearch(value) {
      this.autocompliteSearch(value, false, true, this.isStratLoading);
    },
    autocompliteHigherTaxaSearch(value) {
      this.autocompliteSearch(value, true, false, this.isHigherTaxaLoading);
    },
    autocompliteSearch(value, isHigher, isStrat, isLoading) {
      if (value.length < 3) this.searchResults = [];
      if (value.length > 2) {
        let query = this.getAutocompleteQueryParameters(
          value,
          isHigher,
          isStrat
        );
        if (query.length === 0) return;
        isLoading = true;
        if (isHigher === true) {
          $fetch(
            `solr/taxon/?fq=${query}&sort=taxon asc&rows=30&fl=taxon,taxon_id,hierarchy_string&format=json`,
            { baseURL: "https://api.geocollections.info" }
          ).then((response) => {
            isLoading = false;
            this.searchResults = response.results;
          });
        } else {
          $fetch(
            `solr/stratigraphy/?fq=${query}&sort=stratigraphy asc&rows=30&fl=stratigraphy,stratigraphy_en,id,hierarchy_string&fq=type:1&format=json`,
            { baseURL: "https://api.geocollections.info" }
          ).then((response) => {
            isLoading = false;
            this.searchResults = response.results;
          });
        }
      }
    },
    getAutocompleteQueryParameters(
      fieldValue,
      isHigher = false,
      isStrat = false
    ) {
      let lowerFirstCh = fieldValue.charAt(0).toLowerCase();
      let upperFirstCh = fieldValue.charAt(0).toUpperCase();
      let str = fieldValue.substring(1).toLowerCase();
      if (isHigher === true) {
        return `taxon:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/&fq=%7B%21collapse%20field--taxon%7D&fq=rank:[1%20TO%2013]`;
      }
      if (isStrat === true) {
        return `stratigraphy:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/OR stratigraphy_en:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`;
      }
    },
    setSearchParams() {
      return {
        higherTaxa: null,
        speciesField: null,
        authorField: null,
        localityField: null,
        freeTextLocality: null,
        stratigraphyField: null,
        isSubsurface: false,
        isNearMeSearch: false,
        geoparams: null,
        nearMeArea: null,
        radius: 5,
        latlng: null,
      };
    },
    clearSearch() {
      this.searchParams = this.setSearchParams();
      this.resetLayers();
      this.removeDrawnItems();
      this.initialMessege = true;
      this.output = {};
      this.results = null;
    },
    getQueryParameters(geoparams = null) {
      function addFreeTextQueryParam(value, field) {
        let lowerFirstCh = value.charAt(0).toLowerCase();
        let upperFirstCh = value.charAt(0).toUpperCase();
        let str = value.substring(1).toLowerCase();
        if (field === "speciesField")
          return `taxon:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`;
        if (field === "authorField")
          return `author_year:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`;
        if (field === "localityField")
          return `(locality:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/OR locality_en:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/)`;
        return "";
      }

      let params = this.searchParams;
      let query = "";
      Object.getOwnPropertyNames(params)
        .slice(0, 8)
        .forEach(function (el) {
          if (params[el] === true) {
            if (["isSubsurface"].includes(el))
              query += `-locality:*puurauk AND `;
          } else if (
            !["isSubsurface", "isNearMeSearch"].includes(el) &&
            params[el] !== null &&
            params[el] !== "" &&
            el !== "__ob__"
          ) {
            if (["higherTaxa"].includes(el))
              query += `taxon_hierarchy:${params[el].hierarchy_string}* AND `;
            else if (["stratigraphyField"].includes(el))
              query += `(stratigraphy_hierarchy:${params[el].hierarchy_string}* OR global_stratigraphy_hierarchy:${params[el].hierarchy_string}*) AND `;
            else if (el !== "geoparams")
              query += `${addFreeTextQueryParam(params[el], el)} AND `;
          }
        });

      //remove last AND
      if (query.length > 0)
        query = `fq=${query.substring(0, query.length - 5)}&`;
      if (geoparams !== null) query += `${geoparams}&`;
      else if (params["geoparams"] !== null) query += `${params["geoparams"]}&`;
      else if (
        params["isNearMeSearch"] === true &&
        params["nearMeArea"] !== null
      )
        query += `${params["nearMeArea"]}&`;
      return query;
    },
    fetchAdvancedTaxonSearch(query, searchParameters, isMapData = false) {
      let start =
        searchParameters.advancedSearch.paginateBy *
        (searchParameters.advancedSearch.page - 1);
      let fq = isMapData
        ? `fq=%7B%21collapse%20field--locality%7D`
        : `fq=%7B%21collapse%20field--taxon%7D`;
      let fl = isMapData
        ? `fl=locality_en,locality_id,locality,latlong,src`
        : `fl=taxon,taxon_id,author_year,fossil_group,fossil_group_id,fad,fad_en,fad_id,lad,lad_en,lad_id,locality_en,locality_id,locality,latlong,src`;
      return $fetch(
        `solr/taxon_search/?${query}${fq}&fq=rank:[14%20TO%2017]&sort=fossil_group asc,taxon asc&rows=${
          isMapData
            ? searchParameters.advancedSearch.madDataPaginateBy
            : searchParameters.advancedSearch.paginateBy
        }&start=${start}&${fl}&format=json`,
        { baseURL: "https://api.geocollections.info" }
      );
    },
    applySearch() {
      let query = this.getQueryParameters();
      if (query.length === 0) {
        this.clearSearch();
        return;
      }
      this.isLoadingResults = true;
      this.fetchAdvancedTaxonSearch(query, this.searchParameters, true).then(
        (response) => {
          this.mapDataResult = response.results;
          this.showLocalitiesOnMap();
        }
      );
      this.fetchAdvancedTaxonSearch(query, this.searchParameters, false).then(
        (response) => {
          this.results = response.results;
          this.numberOfResutls = response.count;
          this.resultsHandling();
          this.showLocalitiesOnMap();
        }
      );
    },
    showLocalities() {
      if (this.getLocationsObject(this.mapDataResult)) {
        this.initLayers();
        this.checkAllLayers();
      }
    },
    showLocalitiesOnMap() {
      // Promise should be returned. Otherwise, navigation to last page triggers showLocalities function before
      // layers has been reset
      this.resetLayers().then(() => {
        this.showLocalities();
      });
    },
    resultsHandling() {
      this.initialMessege = false;
      this.isLoadingResults = false;
      let filteredByUniqueID = this.results;
      // uniqBy(this.results,'taxon_id')
      let j = 0,
        output = {},
        oorder = [],
        forder = {};
      for (j in filteredByUniqueID) {
        let i = filteredByUniqueID[j];
        if (i["fossil_group_id"] === undefined)
          i["fossil_group"] = this.$i18n.locale === "et" ? "Määramata" : "None";
        if (output[i["fossil_group_id"]] === undefined) {
          output[i["fossil_group_id"]] = {
            fossil_group_id: i["fossil_group_id"],
            fossil_group: i["fossil_group"],
            node: [],
          };
          oorder.push(i["fossil_group_id"]);
        }
        output[i["fossil_group_id"]]["node"].push({
          taxon: i["taxon"],
          taxon_id: i["taxon_id"],
          author_year: i["author_year"],
          fad: i["fad"],
          fad_en: i["fad_en"],
          lad: i["lad"],
          lad_en: i["lad_en"],
        });
      }

      let output_ = [],
        i = 0;
      for (i in oorder) {
        if (oorder[i] === output[oorder[i]]["fossil_group_id"])
          output_.push(output[oorder[i]]);
      }
      this.output = output_;
    },
    isDefinedAndNotNull(value) {
      return !!value && value !== null;
    },
    getLocation() {
      let this_ = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            let geoparams = {
              getRadius() {
                return this_.searchParams.radius * 1000;
              },
              getLatLng() {
                return {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
              },
            };
            this_.searchParams.latlng = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this_.searchParams.nearMeArea = this_.getParamsForCircle(geoparams);
            this_.drawAreaNearMe();
            this_.map.setView(
              [this_.searchParams.latlng.lat, this_.searchParams.latlng.lng],
              12 - this_.searchParams.radius * 0.15
            );

            // this_.applySearch();
          },
          function (error) {
            if (error.code == error.PERMISSION_DENIED)
              this_.errorMessege =
                "Geolocation is not supported by this browser.";
          }
        );
      }
    },
    drawAreaNearMe() {
      this._map = this.map;
      this.type = "circle";

      if (this.circle !== null) {
        this.circle.remove();
        this.map.closePopup();
        delete this.drawnItems._layers[this.circle._leaflet_id];
      }

      this.circle = new L.Circle(
        this.searchParams.latlng,
        this.searchParams.radius * 1000,
        this.drawControls.options.draw.circle.shapeOptions
      );
      L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, this.circle);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initialiseMap();
    });
  },
  watch: {
    "searchParameters.advancedSearch.page": {
      handler: function (newVal, oldVal) {
        this.applySearch();
      },
    },
    "searchParams.isSubsurface": {
      handler: function (newVal, oldVal) {
        // this.applySearch();
      },
    },
    "searchParams.isNearMeSearch": {
      handler: function (newVal, oldVal) {
        if (this.searchParams.isNearMeSearch === true) {
          this.searchParams.isSubsurface = true;
          this.getLocation();
        } else {
          this.circle.remove();
          this.map.closePopup();
          this.searchParams.nearMeArea = false;
          this.searchParams.geoparams = null;
          this.searchParams.nearMeArea = null;
          this.searchParams.radius = 5;
          this.searchParams.latlng = null;
        }
      },
    },
    "searchParams.radius": {
      handler: function (newVal, oldVal) {
        if (this.searchParams.isNearMeSearch === false) return;
        this.drawAreaNearMe();
        this.map.setView(
          [this.searchParams.latlng.lat, this.searchParams.latlng.lng],
          12 - this.searchParams.radius * 0.15
        );
      },
      deep: true,
    },
  },
};
</script>
