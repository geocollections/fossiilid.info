# Detail view (`/[id]`)

This section describes all routes under the dynamic `[id]` path.

## Navigation

The detail view uses a shared navigation menu defined in `pages/[id].vue`.

The navigation menu controls which subroute is active:

- 📍 `/[id]` → Overview (`index.vue`)
   - This introduces an extra layer in the routing
   - Legacy structure - kept for stability
- 📍 `/[id]/specimens`
- 📍 `/[id]/gallery`

### Notes

- The navigation menu is rendered above the main content (see diagram)
- Route changes determine which page component is displayed
- All pages share the same taxon data


## 📍 Overview (`/[id]`)

This doc file explains how data flows and how components are laid
out in the detail view.

Entry point: `pages/[id].vue`

This file fetches the taxon data and redirects to `pages/[id]/index.vue`.

Note:
- This introduces an extra layer in the routing
- It may be redundant and could potentially be merged into `index.vue`

## Data Flow

1. `[id].vue` fetches taxon data
2. User is redirected to `[id]/index.vue`
3. `OverviewTaxon.vue` receives the taxon as a prop
4. `OverviewTaxon` passes relevant data down to child components

### Overview Layout:
```text
+------------------------------------------------------+
|                        Header                        |
|------------------------------------------------------|
| NavigationMenu (tabs above images, found in [id].vue)|
+------------------------+-----------------------------+
| TaxonImages            | TaxonSpecimenMap            |
|------------------------|-----------------------------|
| TaxonPage              | TaxonomicalTree             |
|------------------------|-----------------------------|
| TaxonTypeSpecimens     | SeeAlso                     |
|------------------------|-----------------------------|
| TaxonDescriptions      | TaxonOccurrence             |
|------------------------|-----------------------------|
| TaxonSynonyms          | TaxonDistributionSamples    |
|------------------------|-----------------------------|
| TaxonReferences        |                             |
|------------------------|-----------------------------|
| TaxonSpecies           |                             |
|------------------------|-----------------------------|
| TaxonDistributionConop |                             |
|------------------------|-----------------------------|
|TaxonDistributionSamples|                             |
+------------------------+-----------------------------+
|                        Footer                        |
+------------------------------------------------------+
```

Note: The diagram does not reflect exact visual proportions.
It only shows component structure.

The taxon (fetched in `[id].vue`) is passed as a prop to all components.
The taxonPage (fetched in `[id].vue`) is passed as a prop to ```TaxonPage.vue```
and ```SeeAlso.vue``` .

## 📍 Specimens (`/[id]/specimens`)

Displays a table containing specimen-related data for the selected taxon.

### Data

- Data is fetched based on the current taxon (from `[id].vue`)


## 📍 Gallery (`/[id]/gallery`)

Displays all images associated with a taxon.

### Data

- Images are fetched from the API based on the current taxon (from `[id].vue`)
