<template>
  <Head>
    <Title>
      {{ (content && content.menu_title_et) || "Fossiilid" }}
    </Title>
    <Meta vmid="keywords" name="keywords" :content="meta" />
  </Head>
  <section class="container-fluid my-5">
    <div class="card" v-if="content">
      <span class="card-body" v-html="currentContent"></span>
    </div>
  </section>
</template>

<script>
export default defineNuxtComponent({
  name: "static-page",
  computed: {
    content() {
      if (this.page && this.page.length > 0) return this.page[0];
    },
    currentContent() {
      return this.$i18n.locale === "et"
        ? this.content && this.content.content_et
        : this.content && this.content.content_en;
    },
    meta() {
      return [
        this.content && this.content.menu_title_et,
        this.content && this.content.title_et,
      ].join(", ");
    },
  },

  created() {
    if (!this.content) {
      this.$router.push("/");
    }
  },

  async asyncData({ $router }) {
    const id = $router.currentRoute._value.params.id;

    const pageRes = await $fetch(`webpages/?id=${id}&format=json`, {
      baseURL: "https://api.geocollections.info",
    });
    return {
      page: pageRes.results || false,
    };
  },

  metaInfo() {
    return {
      title: (this.content && this.content.menu_title_et) || "Fossiilid",
      meta: [{ vmid: "keywords", name: "keywords", content: this.meta }],
    };
  },
});
</script>
