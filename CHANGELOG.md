# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

### Changed
The site and its API moved to quran.tech and api.quran.tech. Sign-in now stays on quran.tech with the session cookie on .quran.tech (everyone signed in before the move signs in once more), and ratq.itqan.dev redirects to quran.tech. api.ratq.itqan.dev keeps answering as an alias for API keys.

Rebranded to Quran Tech Directory / دليل التقنيات القرآنية with a new logo, favicon, app icons and default share image; pages that only run on sample data are hidden on production and return a real 404, beta keeps them (#370)

Internal names renamed: `qtd` color tokens, `qtd_` storage keys with a one-time migration of saved settings (#372)

Beta moved to https://beta.quran.tech; beta.ratq.itqan.dev redirects there. The backend deploy script now deploys `main` only, so unpromoted beta work can no longer ship with a production push.

### Added
Resources imported from the quran.tech sources sheet now show their sheet fields: the catalog filters by content domain, riwayah, language and whether an API exists, and the detail page lists API links, authentication, data formats, rate limits, download, repository, license, scholarly review, attribution and verification date (missing values read Not stated, English falls back to Arabic)

Beta now has its own API and database (a scrubbed copy of production data), deployed from the `beta` branch, so beta work and imports no longer touch production

Public GitHub Discussions link and this CHANGELOG, linked from README (#168)

Separate beta site built from the `beta` branch: shows the Demo pages, stays noindex; contributor PRs target `beta` (#369)
