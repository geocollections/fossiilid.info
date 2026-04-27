<script setup lang="ts">
import type { Taxon } from "~/pages/[id].vue";

const props = defineProps<{ taxon: Taxon }>();
const copiedReference = ref();
const itemsPerPageSelection = ref([10, 20, 50, 100]);

const { page, itemsPerPage, references, count } = await useReferences(props.taxon.id);
function handleCopy(referenceID: number) {
  copiedReference.value = referenceID;
}
</script>

<template>
  <section v-if="count > 0" class="flex flex-col gap-2 justify-between container p-4 bg-white border rounded-2xl">
    <div>
      <h2 class="font-bold">
        {{ $t("header.f_taxon_references") }}
      </h2>

      <hr class="-mx-4 my-4">

      <ol class="flex flex-col gap-2">
        <template v-for="(reference, idx) in references" :key="idx">
          <ReferenceItem
            :reference="reference"
            :copied-reference="copiedReference"
            @copy="handleCopy"
          />
        </template>
      </ol>
    </div>

    <div class="flex justify-between">
      <UPagination
        v-model:page="page"
        :items-per-page="itemsPerPage"
        :total="count"
        :sibling-count="2"
      />

      <USelectMenu v-model="itemsPerPage" :items="itemsPerPageSelection" />
    </div>
  </section>
</template>
