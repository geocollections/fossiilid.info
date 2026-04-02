import { joinURL } from "ufo";
import { defineProvider } from "@nuxt/image/runtime";

export default defineProvider({ 
	getImage (
	  src: string,
	  { modifiers, baseURL } = {},
	  _ctx,
	) {
	  if (modifiers) {
		const { size } = modifiers;
		return {
		  url: joinURL(baseURL as string, size as string, src),
		};
	  }
	  return {
		url: joinURL(baseURL as string, src),
	  };
	}
});