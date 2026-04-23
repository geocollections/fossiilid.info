<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { y } = useWindowScroll(el);

function toTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex h-full flex-1 md:p-8">
      <slot />
    </main>
    <AppFooter class="mt-auto" />
    <ClientOnly>
      <Transition>
        <UButton
          v-if="y > 0"
          size="lg"
          icon="i-heroicons-arrow-up"
          class="fixed right-2 bottom-2 rounded-full"
          @click="toTop"
        />
      </Transition>
    </ClientOnly>
  </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
