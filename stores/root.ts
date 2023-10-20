import { defineStore } from "pinia";

export const useRootStore = defineStore("root", {
  state: () => {
    return {
      errorMessage: null as string | null,
      activeTab: "overview",
      lang: "en",
      mode: "in_baltoscandia",
      searchParameters: {
        selectedImages: { page: 1, paginateBy: 30, allowPaging: true },
        images: { page: 1, paginateBy: 20, allowPaging: true },
        species: { page: 1, paginateBy: 20 },
        advancedSearch: { page: 1, paginateBy: 100, madDataPaginateBy: 1000 },
        specimens: {
          page: 1,
          paginateBy: 10,
          sortBy: "specimen_number",
          sortByAsc: true,
          order: "ASCENDING",
        },
      },
    };
  },
  persist: {
    paths: ["mode"],
  },
});
