<script setup lang="ts">
const relatedWebResources = [
  {
    href: "https://elurikkus.ee",
    label: "eElurikkus",
  },
  {
    href: "https://geoloogia.info",
    label: "eMaapõu",
  },
  {
    href: "https://www.geocase.eu",
    label: "GeoCASe",
  },
  {
    href: "https://www.gbif.org",
    label: "GBIF",
  },
  {
    href: "https://open-up.eu",
    label: "OpenUp",
  },
];

const foundingInsitutions = computed(() => [
  {
    href: "https://taltech.ee/geoloogia-instituut",
    label: $t("footer.gi"),
  },
  {
    href: "https://natmuseum.ut.ee",
    label: $t("footer.ut"),
  },
  {
    href: "https://loodusmuuseum.ee",
    label: $t("footer.elm"),
  },
]);

const relatedOrganizations = [
  {
    href: "https://geoloogia.info",
    src: "https://files.geocollections.info/img/sarv_logo.svg",
    alt: "SARV",
    title: "SARV: geokogude infosüsteem",
  },
  {
    href: "https://natarc.ut.ee",
    src: "https://elurikkus.ee/assets/images/natarc_logo_black.svg",
    alt: "Natural History Archives and Information Network (NATARC)",
    title: "SARV is part of national infrastructure Natural History Archives and Information Network (NATARC)",
  },
  {
    href: "https://www.struktuurifondid.ee",
    src: "https://files.geocollections.info/img/EL_mv.png",
    alt: "EU",
    title: "Euroopa Liit",
  },
];
</script>

<template>
  <footer class="border-t font-serif text-sm dark:border-gray-800">
    <div class="container">
      <table class="w-full">
        <tbody>
          <tr class="flex flex-col items-center space-y-6 md:flex-row md:items-start md:space-y-0">
            <!-- Related -->
            <td class="w-full align-top text-center md:w-1/3">
              <div class="flex w-full flex-col space-y-1 md:items-start">
                <span class="my-2">
                  <strong
                    class="relative after:absolute after:-bottom-1 after:left-0 after:mt-4 after:h-0.5 after:w-6 after:bg-primary after:content-['']"
                  >
                    {{ $t("footer.related").toUpperCase() }}
                  </strong>
                </span>

                <span
                  v-for="link in relatedWebResources"
                  :key="link.label"
                >
                  <a
                    :href="link.href"
                    target="_blank"
                    class="relative inline-block transition-transform duration-200 ease-out after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:content-[''] after:transition-transform after:duration-200 hover:translate-x-1 hover:after:scale-x-100"
                  >
                    {{ link.label }}
                  </a>
                </span>
              </div>
            </td>

            <!-- License -->
            <td class="w-full align-top text-center md:w-1/3">
              <div class="flex flex-col space-y-5 md:items-center">
                <span class="my-2">
                  <strong
                    class="relative after:absolute after:-bottom-1 after:left-0 after:mt-4 after:h-0.5 after:w-6 after:bg-primary after:content-['']"
                  >
                    {{ $t("footer.title").toUpperCase() }}
                  </strong>
                </span>

                <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">
                  <img
                    alt="Creative Commons Licence"
                    src="https://creativecommons.org/wp-content/themes/vocabulary-theme/vocabulary/svg/cc/license_badges/big/by.svg"
                    typeof="foaf:Image"
                  >
                </a>

                <p class="max-w-70 text-xs wrap-break-word whitespace-break-spaces">
                  {{ $t("footer.licence") }}
                </p>
              </div>
            </td>

            <!-- Founders -->
            <td class="w-full align-top text-center md:w-1/3">
              <div class="flex flex-col space-y-1 md:items-end">
                <span class="my-2">
                  <strong
                    class="relative after:absolute after:-bottom-1 after:left-0 after:mt-4 after:h-0.5 after:w-6 after:bg-primary after:content-['']"
                  >
                    {{ $t("footer.founders").toUpperCase() }}
                  </strong>
                </span>

                <span
                  v-for="link in foundingInsitutions"
                  :key="link.label"
                >
                  <a
                    :href="link.href"
                    class="relative inline-block transition-transform duration-200 ease-out after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-current after:content-[''] after:transition-transform after:duration-200 hover:-translate-x-1 hover:after:scale-x-100"
                    target="_blank"
                  >
                    {{ link.label }}
                  </a>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="my-4 flex flex-col items-center">
        <h2 class="my-2 font-bold">
          {{ $t("footer.partners").toUpperCase() }}
        </h2>
        <div
          class="flex w-full justify-around space-x-4 py-4 dark:border-gray-400 dark:bg-gray-500 md:w-2/3"
        >
          <a v-for="(link, idx) in relatedOrganizations" :key="idx" class="w-32" :href="link.href">
            <img
              :src="link.src"
              :alt="link.alt"
              :title="link.title"
            >
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
