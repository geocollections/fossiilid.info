import type { UseFetchOptions } from "nuxt/app";
import { defu } from "defu";

export function useApiFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
  const defaults: UseFetchOptions<T> = {
    baseURL: "https://rwapi.geoloogia.info/api/v0/public",
  };
  const params = defu(options, defaults);

  return useFetch(url, params);
}

export function useNewApiFetch<T>(
  url: string,
  options: UseFetchOptions<T> = {},
) {
  const defaults: UseFetchOptions<T> = {
    baseURL: "https://rwapi.geoloogia.info/api/v1/public",
  };
  const params = defu(options, defaults);

  return useFetch(url, params);
}
