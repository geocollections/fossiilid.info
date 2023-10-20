<template>
  <ul style="padding-left: 0 !important">
    <li style="list-style-type: none">
      <table v-if="ranks.length > 0">
        <tbody class="hierarchy_tree">
          <tr v-for="(item, idx) in taxonomicTree.nodes" :key="`node-${idx}`">
            <td
              v-if="isHigherRank(item.rank_en) || item.id === taxon.id"
              align="right"
              valign="top"
              style="color: #999"
              v-translate="{ et: item.rank, en: item.rank_en }"
            ></td>
            <td v-else></td>
            <td :class="isHigherTaxon(item.rank_en) ? '' : 'fst-italic'">
              <span v-for="i in convertToNumber(item.i)">&ensp;</span>
              <NuxtLink
                :to="{ path: `/${item.id}` }"
                v-if="item.id !== taxon.id"
              >
                {{ item.label }}
              </NuxtLink>
              <span class="node_in_tree_selected" v-if="item.id === taxon.id">
                {{ item.label }}
              </span>
              <ul
                v-for="(sibling, siblingIdx) in item.siblings"
                :key="`sibling-${siblingIdx}`"
              >
                <li style="list-style-type: none">
                  <span v-for="j in convertToNumber(item.i) - 2">&ensp;</span>
                  <NuxtLink :to="{ path: `/${sibling.id}` }">
                    {{ sibling.label }}
                  </NuxtLink>
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

export default defineNuxtComponent({
  name: "TaxonomicalTree",
  props: {
    lists: {
      type: Object,
      required: true,
    },
    hierarchyData: {
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
    hierarchyData: {
      handler() {
        this.waitUntilParentComponentDataComputed();
      },
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
      this.sortedSisters = this.hierarchyData.sortedSisters;
      this.parent = this.hierarchyData.parent;
      this.taxon = this.hierarchyData.taxon;
      this.hierarchy = this.hierarchyData.hierarchy;
      this.sortedSiblings = this.hierarchyData.sortedSiblings;
      this.taxon = this.hierarchyData.taxon;
      this.ranks = this.getHigherRanks(this.hierarchyData.taxon.rank__rank_en);
      this.sortedSistersWithoutCurrentTaxon =
        this.hierarchyData.sortedSistersWithoutCurrentTaxon;
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
      if (this.taxon.hierarchy_string === undefined) return;
      let newArr = [];
      let hierarchyIds = this.taxon.hierarchy_string.split("-");
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
        "rank_en"
      );
    },
    isHigherTaxon(rank) {
      // return !['Species','Subspecies','Genus','Supergenus','Subgenus'].includes(rank)
      return !(
        ["Species", "Subspecies", "Genus", "Supergenus", "Subgenus"].indexOf(
          rank
        ) >= 0
      );
    },
    isHigherRank(rank) {
      return this.ranks.indexOf(rank) >= 0;
      // return this.ranks.includes(rank)
    },
  },
});
</script>
