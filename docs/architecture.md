# Architecture

This project is a full-stack application that uses [Nuxt 4](https://nuxt.com/docs/4.x/getting-started/installation).  
Currently data is sourced from external APIs and there are no backend routes.  
An eslint.config.js file is provided to assure uniform formatting.

## Used APIs
- https://rwapi.geoloogia.info/api/v0/public
- https://rwapi.geoloogia.info/api/v1/public
- https://api.geoloogia.info/solr

In the project the APIs are used as composables exported from 
[useApiFetch.ts](../app/composables/useApiFetch.ts):
`useApiFetch`, `useNewApiFetch`, and `useSolrFetch` respectively.


## Root Store (`useRootStore`)

The root store holds global UI state and shared search parameters used across the application.

- Provides a central place for values that are used in multiple views
- Keeps search-related defaults consistent across pages

### State

- `mode`  
  Represents the region context (global, estonia, baltoscandia)

- `searchParameters`  
  Default pagination and sorting settings for:
  - species
  - specimens

These values are used to initialize and control search behavior across the app.

### Persistence

- Only `mode` is persisted across sessions
- Search parameters are not persisted to avoid stale or confusing results
