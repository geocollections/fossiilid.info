<template>
  <NuxtLayout>
    <div class="text-center py-5">
      <h2>This page does not exist</h2>
      <button class="btn btn-secondary" @click="handleError">
        {{ $t("main.backToLanding") }}
        <i class="fas fa-arrow-right ms-1"></i>
      </button>
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
