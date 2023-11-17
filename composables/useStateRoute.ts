import type { RouteLocation } from "vue-router";
import type { RouteLocationRaw } from "vue-router";
import { useRootStore } from "~/stores/root";

export function useStateRoute() {
  const route = useRoute();
  const router = useRouter();
  const { locale } = useI18n();
  const store = useRootStore();
  return (to: RouteLocationRaw): RouteLocation => {
    const resolved = router.resolve(to);

    return {
      ...resolved,
      query: { ...route.query, lang: locale.value, mode: store.mode },
    };
  };
}
