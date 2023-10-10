<template>
  <div
    id="#tab-gallery"
    class="tab-pane"
    :class="{ active: activeTab === 'gallery' }"
    role="tabpanel"
  >
    <transition name="fade">
      <div class="row m-1" v-if="!$parent.imagesLoading">
        <div class="col-lg-12 photogallery" style="width: 100%">
          <div
            v-for="(image, index) in $parent.images"
            style="float: left; position: relative"
            class="image_highlight"
            :key="index"
          >
            <a
              v-if="image.src"
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
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { fetchImages, fetchSelectedImages } from "../../api";
import Spinner from "../Spinner.vue";
import { useRootStore } from "~/stores/root";

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
          this.loadMoreImages();
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapWritableState(useRootStore, ["searchParameters"]),
    ...mapState(useRootStore, ["activeTab"]),
  },
  methods: {
    bottomVisible() {
      const visible = document.documentElement.clientHeight;
      return document.getElementById("bottomOfGallery") === null
        ? false
        : document.getElementById("bottomOfGallery").getBoundingClientRect()
            .bottom -
            100 <=
            visible;
    },
    loadMoreImages() {
      if (this.imagesLoading) return;
      this.imagesLoading = true;
      if (
        this.searchParameters.images.allowPaging === false ||
        this.noMoreResults
      ) {
        this.imagesLoading = false;
        return;
      }
      let query;
      if (this.searchParameters.selectedImages.allowPaging === true) {
        query = $fetch(
          `/taxon/?sql=get_taxon_selected_images&keyword=${this.$parent.taxon.id}&page=${this.searchParameters.selectedImages.page}&paginate_by=${this.searchParameters.selectedImages.paginateBy}&format=json`,

          { baseURL: "https://api.geocollections.info" },
        );
      } else if (this.searchParameters.images.allowPaging) {
        query = $fetch(
          `/taxon/?sql=get_taxon_images&keyword=${this.$parent.taxon.hierarchy_string}&page=${this.searchParameters.images.page}&paginate_by=${this.searchParameters.images.paginateBy}&format=json`,
          { baseURL: "https://api.geocollections.info" },
        );
      }

      //67033
      query.then((response) => {
        if (response && response.results && response.results.length > 0) {
          this.$parent.images = this.$parent.images.concat(
            this.$parent.composeImageRequest(response.results),
          );
        } else {
          if (this.searchParameters.selectedImages.allowPaging) {
            this.searchParameters.selectedImages.allowPaging = false;
          } else {
            this.noMoreResults = true;
          }
        }
        if (this.searchParameters.selectedImages.allowPaging) {
          this.searchParameters.selectedImages.page =
            this.searchParameters.selectedImages.page + 1;
        } else {
          this.searchParameters.images.page =
            this.searchParameters.images.page + 1;
        }

        this.imagesLoading = false;
      });
    },
    triggerFirstScroll() {
      window.scrollTo(0, 250);
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
}

.photogallery h3 {
  color: #fff;
  padding-bottom: 8px;
  text-shadow: none;
  font-size: 0.9em;
}
</style>
