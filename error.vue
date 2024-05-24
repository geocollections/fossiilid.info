<template>
  <NuxtLayout>
    <div class="space-y-5 pt-10 text-center">
      {{ error }}
      <div class="text-tomato">Error 404</div>
      <h1 class="text-3xl">{{ $t("header.page_not_found") }}</h1>
      <UButton
        trailing-icon="i-heroicons-arrow-right"
        size="lg"
        @click="handleError"
      >
        {{ $t("main.backToLanding") }}
      </UButton>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
defineProps({
  error: Object,
});
function handleError() {
  clearError({ redirect: "/" });
}
</script>
