<template>
  <div id="lingallery">
    <div class="lingallery_thumbnails overflow-x-auto" v-if="showThumbnails">
      <div class="lingallery_thumbnails_content space-x-1 whitespace-nowrap">
        <template v-for="(item, index) in items" :key="index">
          <a
            class="inline-block"
            :aria-label="'image' + index"
            data-fancybox="gallery"
            :href="item.src"
            :data-caption="item.caption"
          >
            <img
              class="rounded border"
              :alt="item.src"
              style="height: 200px"
              :src="item.thumbnail"
            />
            <!--<img :alt="item.src" class="lazy"  data-sizes="(min-width: 20em) 35vw, 100vw" style="height: 200px;" :data-src="item.thumbnail" v-on="currentIndex !== index ? { click: () => handleImageClick(index) } : {}" :style="thumbnailStyle(index)">-->
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default defineNuxtComponent({
  name: "Lingallery",
  props: {
    items: {
      default: [
        {
          src: "https://picsum.photos/600/400/?image=0",
          thumbnail: "https://picsum.photos/64/64/?image=0",
          caption: "",
        },
      ],
    },
    startImage: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 600,
    },
    height: {
      type: Number,
      default: 600,
    },
    baseColor: {
      type: String,
      default: "#fff",
    },
    accentColor: {
      type: String,
      default: "#3498db",
    },
    textColor: {
      type: String,
      default: "#000",
    },
    responsive: {
      type: Boolean,
      default: false,
    },
    showThumbnails: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style scoped>
/*
     * Scrollbar styling
     */
.lingallery_thumbnails::-webkit-scrollbar {
  height: 6px;
}
.lingallery_thumbnails::-webkit-scrollbar-track {
  border-radius: 10px;
  background: #eaeaea;
}

.lingallery_thumbnails::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #b4b4b4;
}
.lingallery_thumbnails::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(100, 100, 100, 0.4);
}
</style>
