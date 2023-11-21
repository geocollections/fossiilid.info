<script setup>
const colorMode = useColorMode();

const nextTheme = {
  system: "light",
  light: "dark",
  dark: "system",
};

const icon = computed(() => {
  if (colorMode.preference === "light") {
    return "i-heroicons-sun-20-solid";
  }
  if (colorMode.preference === "dark") {
    return "i-heroicons-moon-20-solid";
  }
  return "i-heroicons-computer-desktop-20-solid";
});

function switchTheme() {
  colorMode.preference = nextTheme[colorMode.preference];
}
</script>

<template>
  <ClientOnly>
    <UButton
      :icon="icon"
      color="gray"
      variant="ghost"
      size="md"
      aria-label="Theme"
      @click="switchTheme"
    />
    <template #fallback>
      <div class="h-8 w-8"></div>
    </template>
  </ClientOnly>
</template>
