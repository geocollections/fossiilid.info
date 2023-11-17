import { defineStore } from "pinia";

export const useRootStore = defineStore("root", {
  state: () => {
    return {
      mode: "in_baltoscandia",
      searchParameters: {
        species: { page: 1, paginateBy: 20 },
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
