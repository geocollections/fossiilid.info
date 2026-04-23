<script setup lang="ts">
import type { AdvancedSearchState } from "~/utils/advanced-search";

const { search } = defineProps(["search"]);
const state = defineModel<AdvancedSearchState>({ required: true });
const stateRoute = useStateRoute();
const localePath = useLocalePath();

const stratigraphyURL = "https://geocollections.info/stratigraphy";

const pageSizes = ref([25, 50, 100]);
</script>

<template>
  <div class="flex flex-col items-center md:items-start justify-between">
    <div class="flex justify-between w-full">
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
        class="hidden lg:block" :items="pageSizes" @update:model-value="() => {
          state.pagination.pageIndex = 1;
          search()
        }"
      />
    </div>

    <table class="hidden lg:table w-full my-2">
      <template
        v-for="(result, idx) in state.results" :key="result.id"
      >
        <tr v-if="result.fossil_group_id !== state.results[idx - 1]?.fossil_group_id">
          <td colspan="2">
            <hr v-if="idx !== 0" class="my-2">
            <NuxtLink :to="stateRoute({ path: localePath(`/${result.fossil_group_id}`) })" class="flex items-center gap-3">
              <img width="70px" height="70px" :src="`https://files.geocollections.info/img/fossiilid/fossilgroups/${result.fossil_group_id}.png`" @error="(e) => (e.target as HTMLImageElement).style.display = 'none'">
              <span class="text-3xl">
                {{ result.fossil_group }}
              </span>
            </NuxtLink>
          </td>
        </tr>
        <tr>
          <td class="pl-4">
            <NuxtLink :href="stateRoute({ path: localePath(`/${result.taxon_id}`) })" target="_blank">
              <span class="font-bold italic">{{ result.taxon }}</span> {{ result.author_year }}
            </NuxtLink>
          </td>
          <td>
            <NuxtLink :href="`${stratigraphyURL}/${result.fad_id}`" target="_blank">
              {{ result.fad }}
            </NuxtLink>
            <span v-if="result.lad && result.fad_id !== result.lad_id">
              ->
              <NuxtLink :href="`${stratigraphyURL}/${result.lad_id}`" target="_blank">
                {{ result.lad }}
              </NuxtLink>
            </span>
          </td>
        </tr>
      </template>
    </table>

    <div class="lg:hidden space-y-3 my-3 w-full">
      <UCard v-for="result in state.results" :key="result.fossil_group_id">
        <NuxtLink :href="stateRoute({ path: localePath(`/${result.taxon_id}`) })">
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
