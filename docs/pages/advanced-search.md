# Advanced Search (`/search`)

## Data Flow

- State is defined in `search.vue`
- Passed to child components
- Modified primarily in `AdvancedSearchForm`
- Results are rendered by `AdvancedSearchResults`


### Map State

- The map instance/state is managed in `search.vue` via `useAdvancedSearch`
- `AdvancedSearchMap` is a presentational component and does not own the map state

## Layout

```text
+----------------------------------------+
|                 Header                 |
+----------------------------------------+
| AdvancedSearchForm | AdvancedSearchMap |
|----------------------------------------|
|         AdvancedSearchResults          |
+----------------------------------------+
|                 Footer                 |
+----------------------------------------+

Note: Diagram shows structure only, not exact proportions.
