import type { Map, Circle, Rectangle, Polygon } from "leaflet";
import { defineStore } from "pinia";

export interface AdvancedSearchState {
  higherTaxon: TaxonOption | undefined;
  species: string;
  author: string;
  locality: string;
  stratigraphy: StratigraphyOption | undefined;
  isOutcrop: boolean;
  isNearMe: boolean;
  nearMeRangeInKM: number;
  results: SearchResult[];
  numberOfResults: number;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  mapPaginateBy: number;
  mapDataResults: MapSearchResult[];
}

// Leaflet objects live outside Pinia — no reactivity whatsoever
let _map: Map | null = null;
let _selectedArea: Circle | Rectangle | Polygon | null = null;

export const useAdvancedSearchStore = defineStore("advancedSearch", {
  state: (): AdvancedSearchState => {
    return {
      higherTaxon: undefined,
      species: "",
      author: "",
      locality: "",
      stratigraphy: undefined,
      isOutcrop: false,
      isNearMe: false,
      nearMeRangeInKM: 5,
      results: [],
      numberOfResults: 0,
      pagination: {
        pageIndex: 1,
        pageSize: 14,
      },
      mapPaginateBy: 1000,
      mapDataResults: [],
    };
  },

  actions: {
    setSelectedArea(area: Circle | Rectangle | Polygon | null) {
      _selectedArea = area;
    },
    getSelectedArea() {
      return _selectedArea;
    },

    reset() {
      this.higherTaxon = undefined;
      this.species = "";
      this.author = "";
      this.locality = "";
      this.stratigraphy = undefined;
      this.isOutcrop = false;
      this.isNearMe = false;
      this.nearMeRangeInKM = 5;
      this.results = [];
      this.numberOfResults = 0;
      this.pagination = {
        pageIndex: 1,
        pageSize: 14,
      };
      this.mapDataResults = [];
    },
  },
});

export interface StratigraphyOption {
  id: number;
  stratigraphy?: string;
  stratigraphy_en?: string;
  hierarchy_string?: string;
}

export interface TaxonOption {
  id: number;
  taxon?: string;
  hierarchy_string?: string;
}

export interface SearchResult {
  id: number;
  taxon?: string;
  taxon_id: number;
  author_year?: string;
  fossil_group?: string;
  fossil_group_id?: number;
  fad?: string;
  fad_en?: string;
  fad_id?: number;
  lad?: string;
  lad_en?: string;
  lad_id?: number;
  locality_en?: string;
  locality_id?: number;
  locality?: string;
  latlong?: string;
  src?: number;
}

export interface MapSearchResult {
  locality_id?: number;
  locality_en?: string;
  locality?: string;
  latlong?: string;
  src?: number;
}
