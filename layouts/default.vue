<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <main>
      <div class="pt-10">
        <slot />
      </div>
    </main>
    <AppFooter class="mt-auto" />
  </div>
</template>
