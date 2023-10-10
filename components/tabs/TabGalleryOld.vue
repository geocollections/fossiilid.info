<template>
  <div
    id="#tab-gallery"
    class="tab-pane"
    :class="{ active: $store.state.activeTab === 'gallery' }"
    role="tabpanel"
  >
    <transition name="fade">
      <b-row class="m-1" v-if="!$parent.imagesLoading">
        <div class="photogallery">
          <div
            v-for="image in $parent.images"
            style="float: left; position: relative"
            class="image_highlight"
            v-if="image.src"
          >
            <a
              data-fancybox="gallery2"
              :href="image.src"
              :data-caption="image.caption"
            >
              <img
                :alt="image.caption"
                style="height: 200px"
                :src="image.thumbnail"
                onerror="this.style.display='none'"
              />
            </a>
          </div>
        </div>
        <div id="bottomOfGallery"></div>
        <div v-if="imagesLoading">
          <spinner :show="imagesLoading"></spinner>
          <span class="p-2">{{ $t("messages.pageLoading") }}</span>
        </div>
      </b-row>
    </transition>
  </div>
</template>

<script>
import { fetchAttachment, fetchImages } from "../../api";
import Spinner from "../Spinner.vue";

export default {
  name: "TabGallery",
  components: { Spinner },
  data() {
    return { bottom: false, imagesLoading: false, noMoreResults: false };
  },
  created() {
    window.addEventListener("scroll", () => {
      this.bottom = false;
      this.bottom = this.bottomVisible();
    });
    this.loadMoreImages();
  },

  watch: {
    bottom: {
      handler: function (bottom) {
        if (bottom) {
          console.log("bottom handler " + bottom);
          this.loadMoreImages();
        }
      },
      deep: true,
    },
  },
  methods: {
    bottomVisible() {
      const visible = document.documentElement.clientHeight;
      return document.getElementById("bottomOfGallery") === null
        ? false
        : document.getElementById("bottomOfGallery").getBoundingClientRect().y -
            100 <=
            visible;
    },
    loadMoreImages() {
      if (this.imagesLoading) return;

      if (
        !this.$store.state.searchParameters.images.allowPaging ||
        this.noMoreResults
      ) {
        this.imagesLoading = false;
        return;
      }
      this.imagesLoading = true;
      let query = this.$parent.isHigherTaxon(this.$parent.taxon.rank__rank_en)
        ? fetchImages(
            this.$parent.taxon.hierarchy_string,
            this.$store.state.searchParameters,
          )
        : fetchAttachment(
            this.$parent.taxon.hierarchy_string,
            this.$store.state.searchParameters,
          );

      query.then((response) => {
        // Todo: if selected images more than the number of pagenatedBy
        if (this.$parent.isDefinedAndNotEmpty(response)) {
          this.$parent.images = this.$parent.images.concat(
            this.$parent.composeImageRequest(response.results),
          );
        } else {
          this.noMoreResults = true;
        }
        //solr do not return count
        if (response.count) {
          this.$store.state.searchParameters.images.allowPaging =
            this.$parent.isAllowedMorePaging(
              this.$store.state.searchParameters.images.page,
              response,
              this.$store.state.searchParameters.images.paginateBy,
            );
        } else {
          this.$store.state.searchParameters.images.page =
            this.$store.state.searchParameters.images.page + 1;
        }

        this.imagesLoading = false;
      });
    },
    triggerFirstScroll() {
      window.scrollTo(0, 1);
    },
  },
};
</script>

<style scoped>
/* galeriid ümbritsev stiil */
.photogallery {
  /*display:inline-block;*/
  background-color: #000; /* eeldusel et enamik pilte on mustal taustal */
  -moz-border-radius: 6px;
  -webkit-border-radius: 6px;
  border-radius: 6px;
  padding: 5px;
  margin: 0;
  /*max-height: 400px;*/
  overflow: auto;
}

.photogallery h3 {
  color: #fff;
  padding-bottom: 8px;
  text-shadow: none;
  font-size: 0.9em;
}
</style>
