import { FetchOptions } from "ofetch";

export default defineNuxtPlugin((nuxtApp) => {
  const defaults: FetchOptions = {
    baseURL: "https://rwapi.geoloogia.info/api/v0/public",
  };
  const apiFetch = $fetch.create(defaults);

  const defaultsNew: FetchOptions = {
    baseURL: "https://rwapi.geoloogia.info/api/v1/public",
  };
  const apiFetchNew = $fetch.create(defaultsNew);

  const defaultsSolr: FetchOptions = {
    baseURL: "https://rwapi.geoloogia.info/api/v0/public/solr",
  };
  const solrFetch = $fetch.create(defaultsSolr);

  return {
    provide: {
      apiFetch,
      apiFetchNew,
      solrFetch,
    },
  };
});
