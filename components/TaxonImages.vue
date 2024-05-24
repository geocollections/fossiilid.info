<script setup lang="ts">
const props = defineProps<{
  id: number;
}>();

const { data: images } = await useNewApiFetch<{
  results: any[];
  count: number;
}>(`/taxa/${props.id}/images/`);
const img = useImage();

const fossilsUrl = "https://fossiilid.info" as const;
const geocollectionUrl = "https://geocollections.info" as const;

function setFancyBoxCaption(el: any, type: string) {
  let text = "",
    infoBtn = "",
    imgBtn = "",
    additionalInfo: any = {};
  switch (type) {
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
        imageName: el.specimen
          ? el.database__acronym + " " + el.specimen
          : el.database__acronym + " " + el.id,
        infoId: el.specimen,
        imageId: el.id ? el.id : el.specimen_image_id,
        navigateId: el.link ? el.link : el.taxon_ids.split("|")[0],
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
    fossilsUrl +
    "/" +
    additionalInfo.navigateId +
    "?mode=in_baltoscandia&lang=en')\">Read more</button></div>";

  if (additionalInfo.infoId)
    infoBtn =
      '<button type="button" class="bg-blue-500 rounded-md px-4 py-2 font-bold" onclick="window.open(\'' +
      geocollectionUrl +
      "/specimen/" +
      additionalInfo.infoId +
      "')\">INFO</button>";
  if (additionalInfo.imageId)
    imgBtn =
      ' <button type="button" class="bg-gray-200 rounded-md px-4 py-2 text-black font-bold" onclick="window.open(\'' +
      geocollectionUrl +
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

function setImageType(el: any) {
  if (el.specimen_image_id || el.specimen_image_id === null) {
    return "non_higher_taxon";
  } else if (el.link_id || el.link_id === null) {
    return "selected_image";
  }
  return "higher_taxon";
}

function setImageSrc(el: any, type: string) {
  const res = { thumbnail: null as string | null, src: null as string | null };
  if (type === "higher_taxon") {
    res.thumbnail = img(
      el.filename,
      { size: "large" },
      { provider: "geocollections" },
    );
    res.src = img(
      el.filename,
      { size: "large" },
      { provider: "geocollections" },
    );
  } else if (type === "non_higher_taxon") {
    res.thumbnail = img(
      el.uuid_filename,
      { size: "large" },
      { provider: "geocollections" },
    );
    res.src = img(
      el.uuid_filename,
      { size: "large" },
      { provider: "geocollections" },
    );
  } else if (type === "selected_image") {
    res.thumbnail = img(
      el.filename,
      { size: "large" },
      { provider: "geocollections" },
    );
    res.src = img(
      el.filename,
      { size: "large" },
      { provider: "geocollections" },
    );
  }
  return res;
}
function buildGalleryImages(taxonImages: any[]) {
  if (taxonImages.length === 0) return [];
  return taxonImages.map((el) => {
    const type = setImageType(el);
    return {
      ...el,
      type,
      caption: setFancyBoxCaption(el, type),
      ...setImageSrc(el, type),
    };
  });
}
</script>

<template>
  <lingallery
    style="width: 100%"
    v-if="(images?.results.length ?? 0) > 0"
    :height="200"
    :items="buildGalleryImages(images?.results ?? [])"
  />
</template>
