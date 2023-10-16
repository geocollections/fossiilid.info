import { UseFetchOptions } from "nuxt/app";
import { defu } from "defu";

export function useApiFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
  const defaults: UseFetchOptions<T> = {
    baseURL: "https://api.geocollections.info",
  };
  const params = defu(options, defaults);

  return useFetch(url, params);
}
