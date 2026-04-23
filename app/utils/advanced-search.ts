import type { Circle, Polygon, Rectangle } from "leaflet";
import Wkt from "wicket/wicket";

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
    pageSize: 10 | 25 | 50 | 100;
  };
  mapPaginateBy: number;
  mapDataResults: MapSearchResult[];
}

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

export function buildAutocompleteFilterSolrSearchValue(value: string) {
  const lowerFirstCh = value.charAt(0).toLowerCase();
  const upperFirstCh = value.charAt(0).toUpperCase();
  const str = value.substring(1).toLowerCase();
  return `/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`;
}

export function buildSearchFilterQuery(state: AdvancedSearchState) {
  const result = [];
  if (isDefinedAndNotNull(state.higherTaxon)) {
    result.push(
      `taxon_hierarchy:${state.higherTaxon!.hierarchy_string}*`,
    );
  }
  if (isDefinedAndNotNull(state.stratigraphy)) {
    result.push(
      `stratigraphy_hierarchy:${state.stratigraphy!.hierarchy_string}* OR global_stratigraphy_hierarchy:${state.stratigraphy!.hierarchy_string}*`,
    );
  }
  if (state.species !== "") {
    result.push(
      `taxon:${buildAutocompleteFilterSolrSearchValue(state.species)}`,
    );
  }
  if (state.author !== "") {
    result.push(
      `author_year:${buildAutocompleteFilterSolrSearchValue(state.author)}`,
    );
  }
  if (state.locality !== "") {
    result.push(
      `locality:${buildAutocompleteFilterSolrSearchValue(state.locality)} OR locality_en:${buildAutocompleteFilterSolrSearchValue(state.locality)}`,
    );
  }
  if (state.isOutcrop) {
    result.push("-locality:*puurauk");
  }

  return result;
}

export function getFilterQueryForWKT(polygon: string) {
  const coordsPairs = polygon.split(",");
  if (coordsPairs[0] === undefined || coordsPairs[1] === undefined) {
    return;
  }
  let reversedPairs = [] as string[];

  // second and fourth pairs' places are changed because solr getting error
  const firstLatCoord = coordsPairs[0].replace("POLYGON((", "").split(" ")[0]!;
  const secondLatCoord = coordsPairs[1].split(" ")[0]!;

  if (Number.parseFloat(firstLatCoord) <= Number.parseFloat(secondLatCoord)) {
    const coordsPairs_ = coordsPairs.slice(1, coordsPairs.length - 1);
    reversedPairs.push(coordsPairs[0]);
    reversedPairs = reversedPairs.concat(coordsPairs_.reverse());

    const lastPair = coordsPairs.at(-1);

    if (lastPair === undefined) {
      return;
    }

    reversedPairs.push(lastPair);
  }

  const changedWkt
    = reversedPairs.length > 0 ? reversedPairs.join(",") : coordsPairs.join(",");
  return `{!field f=latlong}isWithin(${changedWkt})`;
}

export function getFilterQueryForCircle(circle: Circle) {
  const latlng = circle.getLatLng();
  const radius = Math.round((circle.getRadius() / 1000) * 10) / 10; // convert to km (from m) and round to 1 decmial place
  return `{!geofilt sfield=latlong}&d=${radius}&pt=${latlng.lat},${latlng.lng}`;
}

export function getGeoParam(shape: Circle | Rectangle | Polygon) {
  if ("getRadius" in shape) {
    return getFilterQueryForCircle(shape);
  }
  else {
    const wkt = new Wkt.Wkt();
    const geojson = shape.toGeoJSON();
    const geostr = JSON.stringify(geojson);

    wkt.read(geostr);

    return getFilterQueryForWKT(wkt.write());
  }
}
