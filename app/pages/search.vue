<script setup lang="ts"></script>

<template>
  <section class="container space-y-2">
    <div
      class="flex h-full flex-col rounded border bg-white p-4 lg:col-span-1 dark:border-gray-700 dark:bg-gray-800"
    >
      <span class="flex justify-between">
        <h1 class="text-center text-4xl">
          {{ $t("menu.detail_search") }}
        </h1>
      </span>

      <hr class="my-2" />

      <div class="grid flex-1 grid-cols-2 gap-8">
        <span class="flex flex-col justify-between">
          <AdvancedSearchMap />
          <AdvancedSearchForm />
        </span>
        <AdvancedSearchResults />
      </div>
    </div>
  </section>
</template>
