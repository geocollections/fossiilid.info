import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

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
          watched: {
              page: 1,
              paginateBy: 10
          },
      },
    },
    actions,
    mutations,
    getters
  })
}
