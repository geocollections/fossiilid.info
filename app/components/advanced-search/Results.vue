<script setup lang="ts">
import type { AdvancedSearchState } from "~/utils/advanced-search";

const { search } = defineProps(["search"]);
const state = defineModel<AdvancedSearchState>({ required: true });
const stateRoute = useStateRoute();
const localePath = useLocalePath();

const stratigraphyURL = "https://geocollections.info/stratigraphy";

const pageSizes = ref([25, 50, 100]);
const pageStart = computed(
  () =>
    (state.value.pagination.pageIndex - 1) * state.value.pagination.pageSize +
    1,
);
</script>

<template>
  <div class="flex flex-col items-center justify-between md:items-start">
    <h3 class="mt-2 mb-4 text-xl font-bold">
      Results: {{ state.numberOfResults }}
    </h3>

    <div class="flex w-full justify-between">
      <UPagination
        v-model:page="state.pagination.pageIndex"
        :items-per-page="state.pagination.pageSize"
        :total="state.numberOfResults"
        :sibling-count="1"
        class="lg:hidden"
        @update:page="
          (p) => {
            state.pagination.pageIndex = p;
            search();
          }
        "
      />

      <UPagination
        v-model:page="state.pagination.pageIndex"
        class="hidden lg:block"
        :items-per-page="state.pagination.pageSize"
        :total="state.numberOfResults"
        :sibling-count="0"
        show-edges
        @update:page="
          (p) => {
            state.pagination.pageIndex = p;
            search();
          }
        "
      />

      <USelectMenu
        v-model="state.pagination.pageSize"
        class="hidden lg:block"
        :items="pageSizes"
        @update:model-value="
          () => {
            state.pagination.pageIndex = 1;
            search();
          }
        "
      />
    </div>

    <table class="my-2 hidden w-full lg:table">
      <template v-for="(result, idx) in state.results" :key="result.id">
        <tr
          v-if="
            result.fossil_group_id !== state.results[idx - 1]?.fossil_group_id
          "
        >
          <td colspan="2">
            <hr v-if="idx !== 0" class="my-2" />
            <NuxtLink
              :to="
                stateRoute({ path: localePath(`/${result.fossil_group_id}`) })
              "
              class="flex items-center gap-3"
            >
              <img
                width="70px"
                height="70px"
                :src="`https://files.geocollections.info/img/fossiilid/fossilgroups/${result.fossil_group_id}.png`"
                @error="
                  (e) => ((e.target as HTMLImageElement).style.display = 'none')
                "
              />
              <span class="text-3xl">
                {{ result.fossil_group }}
              </span>
            </NuxtLink>
          </td>
        </tr>
        <tr>
          <td class="pl-4">
            {{ pageStart + idx }}.
            <NuxtLink
              :href="stateRoute({ path: localePath(`/${result.taxon_id}`) })"
              target="_blank"
            >
              <span class="font-bold italic">{{ result.taxon }}</span>
              {{ result.author_year }}
            </NuxtLink>
          </td>
          <td>
            <NuxtLink
              :href="`${stratigraphyURL}/${result.fad_id}`"
              target="_blank"
            >
              {{ $getLocale() === "et" ? result.fad : result.fad_en }}
            </NuxtLink>
            <span v-if="result.lad && result.fad_id !== result.lad_id">
              ->
              <NuxtLink
                :href="`${stratigraphyURL}/${result.lad_id}`"
                target="_blank"
              >
                {{ $getLocale() === "et" ? result.lad : result.lad_en }}
              </NuxtLink>
            </span>
          </td>
        </tr>
      </template>
    </table>

    <div class="my-3 w-full space-y-3 lg:hidden">
      <UCard v-for="result in state.results" :key="result.fossil_group_id">
        <NuxtLink
          :href="stateRoute({ path: localePath(`/${result.taxon_id}`) })"
        >
          {{ result.taxon }}
        </NuxtLink>
      </UCard>
    </div>

    <UPagination
      v-model:page="state.pagination.pageIndex"
      :items-per-page="state.pagination.pageSize"
      :total="state.numberOfResults"
      :sibling-count="1"
      class="lg:hidden"
      @update:page="
        (p) => {
          state.pagination.pageIndex = p;
          search();
        }
      "
    />

    <UPagination
      v-model:page="state.pagination.pageIndex"
      class="hidden lg:block"
      :items-per-page="state.pagination.pageSize"
      :total="state.numberOfResults"
      :sibling-count="0"
      show-edges
      @update:page="
        (p) => {
          state.pagination.pageIndex = p;
          search();
        }
      "
    />
  </div>
</template>
