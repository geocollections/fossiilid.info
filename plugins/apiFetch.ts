import { FetchOptions } from "ofetch";

export default defineNuxtPlugin((nuxtApp) => {
  const defaults: FetchOptions = {
    baseURL: "https://api.geocollections.info",
  };
  const apiFetch = $fetch.create(defaults);

  return {
    provide: {
      apiFetch,
    },
  };
});
