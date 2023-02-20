<template>
  <section class="container-fluid mt-2">
    <div class="card" v-if="content">
      <span class="card-body" v-html="currentContent"></span>
    </div>
  </section>
</template>

<script>

export default {
  name: 'static-page',
   computed: {
       content () {
         const page = this.$store.state.page[this.$route.params.id]
         if (page && page.length > 0) return page[0]
       },
       currentContent () {
           return this.$store.state.lang === 'et'
               ? this.content && this.content.content_et
               : this.content && this.content.content_en
       },
       meta () {
           return [this.content && this.content.menu_title_et, this.content && this.content.title_et].join(", ")
       }
  },

  created() {
    if (!this.content) {
      this.$router.push('/')
    }
  },

  asyncData ({ store, route : {params: { id }}}) {
     return store.dispatch('FETCH_PAGE', { id })
  },

  metaInfo () {
    return {
        title : (this.content && this.content.menu_title_et) || 'Fossiilid',
        meta:  [{ vmid: 'keywords', name: 'keywords', content: this.meta}]
    }
  }

}


</script>
