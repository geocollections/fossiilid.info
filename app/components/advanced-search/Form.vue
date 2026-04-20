<script setup lang="ts">
const { search } = defineProps(["search"]);
const advancedSearchStore = useAdvancedSearchStore();
const higherTaxonSearchTerm = ref("");
const higherTaxonSelectMenuResults = ref<TaxonOption[]>([]);
const stratigraphySearchTerm = ref("");
const stratigraphySelectMenuResults = ref<StratigraphyOption[]>([]);

const { searchHigherTaxon, searchStratigraphy } = useAdvancedSearchFilters(
  higherTaxonSelectMenuResults,
  stratigraphySelectMenuResults,
);
</script>

<template>
  <UForm class="space-y-4" @submit="search">
    <div class="mt-4 grid grid-cols-2 gap-4">
      <UFormField class="text-3xl" :label="$t('advancedsearch.taxon')">
        <USelectMenu
          v-model="advancedSearchStore.higherTaxon"
          v-model:search-term="higherTaxonSearchTerm"
          class="my-2 w-full"
          :items="higherTaxonSelectMenuResults"
          label-key="taxon"
          by="id"
          size="xl"
          :placeholder="$t('advancedsearch.hightaxon')"
          @update:search-term="searchHigherTaxon"
        />

        <UInput
          v-model="advancedSearchStore.species"
          class="w-full"
          size="xl"
          :placeholder="$t('advancedsearch.species')"
        />

        <UInput
          v-model="advancedSearchStore.author"
          class="w-full"
          size="xl"
          :placeholder="$t('advancedsearch.author')"
        />
      </UFormField>

      <UFormField class="text-3xl" :label="$t('advancedsearch.stratigraphy')">
        <USelectMenu
          v-model="advancedSearchStore.stratigraphy"
          v-model:search-term="stratigraphySearchTerm"
          class="w-full"
          :items="stratigraphySelectMenuResults"
          :label-key="
            $getLocale() === 'et' ? 'stratigraphy' : 'stratigraphy_en'
          "
          by="id"
          :placeholder="$t('advancedsearch.stratigraphy')"
          size="xl"
          @update:search-term="searchStratigraphy"
        />
      </UFormField>
    </div>

    <hr>

    <UFormField class="text-3xl" :label="$t('advancedsearch.locality_label')">
      <UInput
        v-model="advancedSearchStore.locality"
        class="w-full"
        size="xl"
        :placeholder="$t('advancedsearch.locality')"
      />

      <!-- Disabled for the moment because it doesn't work
      <span class="grid grid-cols-2">
        <div>
          <USwitch
            v-model="advancedSearchStore.isNearMe"
            :label="$t('advancedsearch.showNearMeField')"
            size="xl"
          />

          <USwitch
            v-model="advancedSearchStore.isOutcrop"
            :label="$t('advancedsearch.subsurfaceField')"
            size="xl"
          />
        </div>

        <UForm
          v-if="advancedSearchStore.isNearMe"
          :label="`Radius ${advancedSearchStore.nearMeRangeInKM} km`"
          class="content-center"
        >
          <USlider
            v-model="advancedSearchStore.nearMeRangeInKM"
            tooltip
            :min="0"
            :max="20"
          />
          <div class="flex justify-between text-2xl">
            <span>0</span>
            <span>20</span>
          </div>
        </UForm>
      </span>
      -->
    </UFormField>

    <UButton class="w-full justify-center" type="submit" size="xl">
      {{ $t("advancedsearch.btn_search") }}
    </UButton>
  </UForm>
</template>
