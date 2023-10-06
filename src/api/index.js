import Vue from 'vue';
import VueResource from 'vue-resource';
import 'regenerator-runtime/runtime'

Vue.use(VueResource);
const logRequests = !!process.env.DEBUG_API;

const api = {
  url: 'https://api.geocollections.info/'
};

async function fetchRequest (child) {
    let results = {
        count: 0,
        results: []
    }
    try {
        const res = await Vue.http.get(api.url + child)
        results = res.body
    } catch (err) {
        console.log('ERROR: ', err);
        results = Object.assign(results, err)
    }
    return results
}
function applyMode(mode, separator = '=', queryJoiner = '&') {
    let returnVal = "";
    if(mode === 'in_baltoscandia') returnVal = `${queryJoiner}in_baltoscandia${separator}1`;
    else if (mode === 'in_estonia') returnVal = `${queryJoiner}in_estonia${separator}1`;
    return returnVal
}

export function fetchStaticPage (id) {
  return fetchRequest(`webpages/?id=${id}&format=json`)
}

export function fetchFrontPage (lang) {
    if (lang === 'se') {
        return fetchRequest(`taxon_page/?language=sv&on_frontpage=1&order_by=frontpage_order&fields=frontpage,taxon,taxon__taxon&format=json`)
    } else {
        return fetchRequest(`taxon_page/?language=${lang}&on_frontpage=1&order_by=frontpage_order&fields=frontpage,taxon,taxon__taxon&format=json`)
    }
}

/* Item page request */
export function fetchTaxon (id) {
    return fetchRequest(`taxon/?id=${id}&fields=id,taxon,parent,parent__taxon,rank__rank,rank__rank_en,fossil_group__id,is_fossil_group,fossil_group__taxon,hierarchy_string,author_year,date_added,date_changed,stratigraphy_base__stratigraphy,stratigraphy_base_id,stratigraphy_top_id,stratigraphy_base__age_base,stratigraphy_top__age_top,stratigraphy_top__stratigraphy,taxon_id_tol,taxon_id_eol,taxon_id_nrm,taxon_id_plutof,taxon_id_pbdb&format=json`)
}
export function fetchParentTaxon (id) {
    return fetchRequest(`taxon/?id=${id}&fields=id,taxon,rank__rank_en&format=json`)
}

export function fetchSisterTaxa (id, mode) {
    let returningFields = "id,taxon,parent__taxon,parent_id,rank__rank_en,rank__rank";
    let mode_ = applyMode(mode);
    return fetchRequest(`taxon/?parent_id=${id}${mode_}&fields=${returningFields}&format=json`)
}

export function fetchSpecies (hierarchy_string,mode,searchParameters) {
    let mode_ = applyMode(mode);
    return fetchRequest(`taxon/?hierarchy_string__istartswith=${hierarchy_string}&rank__rank_en=species${mode_}&order_by=taxon&fields=taxon,author_year,id,stratigraphy_base__stratigraphy_en,stratigraphy_base__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_top__stratigraphy&page=${searchParameters.species.page}&paginate_by=${searchParameters.species.paginateBy}&format=json`)
}

export function fetchHierarchy (hierarchy_string) {
    return fetchRequest(`taxon/?id__in=${hierarchy_string}&fields=id,taxon,rank__rank,rank__rank_en&format=json`)
}

export function fetchChildren (id, mode) {
    let returningFields = "id,taxon,parent__taxon,parent_id,rank__rank_en,rank__rank";
    let mode_ = applyMode(mode);
    return fetchRequest(`taxon/?parent=${id}${mode_}&fields=${returningFields}&format=json`)
}
export function fetchSelectedImages (id,searchParameters) {
    return fetchRequest(`taxon/?sql=get_taxon_selected_images&keyword=${id}&page=${searchParameters.selectedImages.page}&paginate_by=${searchParameters.selectedImages.paginateBy}&format=json`)
}
export function fetchImages (hierarchy_string,searchParameters) {
    return fetchRequest(`taxon/?sql=get_taxon_images&keyword=${hierarchy_string}&page=${searchParameters.images.page}&paginate_by=${searchParameters.images.paginateBy}&format=json`)
}

export function fetchTaxonPages (id,lang) {
    return fetchRequest(`taxon_page/?taxon=${id}&language=${lang}&fields=content,author_txt,date_txt,link_wikipedia,title&format=json`)
}

export function fetchTaxonDescription (id) {
    return fetchRequest(`taxon_description/?taxon=${id}&fields=reference,reference__reference,description&order_by=-reference__year&format=json`)
}

export function fetchTaxonCommonName (id) {
    return fetchRequest(`taxon_common_name/?taxon=${id}&is_preferred=1&fields=language,name,is_preferred&format=json`)
}

export function fetchTaxonList (id) {
    return fetchRequest(`taxon_list/?taxon=${id}&format=json`)
}

export function fetchTaxonOccurrence (name) {
    return fetchRequest(`taxon_occurrence/?taxon__taxon__icontains=${name}&fields=reference,reference__reference,locality__locality,locality__locality_en,depth_interval,depth,stratigraphy_base__stratigraphy,stratigraphy_base__stratigraphy_en&format=json`)
}
export function fetchReferences (hierarchy_string) {
    return fetchRequest(`taxon_occurrence/?taxon__hierarchy_string__istartswith=${hierarchy_string}&reference!=null&order_by=-reference__year&fields=reference,reference__reference,reference__author,reference__year,reference__title,reference__journal__journal_name,reference__book,reference__volume,reference__number,reference__pages,reference__doi&distinct=true&format=json`)
}
export function fetchReferences2 (hierarchy_string) {
    return fetchRequest(`specimen_identification/?taxon__hierarchy_string__istartswith=${hierarchy_string}&reference!=null&order_by=-reference__year&fields=reference,reference__reference,reference__author,reference__year,reference__title,reference__journal__journal_name,reference__book,reference__volume,reference__number,reference__pages,reference__doi&distinct=true&format=json`)
}
export function fetchSynonims (id) {
    return fetchRequest(`taxon_synonym/?taxon=${id}&order_by=year&format=json`)
}

export function fetchTypeSpecimen (id) {
    return fetchRequest(`taxon_type_specimen/?taxon=${id}&format=json`)
}

export function fetchDistributionSamples (name) {
    return fetchRequest(`taxon/?sql=get_species_distribution_sample&keyword=${name}&format=json`)
}
export function fetchDistributionConop (name) {
    return fetchRequest(`taxon/?sql=get_species_distribution_conop&keyword=${name}&format=json`)
}

export function fetchSpeciesMap (taxon_hierarchy,mode) {
    let mode_ =  mode === 'in_global' ? `` : `${applyMode(mode,':', ' AND ')}`
    return fetchRequest(`solr/taxon_search/?q=taxon_hierarchy:${taxon_hierarchy}*${mode_}&fq=%7B%21collapse%20field--locality%7D&fq=rank:[14%20TO%2017]&sort=fossil_group asc,taxon asc&rows=1000&start=0&fl=src,locality,locality_en,locality_id,latlong&format=json`)
}

export function fetchSpecimenIdentification (taxon) {
    return fetchRequest(`specimen/?specimenidentification__name__icontains=${taxon}&fields=id,locality_id,locality__locality,locality__locality_en,locality__longitude,locality__latitude&format=json`)
}

export function fetchNumberOfSpecimenIdentifications (id) {
    return fetchRequest(`specimen_identification/?taxon_id=${id}&fields=id&page=1&paginate_by=1&format=json`)
}

export function fetchAttachment (hierarchy_string,searchParameters) {
    let applyPaging = searchParameters.images.allowPaging ? '&page='+searchParameters.images.page+'&paginate_by='+searchParameters.images.paginateBy : ''
    return fetchRequest(`attachment/?specimen__specimenidentification__taxon__hierarchy_string__istartswith=${hierarchy_string}&fields=id,specimen_id,specimen__specimen_id,specimen_image_id,database__acronym,uuid_filename,specimen__specimenidentification__taxon__id&format=json&distinct=true&order_by=stars${applyPaging}`)
}

export function fetchRanks () {
    return fetchRequest(`taxon_rank/?order_by=sort&format=json`)
}

export function cntSpecimenCollection(hierarchy_string) {
     return fetchRequest(`solr/specimen/?q=hierarchy_string:(${hierarchy_string}*)&rows=1&format=json`)
}

export function fetchSpecimenCollection(hierarchy_string,searchParameters) {
    let start = searchParameters.specimens.paginateBy*(searchParameters.specimens.page-1);
    let orderBy = searchParameters.specimens.order === 'ASCENDING' ? searchParameters.specimens.sortBy + ' asc': searchParameters.specimens.sortBy + ' desc';
    return fetchRequest(`solr/specimen/?q=hierarchy_string:(${hierarchy_string}*)&rows=${searchParameters.specimens.paginateBy}&start=${start}&sort=${orderBy}&format=json`)
}

export function fetchSimpleTaxonSearch (value) {
    return fetchRequest(`taxon/?sql=simple_taxon_search&keyword=${value}&format=json`)
}

export function fetchSpeciesCountInArea (geoparams) {
    return fetchRequest(`solr/taxon_search/?${geoparams}q=rank:[14%20TO%2017]&fl=taxon&rows=1&format=json`)
}

export function fetchAdvancedTaxonSearch (query,searchParameters, isMapData = false) {
    let start = searchParameters.advancedSearch.paginateBy*(searchParameters.advancedSearch.page-1);
    let fq = isMapData ? `fq=%7B%21collapse%20field--locality%7D` : `fq=%7B%21collapse%20field--taxon%7D`;
    let fl = isMapData ? `fl=locality_en,locality_id,locality,latlong,src` : `fl=taxon,taxon_id,author_year,fossil_group,fossil_group_id,fad,fad_en,fad_id,lad,lad_en,lad_id,locality_en,locality_id,locality,latlong,src`
    return fetchRequest(`solr/taxon_search/?${query}${fq}&fq=rank:[14%20TO%2017]&sort=fossil_group asc,taxon asc&rows=${isMapData ? searchParameters.advancedSearch.madDataPaginateBy : searchParameters.advancedSearch.paginateBy}&start=${start}&${fl}&format=json`)
}

export function fetchAutocompleteSearch (query) {
    return fetchRequest(`solr/taxon/?fq=${query}&sort=taxon asc&rows=30&fl=taxon,taxon_id,hierarchy_string&format=json`)
}
export function fetchAutocompleteSearchStratigraphy (query) {
    return fetchRequest(`solr/stratigraphy/?fq=${query}&sort=stratigraphy asc&rows=30&fl=stratigraphy,stratigraphy_en,id,hierarchy_string&fq=type:1&format=json`)
}
export function fetchOpinion (id) {
    return fetchRequest(`taxon_opinion/?taxon=${id}&order_by=-reference__year&format=json`)
}
