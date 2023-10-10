<template>
  <button class="btn btn-link" @click="order($props.value)">
    <span>{{ $t($props.name) }}</span>
    <span
      v-show="
        searchParameters.specimens.sortBy === localizePredicate($props.value) &&
        searchParameters.specimens.sortByAsc
      "
    >
      &darr;
    </span>
    <span
      v-show="
        searchParameters.specimens.sortBy === localizePredicate($props.value) &&
        !searchParameters.specimens.sortByAsc
      "
    >
      &uarr;
    </span>
  </button>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { useRootStore } from "~/stores/root";
export default {
  name: "SortField",
  data() {
    return {
      predicate: null,
    };
  },
  props: ["value", "name"],
  computed: {
    ...mapWritableState(useRootStore, ["searchParameters"]),
    ...mapState(useRootStore, ["lang"]),
  },
  methods: {
    order: function (predicate) {
      predicate = this.localizePredicate(predicate);
      let searchParameters = {
        page: 1,
        paginateBy: this.searchParameters.specimens.paginateBy,
        sortByAsc:
          this.searchParameters.specimens.sortBy === predicate
            ? !this.searchParameters.specimens.sortByAsc
            : true,
        sortBy: predicate,
        order: !this.searchParameters.specimens.sortByAsc
          ? "ASCENDING"
          : "DESCENDING",
      };
      //DO not have any effect ???
      // this.$store.commit('SET_SPECIMEN_SEARCH_PARAMS', {searchParameters})
      this.searchParameters.specimens = searchParameters;
    },
    localizePredicate(predicate) {
      let tokens = predicate.split(",");
      if (tokens.length === 1) return predicate;
      let value_et = tokens[0],
        value_en = tokens[1];
      return this.lang === "et" ? value_et : value_en;
    },
  },
};
</script>

<style scoped></style>
