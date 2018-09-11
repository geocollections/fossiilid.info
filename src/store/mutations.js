import Vue from 'vue'

export default {
    SET_LANG: (state, { lang }) => {
        Vue.set(state, 'lang', lang || false) /* false means page not found */
    },

    SET_MODE: (state, { mode }) => {
        Vue.set(state, 'mode', mode || false) /* false means page not found */
    },

  SET_PAGE: (state, { id, page }) => {
    Vue.set(state.page, id, page.results || false) /* false means page not found */
  },

  SET_FRONT_PAGE: (state, { lang, page }) => {
    Vue.set(state.frontPage, lang, page.results || false) /* false means user not found */
  },

  SET_RANK: (state, { rank }) => {
    Vue.set(state.lists, 'ranks', rank.results || false)
  },

  SET_TAXON: (state, { taxon }) => {
      Vue.set(state.activeItem, 'taxon', taxon.results[0] || false)
  },

  SET_COMMON_NAMES: (state, { names }) => {
      Vue.set(state.activeItem, 'commonNames', names.results || false)
  },

  SET_SPECIMEN_ATTACHMENT: (state, { images }) => {
      Vue.set(state.activeItem, 'attachment', images.results || false)
  },

  SET_TYPE_SPECIMEN: (state, { specimen }) => {
      Vue.set(state.activeItem, 'typeSpecimen', specimen.results || false)
  },

  SET_TAXON_TYPE_SPECIMEN: (state, { typeSpecimen }) => {
      Vue.set(state.activeItem, 'typeSpecimen', typeSpecimen.results || false)
  },

  SET_SPECIMEN_IDENTIFICATION: (state, { specimenIdentification }) => {
      Vue.set(state.activeItem, 'specimenIdentification', specimenIdentification.results || false)
  },
  SET_TAXON_OCCURRENCE: (state, { taxonOccurrence }) => {
      Vue.set(state.activeItem, 'taxonOccurrence', taxonOccurrence.results || false)
  },
  SET_CHILDREN: (state, { children }) => {
      Vue.set(state.activeItem, 'children', children.results || false)
  },

  SET_SYNONIMS: (state, { synonims }) => {
    Vue.set(state.activeItem, 'synonims', synonims.results || false)
  },
  SET_TAXON_LIST: (state, { list }) => {
    Vue.set(state.activeItem, 'taxonList', list.results || false)
  },
  SET_DESCRIPTION: (state, { description }) => {
    Vue.set(state.activeItem, 'description', description.results || false)
  },
  SET_TAXON_PAGE: (state, { page }) => {
      Vue.set(state.activeItem, 'taxonPage', page.results || false)
  },
}