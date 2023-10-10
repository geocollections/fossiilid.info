<template>
  <ul style="padding-left: 0 !important">
    <li style="list-style-type: none">
      <table v-if="ranks.length > 0">
        <tbody class="hierarchy_tree">
          <tr v-for="item in taxonomicTree.nodes">
            <td
              v-if="isHigherRank(item.rank_en) || item.id === taxon.id"
              align="right"
              valign="top"
              style="color: #999"
              v-translate="{ et: item.rank, en: item.rank_en }"
            ></td>
            <td v-else></td>
            <td
              :class="$parent.isHigherTaxon(item.rank_en) ? '' : 'font-italic'"
            >
              <span v-for="i in convertToNumber(item.i)">&ensp;</span>
              <a :href="'/' + item.id" v-if="item.id !== taxon.id">
                {{ item.label }}
              </a>
              <span class="node_in_tree_selected" v-if="item.id === taxon.id">
                {{ item.label }}
              </span>
              <ul v-for="sibling in item.siblings">
                <li style="list-style-type: none">
                  <span v-for="j in convertToNumber(item.i) - 2">&ensp;</span>
                  <a :href="'/' + sibling.id">{{ sibling.label }}</a>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </li>
  </ul>
</template>

<script>
import { useRootStore } from "~/stores/root";
import { mapState } from "pinia";
import _ from "lodash";

export default {
  name: "taxonomical-tree",
  props: {
    lists: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      parent: {},
      sortedSisters: {},
      sortedSistersWithoutCurrentTaxon: {},
      taxon: {},
      taxonomicTree: { nodes: [] },
      ranks: [],
    };
  },

  watch: {
    mode: {
      handler: function (mode) {
        if (mode) {
          // re-render component
          //Temporary hack since this.$nextTick still cannot ensure all the sub components rendered.
          setTimeout(this.waitUntilParentComponentDataComputed, 100);
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(useRootStore, ["mode"]),
    nodes() {
      return this.taxonomicTree.nodes;
    },
  },
  created() {
    this.composeData();
    this.composeTaxonomicTree_();
  },

  methods: {
    waitUntilParentComponentDataComputed: function () {
      this.composeData();
      this.composeTaxonomicTree_();
    },
    composeData: function () {
      this.taxonomicTree = { nodes: [] };
      this.sortedSisters = this.$parent.sortedSisters;
      this.parent = this.$parent.parent;
      this.taxon = this.$parent.taxon;
      this.hierarchy = this.$parent.hierarchy;
      this.sortedSiblings = this.$parent.sortedSiblings;
      this.ranks = this.getHigherRanks(this.taxon.rank__rank_en);
      this.sortedSistersWithoutCurrentTaxon =
        this.$parent.sortedSistersWithoutCurrentTaxon;
    },
    addHierarchy: function (filteredList, sisterIds) {
      for (let idx in filteredList) {
        let node = {
          i: idx,
          rank: filteredList[idx].rank__rank,
          rank_en: filteredList[idx].rank__rank_en,
          label: filteredList[idx].taxon,
          id: filteredList[idx].id,
          siblings: [],
        };
        if (!(sisterIds.indexOf(filteredList[idx].id) >= 0))
          // if(!sisterIds.includes(filteredList[idx].id))
          this.taxonomicTree.nodes.push(node);
      }
    },
    addSisters: function (level) {
      for (let idx in this.sortedSisters) {
        let node = {
          i: level,
          rank: this.sortedSisters[idx].rank__rank,
          rank_en: this.sortedSisters[idx].rank__rank_en,
          label: this.formatName(this.sortedSisters[idx], this.parent),
          id: this.sortedSisters[idx].id,
          siblings: [],
        };
        if (this.sortedSisters[idx].id === this.taxon.id) {
          this.addSiblingsIfExists(node);
        }
        this.taxonomicTree.nodes.push(node);
      }
    },
    //reorder hierarchy according to hierarchy string
    reorderHierarchy: function () {
      if (this.$parent.taxon.hierarchy_string === undefined) return;
      let newArr = [];
      let hierarchyIds = this.$parent.taxon.hierarchy_string.split("-");
      for (let i in hierarchyIds) {
        for (let idx in this.hierarchy) {
          if (
            this.convertToNumber(hierarchyIds[i]) === this.hierarchy[idx].id
          ) {
            newArr.push(this.hierarchy[idx]);
          }
        }
      }
      return newArr;
    },
    composeTaxonomicTree_: function () {
      let hierarchy = this.reorderHierarchy();
      if (hierarchy === undefined) return;
      let level = hierarchy.length;
      let sisterIds = Array.from(this.sortedSisters.map((item) => item.id));
      this.addHierarchy(hierarchy, sisterIds);
      this.addSisters(level);
      this.tableUpdated = true;
    },

    formatName: function (taxon, parent) {
      if (parent.label)
        return _.includes(taxon.taxon, taxon.parent__taxon) &&
          taxon.taxon.split(" ").length > 1
          ? taxon.taxon.replace(taxon.parent__taxon, "")
          : taxon.taxon;
      return _.includes(taxon.taxon, parent.taxon) &&
        taxon.taxon.split(" ").length > 1
        ? taxon.taxon.replace(parent.taxon, "")
        : taxon.taxon;
    },
    addSiblingsIfExists: function (parent_node) {
      if (this.isDefinedAndNotEmpty(this.sortedSiblings)) {
        for (let idx1 in this.sortedSiblings) {
          if (parent_node.id === this.sortedSiblings[idx1].parent_id) {
            parent_node.siblings.push({
              j: idx1,
              rank: this.sortedSiblings[idx1].rank__rank,
              rank_en: this.sortedSiblings[idx1].rank__rank_en,
              label: this.formatName(this.sortedSiblings[idx1], parent_node),
              id: this.sortedSiblings[idx1].id,
            });
          }
        }
      }
    },

    convertToNumber: function (str) {
      return parseInt(str);
    },
    isDefinedAndNotEmpty(value) {
      return !!value && value.length > 0;
    },
    getHigherRanks(currentTaxonRank) {
      let rank_ = _.find(this.lists.ranks, function (o) {
        return currentTaxonRank === o.rank_en;
      });
      return _.map(
        _.filter(this.lists.ranks, function (o) {
          return rank_.sort > o.sort;
        }),
        "rank_en",
      );
    },
    isHigherRank(rank) {
      return this.ranks.indexOf(rank) >= 0;
      // return this.ranks.includes(rank)
    },
  },
};
</script>
