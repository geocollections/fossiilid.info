<template>
  <footer class="border-t font-serif text-sm dark:border-gray-800">
    <div class="mx-auto container my-2">
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
              <br />
              <a href="http://elurikkus.ee">eElurikkus</a>
              <br />
              <a href="http://naturforskaren.se">Naturforskaren</a>
              <br />
              <a href="http://www.geocase.eu">GeoCASe</a>
              <br />
              <a href="http://www.open-up.eu">OpenUp!</a>
              <br />
            </td>
            <td
              valign="top"
              align="center"
              style="border-left: solid 0px #ccc; border-right: dotted 0px #ccc"
            >
              {{ $t("footer.licence") }}
              <div>
                <br />
                <a
                  class="cc-large"
                  href="http://creativecommons.org/licences/by-nc/3.0/"
                >
                  <img
                    width="88px"
                    height="31px"
                    alt="Creative Commons Licence"
                    src="/ccbync.png"
                    typeof="foaf:Image"
                  />
                </a>
                <br />
              </div>
            </td>
            <td valign="top" align="center" style="width: 33%">
              <strong>{{ $t("footer.founders") }}:</strong>
              <br />
              <a href="https://taltech.ee/geoloogia-instituut">
                {{ $t("footer.gi") }}
              </a>
              <br />
              <a href="http://natmuseum.ut.ee">
                {{ $t("footer.ut") }}
              </a>
              <br />
              <a href="http://loodusmuuseum.ee">
                {{ $t("footer.elm") }}
              </a>
              <br />
              <br />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center" style="margin: 10px 0 10px 0">
        <a href="http://geokogud.info">
          <img
            border="0"
            style="height: 50px"
            src="https://files.geocollections.info/img/sarv_logo.svg"
            alt="SARV"
            title="SARV: geokogude infosüsteem"
          />
        </a>
        <a href="http://natarc.ut.ee">
          <img
            border="0"
            style="height: 50px; margin-left: 25px"
            src="https://elurikkus.ee/assets/images/natarc_logo_black.svg"
            alt="Natural History Archives and Information Network (NATARC)"
            title="SARV is part of national infrastructure Natural History Archives and Information Network (NATARC)"
          />
        </a>
        <a href="http://struktuurifondid.ee">
          <img
            border="0"
            style="height: 50px; margin-left: 25px"
            src="https://files.geocollections.info/img/EL_mv.png"
            alt="EU"
            title="Euroopa Liit"
          />
        </a>
      </div>
    </div>
  </footer>
</template>
