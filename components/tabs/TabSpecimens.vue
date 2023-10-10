<template>
  <div
    id="#tab-specimens"
    class="tab-pane"
    :class="{ active: activeTab === 'specimens' }"
    role="tabpanel"
  >
    <div class="row" v-if="loading">
      <spinner :show="loading"></spinner>
      <span class="p-2">{{ $t("messages.pageLoading") }}</span>
    </div>
    <div
      class="row m-1 table-responsive"
      v-if="$parent.isDefinedAndNotEmpty(response.results) && !loading"
    >
      <div class="col-xs-12 pagination-center">
        <b-pagination
          size="sm"
          align="end"
          :limit="5"
          :hide-ellipsis="true"
          :total-rows="response.count"
          v-model="searchParameters.specimens.page"
          :per-page="searchParameters.specimens.paginateBy"
        ></b-pagination>
      </div>
      <table
        class="table table-bordered table-hover mobile-padding-fix"
        style="font-size: smaller"
        id="table-search"
      >
        <thead class="thead-default">
          <tr>
            <th>
              <sort-field
                value="specimen_number"
                name="search.specimen.number"
              ></sort-field>
            </th>
            <!--<th><sort-field value = "specimen_number_old" name="search.specimen.old_specimen_number"></sort-field></th>-->
            <th>
              <sort-field
                value="taxon"
                name="search.specimen.name_part_element"
              ></sort-field>
            </th>
            <th>
              <sort-field
                value="locality,locality_en"
                name="search.specimen.locality"
              ></sort-field>
            </th>
            <th>
              <sort-field
                value="depth"
                name="search.specimen.depth_m"
              ></sort-field>
            </th>
            <th>
              <sort-field
                value="stratigraphy,stratigraphy_en"
                name="search.specimen.stratigraphy"
              />
              <!--|-->
              <!--<em>-->
              <!--<sort-field value="lithostratigraphy,lithostratigraphy_en" name="search.specimen.lithostratigraphy"/>-->
              <!--</em>-->
            </th>
            <!--<th><sort-field value = "collector_full_name" name="search.specimen.collector"></sort-field></th>-->
            <th>
              <sort-field
                value="original_status,original_status_en"
                name="search.specimen.status"
              ></sort-field>
            </th>
            <th>{{ $t("search.specimen.images") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in response.results">
            <td class="text-nowrap">
              <a
                href="#"
                @click="
                  $parent.openUrl({
                    parent_url: $parent.geocollectionUrl + '/specimen',
                    object: item.id,
                    width: 500,
                    height: 500,
                  })
                "
              >
                {{ item.acronym }} {{ item.specimen_number }}
              </a>
            </td>
            <!--<td class="text-nowrap">{{item.specimen_number_old}}</td>-->
            <td>
              <div>
                <a :href="'/' + item.taxon_id">{{ item.taxon }}</a>
                <span
                  v-if="
                    $parent.isDefinedAndNotNull(item.taxon_txt) &&
                    $parent.isDefinedAndNotNull(item.taxon) &&
                    item.taxon_txt != item.taxon
                  "
                >
                  |
                </span>
                <span
                  v-if="
                    $parent.isDefinedAndNotNull(item.taxon_txt) &&
                    item.taxon_txt != item.taxon
                  "
                >
                  <i v-for="(txt, idx) in item.taxon_txt">
                    {{ txt }}
                    <span v-if="idx !== item.taxon_txt.length - 1">,</span>
                  </i>
                </span>
              </div>
              <!-- Currently both are links because rock__name is mostly null. -->
              <div>
                <a
                  href="#"
                  @click="
                    $parent.openUrl({
                      parent_url: $parent.kividUrl,
                      object: item.rock_id,
                      width: 500,
                      height: 500,
                    })
                  "
                >
                  <span
                    v-translate="{ et: item.rock, en: item.rock_en }"
                  ></span>
                </a>
                <span
                  v-if="
                    $parent.isDefinedAndNotNull(item.rock) &&
                    $parent.isDefinedAndNotNull(item.rock_txt)
                  "
                >
                  |
                </span>
                <span
                  v-if="
                    ($parent.isDefinedAndNotNull(item.rock_txt) ||
                      $parent.isDefinedAndNotNull(item.rock_txt_en)) &&
                    (item.rock !== item.rock_txt ||
                      item.rock_en !== item.rock_txt_en)
                  "
                >
                  <i>
                    <span
                      v-translate="{ et: item.rock_txt, en: item.rock_txt_en }"
                    ></span>
                  </i>
                </span>
              </div>
            </td>
            <td
              v-if="
                !isSmallScreenDevice ||
                (isSmallScreenDevice &&
                  ($parent.isDefinedAndNotNull(item.locality) ||
                    $parent.isDefinedAndNotNull(item.locality_en) ||
                    $parent.isDefinedAndNotNull(item.locality_free)))
              "
            >
              <div
                v-if="
                  $parent.isDefinedAndNotNull(item.locality) ||
                  $parent.isDefinedAndNotNull(item.locality_en)
                "
              >
                <a
                  href="#"
                  @click="
                    $parent.openUrl({
                      parent_url: $parent.geocollectionUrl + '/locality',
                      object: item.locality_id,
                      width: 500,
                      height: 500,
                    })
                  "
                >
                  <span
                    v-translate="{ et: item.locality, en: item.locality_en }"
                  ></span>
                </a>
              </div>
              <span v-if="$parent.isDefinedAndNotNull(item.locality_free)">
                {{ item.locality_free }}
              </span>
            </td>
            <td
              v-if="
                !isSmallScreenDevice ||
                (isSmallScreenDevice &&
                  ($parent.isDefinedAndNotNull(item.depth) ||
                    $parent.isDefinedAndNotNull(item.depth_interval)))
              "
            >
              {{ item.depth }}
              <span v-if="item.depth_interval != null && item.depth_interval">
                - {{ item.depth_interval }}
              </span>
            </td>
            <td
              v-if="
                !isSmallScreenDevice ||
                (isSmallScreenDevice &&
                  ($parent.isDefinedAndNotNull(item.stratigraphy) ||
                    $parent.isDefinedAndNotNull(item.stratigraphy_en))) ||
                $parent.isDefinedAndNotNull(item.stratigraphy_txt)
              "
            >
              <a
                v-if="
                  $parent.isDefinedAndNotNull(item.stratigraphy) ||
                  $parent.isDefinedAndNotNull(item.stratigraphy_en)
                "
                href="#"
                @click="
                  $parent.openUrl({
                    parent_url: $parent.geocollectionUrl + '/stratigraphy',
                    object: item.stratigraphy_id,
                    width: 500,
                    height: 500,
                  })
                "
              >
                <span
                  v-translate="{
                    et: item.stratigraphy,
                    en: item.stratigraphy_en,
                  }"
                ></span>
              </a>

              <span
                v-if="
                  (item.stratigraphy_en == null && item.stratigraphy == null) ||
                  (item.lithostratigraphy_en == null &&
                    item.lithostratigraphy == null)
                "
                v-for="(txt, idx) in item.stratigraphy_txt"
              >
                {{ txt }}
                <span v-if="idx !== item.stratigraphy_txt.length - 1">,</span>
              </span>

              <!--<span v-if="item.stratigraphy != null && item.lithostratigraphy != null">|</span>-->

              <!--<em v-if="$parent.isDefinedAndNotNull(item.lithostratigraphy) || $parent.isDefinedAndNotNull(item.lithostratigraphy_en)">-->
              <!--<a href="#"-->
              <!--@click="$parent.openUrl({parent_url:$parent.geocollectionUrl+'/stratigraphy',object:item.lithostratigraphy_id, width:500,height:500})">-->
              <!--<span v-translate="{et:item.lithostratigraphy,en:item.lithostratigraphy_en}"></span></a>-->
              <!--</em>-->
            </td>
            <!--<td>-->
            <!--<div v-if="$parent.isDefinedAndNotNull(item.collector_full_name)">-->
            <!--{{ item.collector_full_name }}-->
            <!--</div>-->
            <!--</td>-->

            <td
              v-if="
                !isSmallScreenDevice ||
                (isSmallScreenDevice &&
                  ($parent.isDefinedAndNotNull(item.original_status) ||
                    $parent.isDefinedAndNotNull(item.original_status_en)))
              "
            >
              <span
                v-if="
                  $parent.isDefinedAndNotNull(item.original_status) ||
                  $parent.isDefinedAndNotNull(item.original_status_en)
                "
                v-translate="{
                  et: item.original_status,
                  en: item.original_status_en,
                }"
              ></span>
            </td>
            <td v-if="$parent.isDefinedAndNotNull(item.image_preview_url)">
              <a
                data-fancybox="gallery3"
                :href="item.image_url"
                :data-caption="item.caption"
              >
                <img
                  class="img-thumbnail previewImage"
                  :src="item.image_preview_url"
                  style="max-height: 6rem; max-width: 3rem"
                />
              </a>
            </td>
            <td v-else></td>
          </tr>
        </tbody>
      </table>
      <div class="col-xs-12 pagination-center">
        <b-pagination
          size="sm"
          align="end"
          :limit="5"
          :hide-ellipsis="true"
          :total-rows="response.count"
          v-model="searchParameters.specimens.page"
          :per-page="searchParameters.specimens.paginateBy"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchSpecimenCollection } from "../../api";
import Spinner from "../Spinner.vue";
import SortField from "../SortField.vue";
import { mapWritableState, mapState } from "pinia";
import { useRootStore } from "~/stores/root";

export default {
  name: "TabSpecimens",
  components: { SortField, Spinner },
  data() {
    return {
      loading: true,
      clientWidth: 800,
      response: this.setDefaultResponse(),
    };
  },
  computed: {
    ...mapWritableState(useRootStore, ["searchParameters"]),
    ...mapState(useRootStore, ["activeTab"]),
    taxon() {
      return this.$parent.taxon;
    },
    isSmallScreenDevice() {
      return this.clientWidth < 439;
    },
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.clientWidth = document.documentElement.clientWidth;
    });
    this.getSpecimens();
  },
  methods: {
    getSpecimens() {
      this.loading = true;
      this.setDefaultResponse();
      this.fetchSpecimenCollection(
        this.$parent.taxon.hierarchy_string,
        this.searchParameters,
      ).then((response) => {
        this.response = response;
        this.loading = false;
      });
    },
    fetchSpecimenCollection(hierarchy_string, searchParameters) {
      let start =
        searchParameters.specimens.paginateBy *
        (searchParameters.specimens.page - 1);
      let orderBy =
        searchParameters.specimens.order === "ASCENDING"
          ? searchParameters.specimens.sortBy + " asc"
          : searchParameters.specimens.sortBy + " desc";
      return $fetch(
        `solr/specimen/?q=hierarchy_string:(${hierarchy_string}*)&rows=${searchParameters.specimens.paginateBy}&start=${start}&sort=${orderBy}&format=json`,

        { baseURL: "https://api.geocollections.info" },
      );
    },
    setDefaultResponse() {
      return {
        count: 0,
        results: [],
      };
    },
  },
  watch: {
    "searchParameters.specimens": {
      handler: function () {
        this.getSpecimens();
      },
      deep: true,
    },
    "document.documentElement.clientWidth"(clientWidth) {
      if (clientWidth) {
        console.log(clientWidth);
      }
    },
  },
};
</script>

<style scoped>
#table-search .btn {
  padding: 0;
  margin: 0;
}
</style>
