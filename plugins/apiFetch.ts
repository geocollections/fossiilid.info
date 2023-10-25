import { FetchOptions } from "ofetch";

export default defineNuxtPlugin((nuxtApp) => {
  const defaults: FetchOptions = {
    baseURL: "http://api0.geocollections.info",
  };
  const apiFetch = $fetch.create(defaults);

  return {
    provide: {
      apiFetch,
    },
  };
});
