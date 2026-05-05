# Fossiilid.info

Interface for simplifying scientific work related to fossils.  
Fossiilid.info serves records collected by TalTech.

![Release](https://img.shields.io/github/v/release/geocollections/fossiilid.info)
![CircleCI](https://img.shields.io/circleci/build/github/geocollections/fossiilid.info)
![last commit](https://img.shields.io/github/last-commit/geocollections/fossiilid.info)
![license](https://img.shields.io/github/license/geocollections/fossiilid.info)

## Tech Stack

- **Frontend:** Nuxt 4
- **Build tool:** Vite
- **CI/CD:** CircleCI

## Quick start

```bash
git clone https://github.com/geocollections/fossiilid.info.git
npm install
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## Deployment
   
   Deployments are automated via CircleCI:
   - Pull requests trigger dev CI builds
   - GitHub releases trigger production deployments
   
   Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.