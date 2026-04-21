import { defineProvider } from "@nuxt/image/runtime";
import { joinURL } from "ufo";

export default defineProvider({
  getImage(
    src: string,
    { modifiers, baseURL } = {},
    _ctx,
  ) {
    if (isDefinedAndNotNull(modifiers)) {
      const { size } = modifiers;
      return {
        url: joinURL(baseURL as string, size as string, src),
      };
    }
    return {
      url: joinURL(baseURL as string, src),
    };
  },
});
