<template>
  <div
    id="#tab-specimens"
    class="tab-pane"
    :class="{ active: store.activeTab === 'specimens' }"
    role="tabpanel"
  >
    <div v-if="state.loading" class="d-flex align-center">
      <BSpinner variant="warning" style="width: 44px; height: 44px" />
      <span class="p-2">{{ $t("messages.pageLoading") }}</span>
    </div>
    <div
      class="row m-1 table-responsive"
      v-else-if="isDefinedAndNotEmpty(state.response.results)"
    >
      <div class="col-xs-12 pagination-center">
        <b-pagination
          size="sm"
          align="end"
          :limit="5"
          :hide-ellipsis="true"
          :total-rows="state.response.count"
          v-model="store.searchParameters.specimens.page"
          :per-page="store.searchParameters.specimens.paginateBy"
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
          <tr v-for="item in state.response.results">
            <td class="text-nowrap">
              <a
                href="#"
                @click="
                  openUrl({
                    parent_url: state.geocollectionUrl + '/specimen',
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
                    isDefinedAndNotNull(item.taxon_txt) &&
                    isDefinedAndNotNull(item.taxon) &&
                    item.taxon_txt != item.taxon
                  "
                >
                  |
                </span>
                <span
                  v-if="
                    isDefinedAndNotNull(item.taxon_txt) &&
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
                    openUrl({
                      parent_url: state.kividUrl,
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
                    isDefinedAndNotNull(item.rock) &&
                    isDefinedAndNotNull(item.rock_txt)
                  "
                >
                  |
                </span>
                <span
                  v-if="
                    (isDefinedAndNotNull(item.rock_txt) ||
                      isDefinedAndNotNull(item.rock_txt_en)) &&
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
                  (isDefinedAndNotNull(item.locality) ||
                    isDefinedAndNotNull(item.locality_en) ||
                    isDefinedAndNotNull(item.locality_free)))
              "
            >
              <div
                v-if="
                  isDefinedAndNotNull(item.locality) ||
                  isDefinedAndNotNull(item.locality_en)
                "
              >
                <a
                  href="#"
                  @click="
                    openUrl({
                      parent_url: state.geocollectionUrl + '/locality',
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
              <span v-if="isDefinedAndNotNull(item.locality_free)">
                {{ item.locality_free }}
              </span>
            </td>
            <td
              v-if="
                !isSmallScreenDevice ||
                (isSmallScreenDevice &&
                  (isDefinedAndNotNull(item.depth) ||
                    isDefinedAndNotNull(item.depth_interval)))
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
                  (isDefinedAndNotNull(item.stratigraphy) ||
                    isDefinedAndNotNull(item.stratigraphy_en))) ||
                isDefinedAndNotNull(item.stratigraphy_txt)
              "
            >
              <a
                v-if="
                  isDefinedAndNotNull(item.stratigraphy) ||
                  isDefinedAndNotNull(item.stratigraphy_en)
                "
                href="#"
                @click="
                  openUrl({
                    parent_url: state.geocollectionUrl + '/stratigraphy',
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

              <!--<em v-if="isDefinedAndNotNull(item.lithostratigraphy) || isDefinedAndNotNull(item.lithostratigraphy_en)">-->
              <!--<a href="#"-->
              <!--@click="openUrl({parent_url:$parent.geocollectionUrl+'/stratigraphy',object:item.lithostratigraphy_id, width:500,height:500})">-->
              <!--<span v-translate="{et:item.lithostratigraphy,en:item.lithostratigraphy_en}"></span></a>-->
              <!--</em>-->
            </td>
            <!--<td>-->
            <!--<div v-if="isDefinedAndNotNull(item.collector_full_name)">-->
            <!--{{ item.collector_full_name }}-->
            <!--</div>-->
            <!--</td>-->

            <td
              v-if="
                !isSmallScreenDevice ||
                (isSmallScreenDevice &&
                  (isDefinedAndNotNull(item.original_status) ||
                    isDefinedAndNotNull(item.original_status_en)))
              "
            >
              <span
                v-if="
                  isDefinedAndNotNull(item.original_status) ||
                  isDefinedAndNotNull(item.original_status_en)
                "
                v-translate="{
                  et: item.original_status,
                  en: item.original_status_en,
                }"
              ></span>
            </td>
            <td v-if="isDefinedAndNotNull(item.image_preview_url)">
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
          :total-rows="state.response.count"
          v-model="store.searchParameters.specimens.page"
          :per-page="store.searchParameters.specimens.paginateBy"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isDefinedAndNotEmpty, isDefinedAndNotNull, openUrl } from "~/utils";
import { useRootStore } from "~/stores/root";
const props = defineProps({
  taxon: {
    type: Object,
    required: true,
  },
});
const state = reactive({
  loading: true,
  clientWidth: 800,
  response: {
    count: 0,
    results: [] as any[],
  },
  geocollectionUrl: "http://geocollections.info",
  fossilsUrl: "https://fossiilid.info",
  kividUrl: "http://www.kivid.info",
});
const store = useRootStore();
const { $apiFetch } = useNuxtApp();

const isSmallScreenDevice = computed(() => {
  return state.clientWidth < 439;
});
onMounted(() => {
  window.addEventListener("resize", () => {
    state.clientWidth = document.documentElement.clientWidth;
  });
  getSpecimens();
});
function getSpecimens() {
  state.loading = true;
  fetchSpecimenCollection(
    props.taxon.hierarchy_string,
    store.searchParameters
  ).then((response) => {
    state.response = response;
    state.loading = false;
  });
}
function fetchSpecimenCollection(
  hierarchy_string: string,
  searchParameters: any
) {
  let start =
    searchParameters.specimens.paginateBy *
    (searchParameters.specimens.page - 1);
  let orderBy =
    searchParameters.specimens.order === "ASCENDING"
      ? searchParameters.specimens.sortBy + " asc"
      : searchParameters.specimens.sortBy + " desc";
  return $apiFetch<{ count: number; results: any[] }>(`solr/specimen`, {
    query: {
      q: `hierarchy_string:(${hierarchy_string}*)`,
      rows: searchParameters.specimens.paginateBy,
      start: start,
      sort: orderBy,
      format: "json",
    },
  });
}

watch(
  () => store.searchParameters.specimens,
  () => {
    getSpecimens();
  },
  { deep: true }
);
</script>

<style scoped>
#table-search .btn {
  padding: 0;
  margin: 0;
}
</style>
