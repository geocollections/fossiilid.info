<template>
  <div id="#tab-gallery" role="tabpanel">
    <transition name="fade">
      <div class="row m-1">
        <div
          class="inline-block space-x-2 space-y-2 bg-gray-100 dark:bg-gray-800 space-2 p-2 rounded"
        >
          <div
            v-for="(image, index) in state.images"
            class="float-left"
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
        <div ref="bottom"></div>
        <div v-if="state.loading" class="d-flex align-center">
          <BSpinner variant="warning" style="width: 44px; height: 44px" />
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
  loading: false,
  noMoreResults: false,
  paginateBy: 25,
  page: 0,
});
const store = useRootStore();
const { $apiFetchNew } = useNuxtApp();

const bottom = ref();
const bottomIsVisible = useElementVisibility(bottom);

onMounted(async () => {
  await loadMoreImagesNew();
  if (bottomIsVisible.value) {
    await loadMoreImagesNew();
  }
});

watch(
  () => bottomIsVisible.value,
  (isVisible) => {
    if (!isVisible) return;
    loadMoreImagesNew();
  },
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
        imageName: el.taxon_name,
        infoId: el.specimen,
        imageId: el.id,
        navigateId: el.taxon,
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
        imageName: el.taxon_name,
        infoId: el.specimen,
        imageId: el.id,
        navigateId: el.taxon,
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

async function loadMoreImagesNew() {
  if (state.loading) return;
  state.loading = true;
  if (state.noMoreResults) {
    state.loading = false;
    return;
  }

  const response = await $apiFetchNew<{ results: any[]; next: string | null }>(
    `/taxa/${props.taxon.id}/images/`,
    {
      query: {
        limit: state.paginateBy,
        offset: state.page * state.paginateBy,
      },
    },
  );
  state.images = state.images.concat(composeImageRequest(response.results));
  state.page += 1;
  if (!response.next) {
    state.noMoreResults = true;
  }
  state.loading = false;
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
