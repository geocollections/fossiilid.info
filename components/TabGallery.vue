<template>
  <div
    id="#tab-gallery"
    class="tab-pane"
    :class="{ active: store.activeTab === 'gallery' }"
    role="tabpanel"
  >
    <transition name="fade">
      <div class="row m-1">
        <div class="col-lg-12 photogallery" style="width: 100%">
          <div
            v-for="(image, index) in state.images"
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
        <div v-if="state.imagesLoading">
          <spinner :show="state.imagesLoading"></spinner>
          <span class="p-2">{{ $t("messages.pageLoading") }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useRootStore } from "~/stores/root";
const props = defineProps({
  taxon: {
    type: Object,
    required: true,
  },
});
const state = reactive({
  geocollectionUrl: "http://geocollections.info",
  fossilsUrl: "https://fossiilid.info",
  kividUrl: "http://www.kivid.info",
  fileUrl: "https://files.geocollections.info",
  images: [] as any[],
  bottom: false,
  imagesLoading: false,
  noMoreResults: false,
  selectedImagesPage: 1,
  imagesPage: 1,
  paginateBy: 25,
});
const store = useRootStore();
const { $apiFetch } = useNuxtApp();
onMounted(() => {
  window.addEventListener("scroll", () => {
    state.bottom = bottomVisible();
  });
  loadMoreImages();
});
watch(
  () => state.bottom,
  (bottom) => {
    if (!bottom) return;
    loadMoreImages();
  }
);
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
  if (taxonImages === undefined || taxonImages.length === 0) return;
  if (taxonImages.length > 0) {
    taxonImages.forEach((el) => {
      el.type = setImageType(el);
      el = setImageSrc(el);
      el.caption = setFancyBoxCaption(el);
    });
    return taxonImages;
  }
  return [];
}
function bottomVisible() {
  const visible = document.documentElement.clientHeight;
  const bottomEl = document.getElementById("bottomOfGallery");
  return bottomEl === null
    ? false
    : bottomEl.getBoundingClientRect().bottom - 100 <= visible;
}
async function loadMoreImages() {
  if (state.imagesLoading) return;
  state.imagesLoading = true;
  if (!store.searchParameters.images.allowPaging || state.noMoreResults) {
    state.imagesLoading = false;
    return;
  }
  let response;
  if (store.searchParameters.selectedImages.allowPaging) {
    response = await $apiFetch<{ results: any[] }>(
      `/taxon/?sql=get_taxon_selected_images&keyword=${props.taxon.id}&page=${state.selectedImagesPage}&paginate_by=${state.paginateBy}&format=json`
    );

    if (response.results.length < 1) {
      store.searchParameters.selectedImages.allowPaging = false;
      state.imagesLoading = false;
      loadMoreImages();
    } else {
      state.images = state.images.concat(composeImageRequest(response.results));
      state.selectedImagesPage = state.selectedImagesPage + 1;
    }
  } else if (store.searchParameters.images.allowPaging) {
    response = await $apiFetch<{ results: any[] }>(
      `/taxon/?sql=get_taxon_images&keyword=${props.taxon.hierarchy_string}&page=${state.imagesPage}&paginate_by=${state.paginateBy}&format=json`
    );
    if (response.results.length < 1) {
      state.noMoreResults = true;
    } else {
      state.images = state.images.concat(composeImageRequest(response.results));
      state.imagesPage = state.imagesPage + 1;
    }
  }

  state.imagesLoading = false;
}
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
