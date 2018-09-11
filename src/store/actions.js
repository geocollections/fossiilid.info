import {
    fetchStaticPage,
    fetchFrontPage,
    fetchRanks,
    fetchTaxon,
    fetchTaxonCommonName,
    fetchTaxonPages,
    fetchTypeSpecimen,
    fetchAttachment,
    fetchSpecimenIdentification,
    fetchTaxonOccurrence, fetchChildren, fetchSynonims, fetchTaxonList, fetchTaxonDescription
} from '../api'

export default {

    FETCH_PAGE: ({ commit, state }, { id }) => {
        return state.page[id]
          ? Promise.resolve(state.page[id])
          : fetchStaticPage(id).then(page => commit('SET_PAGE', { id, page }))
    },

    FETCH_FRONT_PAGE: ({ commit, state }, { lang }) => {
      return state.frontPage[lang]
          ? Promise.resolve(state.frontPage[lang])
          : fetchFrontPage(lang).then(page => commit('SET_FRONT_PAGE', { lang, page }))
    },

    FETCH_RANKS: ({ commit, state }) => {
        return state.lists.ranks.length > 0
            ? Promise.resolve(state.lists.ranks)
            : fetchRanks().then(rank => commit('SET_RANK', { rank }))
    },

    FETCH_TAXON: ({ commit, state }, { id }) => {
        return fetchTaxon(id).then(taxon => commit('SET_TAXON', { taxon }))
    },

    FETCH_COMMON_NAMES: ({ commit, state }, { id }) => {
        return fetchTaxonCommonName(id).then(names => commit('SET_COMMON_NAMES', { names }))
    },

    FETCH_SPECIMEN_ATTACHMENT: ({ commit, state }, { id }) => {
        return fetchAttachment(id).then(images => commit('SET_SPECIMEN_ATTACHMENT', { images }))
    },

    FETCH_TYPE_SPECIMEN: ({ commit, state }, { id }) => {
        return fetchTypeSpecimen(id).then(typeSpecimen => commit('SET_TAXON_TYPE_SPECIMEN', { typeSpecimen }))
    },

    FETCH_TYPE_IDENTIFICATION: ({ commit, state }, { id }) => {
        return fetchSpecimenIdentification(id).then(specimenIdentification => commit('SET_SPECIMEN_IDENTIFICATION', { specimenIdentification }))
    },

    FETCH_TAXON_OCCURRENCE: ({ commit, state }, { id }) => {
        return fetchTaxonOccurrence(id).then(taxonOccurrence => commit('SET_TAXON_OCCURRENCE', { taxonOccurrence }))
    },

    FETCH_TAXON_PAGE: ({ commit, state }, { id }) => {
        return fetchTaxonPages(id).then(page => commit('SET_TAXON_PAGE', { page }))
    },

    FETCH_CHILDREN: ({ commit, state }, { id}) => {
        return fetchChildren(id, state.mode).then(children => commit('SET_CHILDREN', { children }))
    },

    FETCH_SYNONIMS: ({ commit, state }, { id}) => {
        return fetchSynonims(id).then(synonims => commit('SET_SYNONIMS', { synonims }))
    },

    FETCH_TAXON_LIST: ({ commit, state }, { id}) => {
        return fetchTaxonList(id).then(list => commit('SET_TAXON_LIST', { list }))
    },

    FETCH_DESCRIPTION: ({ commit, state }, { id}) => {
        return fetchTaxonDescription(id).then(description => commit('SET_DESCRIPTION', { description }))
    },
}