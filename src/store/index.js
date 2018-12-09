import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import VueCookies from 'vue-cookies'
Vue.use(Vuex)
Vue.use(VueCookies)
export function createStore () {

  return new Vuex.Store({
    state: {
      process: 'server',
      activeTab: 'overview',
      itemsPerPage: 20,
      items: {/* [id: number]: Item */},
      lang: 'en',
      mode: 'in_baltoscandia',
      frontPage: {},
      page: {/* [id: string]: User */},
      activeItem: {
        taxon : {},
        commonNames : []
      },
      lists: {
        ranks: []
      },
      searchParameters: {
          selectedImages: { page: 1, paginateBy: 100 },
          images: { page: 1, paginateBy: 20, allowPaging: true },
          species: { page: 1, paginateBy: 20 },
          advancedSearch: { page: 1, paginateBy: 100 },
          specimens: { page: 1, paginateBy: 10, sortBy: 'specimen_number',  sortByAsc: true, order: "ASCENDING"},
      },
    },
    actions,
    mutations,
    getters
  })
}
