export interface Taxon {
  id: number;
  name: string;
  parent?: {
    id: number;
    name: string;
  };
  rank?: {
    rank: string;
    rank_en: string;
  };

  fossil_group?: {
    id: number;
    name: string;
  };
  is_fossil_group?: boolean;
  hierarchy_string?: string;
  author_year?: string;
  date_added?: string;
  date_changed?: string;
  stratigraphy_base?: {
    id: number;
    name: string;
    name_en: string;
    age_base?: number;
  };
  stratigraphy_top?: {
    id: number;
    name: string;
    name_en: string;
    age_top?: number;
  };
  tol_id?: number;
  eol_id?: number;
  nrm_id?: string;
  plutof_id?: number;
  pbdb_id?: number;
}

export interface TaxonPage {
  title: string;
  content: string;
  author_text?: string;
  date_text?: string;
  link_wikipedia?: string;
}
