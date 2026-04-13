import type { Circle, Polygon, Rectangle } from "leaflet";
// @ts-expect-error no types for this package
import Wkt from "wicket/wicket";

export const buildAutocompleteFilterSolrSearchValue = (value: string) => {
  const lowerFirstCh = value.charAt(0).toLowerCase();
  const upperFirstCh = value.charAt(0).toUpperCase();
  const str = value.substring(1).toLowerCase();
  return `/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`;
};

export const buildSearchFilterQuery = (store?: any) => {
  const result = [];
  if (store.higherTaxon) {
    result.push(`taxon_hierarchy:${store.higherTaxon.hierarchy_string}*`);
  }
  if (store.stratigraphy) {
    result.push(
      `stratigraphy_hierarchy:${store.stratigraphy.hierarchy_string}* OR global_stratigraphy_hierarchy:${store.stratigraphy.hierarchy_string}*`,
    );
  }
  if (store.species) {
    result.push(
      `taxon:${buildAutocompleteFilterSolrSearchValue(store.species)}`,
    );
  }
  if (store.author) {
    result.push(
      `author_year:${buildAutocompleteFilterSolrSearchValue(store.author)}`,
    );
  }
  if (store.locality) {
    result.push(
      `locality:${buildAutocompleteFilterSolrSearchValue(
        store.locality,
      )} OR locality_en:${buildAutocompleteFilterSolrSearchValue(store.locality)}`,
    );
  }
  if (store.isOutcrop) result.push("-locality:*puurauk");

  return result;
};

export const getFilterQueryForWKT = (polygon: string) => {
  const coordsPairs = polygon.split(",");
  let reversedPairs = [] as string[];

  // second and fourth pairs' places are changed because solr getting error
  const firstLatCoord = coordsPairs[0].replace("POLYGON((", "").split(" ")[0];
  const secondLatCoord = coordsPairs[1].split(" ")[0];

  if (Number.parseFloat(firstLatCoord) <= Number.parseFloat(secondLatCoord)) {
    const coordsPairs_ = coordsPairs.slice(1, coordsPairs.length - 1);
    reversedPairs.push(coordsPairs[0]);
    reversedPairs = reversedPairs.concat(coordsPairs_.reverse());
    reversedPairs.push(coordsPairs[coordsPairs.length - 1]);
  }

  const changedWkt =
    reversedPairs.length > 0 ? reversedPairs.join(",") : coordsPairs.join(",");
  return `{!field f=latlong}isWithin(${changedWkt})`;
};

export const getFilterQueryForCircle = (circle: Circle) => {
  const latlng = circle.getLatLng();
  const radius = Math.round((circle.getRadius() / 1000) * 10) / 10; // convert to km (from m) and round to 1 decmial place
  return `{!geofilt sfield=latlong}&d=${radius}&pt=${latlng.lat},${latlng.lng}`;
};

export const getGeoParam = (shape: Circle | Rectangle | Polygon) => {
  if ("getRadius" in shape) {
    return getFilterQueryForCircle(shape);
  } else {
    const wkt = new Wkt.Wkt();
    const geojson = shape.toGeoJSON();
    const geostr = JSON.stringify(geojson);

    wkt.read(geostr);

    return getFilterQueryForWKT(wkt.write());
  }
};
