# RATQ

RATQ is the developer marketplace at the center of the Itqan ecosystem: a place where developers discover, verify, and integrate Quranic-data resources, including libraries, SDKs, datasets, APIs, and tafsir sources.

This repo's `main` branch is a Next.js/TypeScript rebuild in active development, previewable at [beta.ratq.itqan.dev](https://beta.ratq.itqan.dev) and [ratq.itqan.dev](https://ratq.itqan.dev). The product is still pre-launch (see the roadmap). The old static-wiki version of this repo is preserved on the `old_main` branch for reference.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - start the dev server
- `npm run build` / `npm start` - production build and start
- `npm run lint` - lint
- `npm test` / `npm run test:run` - tests (watch / single run)

## Docs

- [RATQ Community Platform overview](./docs/RATQ%20Community%20Platform.md) - strategic overview and roadmap.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup details, coding standards, and the PR process. All contributions target the `main` branch.

## License

[MIT](./LICENSE)
