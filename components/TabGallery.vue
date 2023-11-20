<template>
  <div id="#tab-gallery" role="tabpanel">
    <div
      class="inline-block space-x-2 space-y-2 bg-gray-200 dark:bg-gray-800 space-2 p-2 rounded"
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
    <div v-if="state.loading" class="flex items-center">
      <svg
        aria-hidden="true"
        class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="p-2">{{ $t("messages.pageLoading") }}</span>
    </div>
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
        imageName: el.taxon_names.split("|")[0],
        infoId: el.specimen,
        imageId: el.id,
        navigateId: el.taxon_ids.split("|")[0],
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
        imageName: el.taxon_names.split("|")[0],
        infoId: el.specimen,
        imageId: el.id,
        navigateId: el.taxon_ids.split("|")[0],
      };
    default:
      break;
  }

  // if(this.isHigherTaxon(this.taxon.rank__rank_en)) {}
  text +=
    '<div><button type="button" class="bg-tomato-500 px-4 py-2 rounded-md text-lg font-bold" onclick="window.open(\'' +
    state.fossilsUrl +
    "/" +
    additionalInfo.navigateId +
    "?mode=in_baltoscandia&lang=en')\">Read more</button></div>";

  if (additionalInfo.infoId)
    infoBtn =
      '<button type="button" class="bg-blue-500 rounded-md px-4 py-2 font-bold" onclick="window.open(\'' +
      state.geocollectionUrl +
      "/specimen/" +
      additionalInfo.infoId +
      "')\">INFO</button>";
  if (additionalInfo.imageId)
    imgBtn =
      ' <button type="button" class="bg-gray-200 rounded-md px-4 py-2 text-black font-bold" onclick="window.open(\'' +
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
