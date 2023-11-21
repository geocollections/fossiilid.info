import { asSitemapUrl, defineSitemapEventHandler } from "#imports";

export default defineSitemapEventHandler(async () => {
  const taxaCount = await $fetch<{
    response: { numFound: number };
  }>("https://api.geoloogia.info/solr/taxon", {
    query: { fl: "id", rows: 1, q: "*" },
  });

  const taxaRes = await $fetch<{
    response: { docs: { id: string; date_changed: string }[] };
  }>("https://api.geoloogia.info/solr/taxon", {
    query: {
      fl: "id,date_changed",
      rows: taxaCount.response.numFound,
      q: "*",
      fq: ["is_fossil:1"],
    },
  });

  return [
    // map URLS as needed
    ...taxaRes.response.docs.map((p) =>
      asSitemapUrl({
        loc: `/${p.id}`,
        lastmod: p.date_changed,
        _i18nTransform: true,
      }),
    ),
  ];
});
