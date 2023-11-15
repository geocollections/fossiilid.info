<template>
  <UCard>
    <template #header>
      {{ $t("header.fossils_classification") }}
    </template>
    <div style="font-size: 0.8em">
      <table>
        <tbody class="hierarchy_tree">
          <tr
            style="list-style-type: none"
            v-for="(node, idx) in hierarchy"
            :key="node.id"
          >
            <td
              v-if="idx === 0 || node.rank !== hierarchy?.[idx - 1].rank"
              align="right"
              valign="top"
              style="color: #999"
            >
              <span v-if="node.rank">
                {{ $translate({ et: node.rank_name, en: node.rank_name_en }) }}
              </span>
              <span class="fst-italic" style="font-weight: lighter" v-else>
                {{ t("unranked") }}
              </span>
            </td>
            <td
              style="color: #999; border-right: 1px solid #999"
              align="right"
              valign="top"
              v-else
            ></td>
            <td
              class="ps-2"
              :class="{ 'fst-italic': !isHigherTaxon(node.rank_name_en) }"
            >
              <span
                class="node_in_tree_selected"
                :style="{ 'margin-left': `${0.75 * node.level}rem` }"
                v-if="node.id === props.id"
              >
                {{ node.taxon }}
              </span>
              <NuxtLink
                v-else
                :style="{ 'margin-left': `${0.75 * node.level}rem` }"
                :to="{ path: `/${node.id}` }"
              >
                {{ node.taxon }}
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { useNewApiFetch } from "~/composables/useApiFetch";
const props = defineProps<{ id: number }>();

const { t } = useI18n({ useScope: "local" });

type HierarchyNode = {
  id: number;
  taxon: string;
  rank: number;
  rank_name: string;
  rank_name_en: string;
  level: number;
};

const { data: hierarchy } = useNewApiFetch<HierarchyNode[]>(
  `/taxa/${props.id}/hierarchy/`,
);

function isHigherTaxon(rank: string) {
  return !(
    ["Species", "Subspecies", "Genus", "Supergenus", "Subgenus"].indexOf(
      rank,
    ) >= 0
  );
}
</script>
<i18n lang="json">
{
  "en": {
    "unranked": "unranked"
  },
  "et": {
    "unranked": "määratlemata"
  }
}
</i18n>
