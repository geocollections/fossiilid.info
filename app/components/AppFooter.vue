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
  <footer class="container border-t font-serif text-sm dark:border-gray-800">
    <table class="w-full">
      <tbody>
        <tr class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0">
          <td valign="top" align="center">
            <div class="flex flex-col md:items-start w-full space-y-1">
              <span class="my-2">
                <strong
                  class="after:bg-primary relative after:absolute after:mt-4 after:left-0 after:-bottom-1 after:h-0.5 after:w-6 after:content-['']"
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
                  class="link-right"
                >
                  {{ link.label }}
                </a>
              </span>
            </div>
          </td>

          <td valign="top" align="center">
            <div class="flex flex-col md:items-center space-y-3">
              <span class="my-2">
                <strong
                  class="after:bg-primary relative after:absolute after:mt-4 after:left-0 after:-bottom-1 after:h-0.5 after:w-6 after:content-['']"
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

              <p
                class="max-w-70 text-xs wrap-break-word whitespace-break-spaces"
              >
                {{ $t("footer.licence") }}
              </p>
            </div>
          </td>

          <td valign="top" align="center">
            <div class="flex flex-col md:items-end space-y-1">
              <span class="my-2">
                <strong
                  class="after:bg-primary relative after:absolute after:mt-4 after:left-0 after:-bottom-1 after:h-0.5 after:w-6 after:content-['']"
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
                  class="link-left"
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
        class="flex w-full md:w-2/3 space-x-4 justify-around py-4 dark:border-gray-400 dark:bg-gray-500"
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
  </footer>
</template>

<style>
@media(min-width: 768px) {
  td{
    width: 33.3%;
  }
}

td{
  width: 100%;
}

.link-right {
  position: relative;
  display: inline-block;
  transition: transform 200ms ease-out;
}

.link-right::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.25rem;
  height: 2px;
  width: 100%;
  background-color: currentColor;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 200ms ease-out;
}

.link-right:hover {
  transform: translateX(0.25rem);
}

.link-right:hover::after {
  transform: scaleX(1);
}

.link-left {
  position: relative;
  display: inline-block;
  transition: transform 200ms ease-out;
}

.link-left::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.25rem;
  height: 2px;
  width: 100%;
  background-color: currentColor;
  transform-origin: right;
  transform: scaleX(0);
  transition: transform 200ms ease-out;
}

.link-left:hover {
  transform: translateX(-0.25rem);
}

.link-left:hover::after {
  transform: scaleX(1);
}
</style>
