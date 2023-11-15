<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <main>
      <div class="py-10 px-2">
        <slot ref="el" />
      </div>
    </main>
    <AppFooter class="mt-auto" />
    <ClientOnly>
      <Transition>
        <UButton
          v-if="y > 0"
          size="lg"
          icon="i-heroicons-arrow-up"
          class="fixed bottom-2 right-2 rounded-full"
          @click="toTop"
        />
      </Transition>
    </ClientOnly>
  </div>
</template>

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
