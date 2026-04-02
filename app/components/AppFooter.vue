<template>
  <footer class="border-t font-serif text-sm dark:border-gray-800">
    <div class="container mx-auto my-2">
      <table
        style="
          width: 100%;
          border-top: solid 0px #ccc;
          border-bottom: solid 0px #ccc;
        "
      >
        <tbody>
          <tr>
            <td valign="top" align="center" style="width: 33%">
              <strong>{{ $t("footer.related") }}:</strong>
              <br>
              <a href="https://elurikkus.ee">eElurikkus</a>
              <br>
              <a href="https://naturforskaren.se">Naturforskaren</a>
              <br>
              <a href="https://www.geocase.eu">GeoCASe</a>
              <br>
              <a href="https://open-up.eu">OpenUp!</a>
              <br>
            </td>
            <td
              valign="top"
              align="center"
              style="border-left: solid 0px #ccc; border-right: dotted 0px #ccc"
            >
              {{ $t("footer.licence") }}
              <div>
                <br>
                <a
                  class="cc-large"
                  href="https://creativecommons.org/licenses/by-nc/3.0/"
                >
                  <img
                    width="88px"
                    height="31px"
                    alt="Creative Commons Licence"
                    src="/ccbync.png"
                    typeof="foaf:Image"
                  >
                </a>
                <br>
              </div>
            </td>
            <td valign="top" align="center" style="width: 33%">
              <strong>{{ $t("footer.founders") }}:</strong>
              <br>
              <a href="https://taltech.ee/geoloogia-instituut">
                {{ $t("footer.gi") }}
              </a>
              <br>
              <a href="https://natmuseum.ut.ee">
                {{ $t("footer.ut") }}
              </a>
              <br>
              <a href="https://loodusmuuseum.ee">
                {{ $t("footer.elm") }}
              </a>
              <br>
              <br>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center">
        <div
          class="flex w-fit gap-x-6 rounded border px-4 py-4 dark:border-gray-400 dark:bg-gray-500"
        >
          <a href="https://geoloogia.info">
            <img
              border="0"
              style="height: 50px"
              src="https://files.geocollections.info/img/sarv_logo.svg"
              alt="SARV"
              title="SARV: geokogude infosüsteem"
            >
          </a>
          <a href="https://natarc.ut.ee">
            <img
              border="0"
              style="height: 50px"
              src="https://elurikkus.ee/assets/images/natarc_logo_black.svg"
              alt="Natural History Archives and Information Network (NATARC)"
              title="SARV is part of national infrastructure Natural History Archives and Information Network (NATARC)"
            >
          </a>
          <a href="https://www.struktuurifondid.ee">
            <img
              border="0"
              style="height: 50px"
              src="https://files.geocollections.info/img/EL_mv.png"
              alt="EU"
              title="Euroopa Liit"
            >
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
