import type { RouteLocation, RouteLocationRaw } from "vue-router";
import { useRootStore } from "~/stores/root";

export function useStateRoute() {
  const route = useRoute();
  const router = useRouter();
  const store = useRootStore();
  return (to: RouteLocationRaw): RouteLocation => {
    const resolved = router.resolve(to);

    if (route.query.mode) {
      return {
        ...resolved,
        query: route.query,
      };
    }

    return {
      ...resolved,
      query: { ...route.query, mode: store.mode },
    };
  };
}
