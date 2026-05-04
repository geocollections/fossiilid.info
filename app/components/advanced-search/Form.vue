<script setup lang="ts">
import type { AdvancedSearchState } from "~/utils/advanced-search";

const { search, reset } = defineProps(["search", "reset"]);
const state = defineModel<AdvancedSearchState>({ required: true });
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
  <UForm
    class="flex flex-col justify-between"
    @submit="
      () => {
        state.pagination.pageIndex = 1;
        search();
      }
    "
  >
    <div class="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-2">
      <UFormField
        class="text-xl lg:text-2xl"
        :label="$t('advancedsearch.taxon')"
      >
        <USelectMenu
          v-model="state.higherTaxon"
          v-model:search-term="higherTaxonSearchTerm"
          clear
          class="my-2 w-full"
          :items="higherTaxonSelectMenuResults"
          label-key="taxon"
          by="id"
          size="xl"
          :placeholder="$t('advancedsearch.hightaxon')"
          @update:search-term="searchHigherTaxon"
        />

        <UInput
          v-model="state.species"
          class="w-full"
          clear
          size="xl"
          :placeholder="$t('advancedsearch.species')"
        >
          <template v-if="state.species.length > 0" #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-x"
              aria-label="Clear input"
              @click="
                () => {
                  state.species = '';
                }
              "
            />
          </template>
        </UInput>

        <UInput
          v-model="state.author"
          clear
          class="w-full"
          size="xl"
          :placeholder="$t('advancedsearch.author')"
        >
          <template v-if="state.author.length > 0" #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-x"
              aria-label="Clear input"
              @click="
                () => {
                  state.author = '';
                }
              "
            />
          </template>
        </UInput>
      </UFormField>

      <div class="flex flex-col justify-between">
        <UFormField
          class="text-xl lg:text-2xl"
          :label="$t('advancedsearch.stratigraphy')"
        >
          <USelectMenu
            v-model="state.stratigraphy"
            v-model:search-term="stratigraphySearchTerm"
            clear
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

        <UFormField
          class="text-xl lg:text-2xl"
          :label="$t('advancedsearch.locality_label')"
        >
          <UInput
            v-model="state.locality"
            class="w-full"
            clear
            size="xl"
            :placeholder="$t('advancedsearch.locality')"
          >
            <template v-if="state.locality.length > 0" #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-x"
                aria-label="Clear input"
                @click="
                  () => {
                    state.locality = '';
                  }
                "
              />
            </template>
          </UInput>

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
      </div>
    </div>

    <div class="flex flex-col gap-3 lg:flex-row">
      <UButton
        class="w-full justify-center hover:scale-105 lg:w-5/7"
        type="submit"
        size="lg"
      >
        {{ $t("advancedsearch.btn_search").toUpperCase() }}
      </UButton>

      <UButton
        class="w-full justify-center hover:scale-105 lg:flex-1"
        variant="outline"
        size="lg"
        color="neutral"
        icon="i-heroicons-trash"
        @click="reset"
      >
        {{ $t("advancedsearch.btn_clear").toUpperCase() }}
      </UButton>
    </div>
  </UForm>
</template>
