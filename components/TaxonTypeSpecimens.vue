<script setup lang="ts">
import isEmpty from "lodash/isEmpty";
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{
  taxon: Taxon;
}>();

const { locale } = useI18n();
const img = useImage();

interface TaxonTypeSpecimen {
  id: number;
  type?: {
    id: number;
    value: string;
    value_en: string;
  };
  specimen?: {
    id: number;
    number: string;
  };
  specimen_number?: string;
  repository?: string;
  level?: string;
  attachment?: {
    id: number;
    filename: string;
  };
  remarks?: string;
  stratigraphy?: {
    id: number;
    name: string;
    name_en: string;
  };
  stratigraphy_free?: string;
  stratigraphy_free_en?: string;
  locality?: {
    id: number;
    name: string;
    name_en: string;
  };
  locality_free?: string;
  locality_free_en?: string;
}

const { data: typeSpecimensRes } = await useNewApiFetch<{
  results: TaxonTypeSpecimen[];
  count: number;
}>(`/taxa/${props.taxon.id}/taxon-type-specimens/`, {
  query: {
    expand: "type,attachment,stratigraphy,locality",
    format: "json",
  },
});

const typeSpecimens = computed(() => typeSpecimensRes.value?.results ?? []);

function isDifferentName(obj: any) {
  const localizedName = locale.value === "et" ? obj.et : obj.en;
  return localizedName[0] !== localizedName[1] && !isEmpty(localizedName[1]);
}

function arrayHasNonNullElement(arr: any[]) {
  let found = false;
  arr.forEach((el) => {
    found = isDefinedAndNotNull(el);
  });
  return found;
}
function isAtLeastOneDefinedAndNotEmpty(arr: any) {
  let found = arrayHasNonNullElement(arr.common);
  if (found)
    return found;

  const localizedArr = locale.value === "et" ? arr.et : arr.en;
  found = arrayHasNonNullElement(localizedArr);
  return found;
}
</script>

<template>
  <UCard v-if="typeSpecimens.length > 0">
    <template #header>
      {{ $t("header.f_species_type_data") }}
    </template>
    <div
      v-for="(typeSpecimen, idx) in typeSpecimens"
      :key="idx"
      class="flex"
      :class="idx === typeSpecimens.length - 1 ? '' : 'border-bottom my-3'"
    >
      <div>
        <span v-if="typeSpecimen.type" class="capitalize font-bold">
          {{
            $translate({
              et: typeSpecimen.type.value,
              en: typeSpecimen.type.value_en,
            })
          }}:
        </span>
        <a
          v-if="typeSpecimen.specimen"
          :href="`https://geocollections.info/specimen/${typeSpecimen.specimen}`"
        >
          {{ typeSpecimen.repository }}
          {{ typeSpecimen.specimen_number }}
        </a>
        <span v-else>
          {{ typeSpecimen.repository }}
          {{ typeSpecimen.specimen_number }}
        </span>
        <span
          v-if="
            isAtLeastOneDefinedAndNotEmpty({
              common: [
                typeSpecimen.level,
                typeSpecimen.attachment?.filename,
                typeSpecimen.remarks,
              ],
              et: [
                typeSpecimen.stratigraphy?.name,
                typeSpecimen.stratigraphy_free,
                typeSpecimen.locality?.name,
              ],
              en: [
                typeSpecimen.stratigraphy?.name_en,
                typeSpecimen.stratigraphy_free_en,
                typeSpecimen.locality?.name_en,
              ],
            })
          "
          class="font-bold"
        >;
        </span>
        <template v-if="typeSpecimen.locality">
          <a
            :href="`https://geocollections.info/locality/${typeSpecimen.locality?.id}`"
          >
            {{
              $translate({
                et: typeSpecimen.locality.name,
                en: typeSpecimen.locality.name_en,
              })
            }}
          </a>
          <span
            v-if="
              isDifferentName({
                et: [typeSpecimen.locality?.name, typeSpecimen.locality_free],
                en: [
                  typeSpecimen.locality?.name_en,
                  typeSpecimen.locality_free_en,
                ],
              })
            "
          >
            ({{
              $translate({
                et: typeSpecimen.locality_free,
                en: typeSpecimen.locality_free_en,
              })
            }}) </span>
          <span class="font-bold">; </span>
        </template>
        <span v-if="isDefinedAndNotNull(typeSpecimen.level)">
          {{ typeSpecimen.level }},
        </span>
        <a
          v-if="typeSpecimen.stratigraphy"
          :href="`https://geocollections.info/stratigraphy/${typeSpecimen.stratigraphy?.id}`"
        >{{
          $translate({
            et: typeSpecimen.stratigraphy.name,
            en: typeSpecimen.stratigraphy.name_en,
          })
        }}
        </a>
        <span
          v-if="
            isDifferentName({
              et: [
                typeSpecimen.stratigraphy?.name,
                typeSpecimen.stratigraphy_free,
              ],
              en: [
                typeSpecimen.stratigraphy?.name_en,
                typeSpecimen.stratigraphy_free_en,
              ],
            })
          "
        >
          ({{
            $translate({
              et: typeSpecimen.stratigraphy_free,
              en: typeSpecimen.stratigraphy_free_en,
            })
          }})
        </span>
        <span v-if="isDefinedAndNotNull(typeSpecimen.remarks)">
          ,&nbsp;{{ typeSpecimen.remarks }}
        </span>
      </div>
      <span v-if="typeSpecimen.attachment" class="pl-3">
        <a
          :href="`https://geocollections.info/file/${typeSpecimen.attachment.id}`"
        >
          <img
            class="max-h-[120px]"
            :src="
              img(
                typeSpecimen.attachment.filename,
                { size: 'small' },
                { provider: 'geocollections' },
              )
            "
          >
        </a>
      </span>
    </div>
  </UCard>
</template>
