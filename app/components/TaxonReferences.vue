<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{ taxon: Taxon }>();
const copiedReferenceID = ref<number>(-1);
const itemsPerPageSelection = ref([10, 20, 50, 100]);

const { page, itemsPerPage, references, count } = await useReferences(props.taxon.id);
function handleCopy(referenceID: number) {
  copiedReferenceID.value = referenceID;
}
</script>

<template>
  <section v-if="count > 0" aria-labelledby="references-heading" class="flex flex-col text-sm whitespace-break-spaces wrap-break-word md:text-base gap-2 justify-between container md:p-4 bg-white dark:bg-gray-800 dark:border-gray-700 border rounded-2xl">
    <div>
      <h2 id="references-heading" class="font-bold">
        {{ $t("header.f_taxon_references") }}
      </h2>

      <div div class="border-t border-gray-200 -mx-4 my-4" />

      <ol class="flex flex-col gap-2">
        <ReferenceItem
          v-for="reference in references"
          :key="reference.id"
          :reference="reference"
          :copied-reference-id="copiedReferenceID"
          @copy="handleCopy"
        />
      </ol>
    </div>

    <nav class="flex flex-col gap-4 md:gap-0 md:flex-row mb-4 justify-between" aria-label="References pagination">
      <UPagination
        v-model:page="page"
        :items-per-page="itemsPerPage"
        :total="count"
        :sibling-count="1"
        class="md:hidden"
      />

      <UPagination
        v-model:page="page"
        :items-per-page="itemsPerPage"
        :total="count"
        :sibling-count="2"
        class="hidden md:block"
      />

      <USelectMenu v-model="itemsPerPage" :items="itemsPerPageSelection" />
    </nav>
  </section>
</template>
