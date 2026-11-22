# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

### Changed
The site and its API moved to quran.tech and api.quran.tech. Sign-in now stays on quran.tech with the session cookie on .quran.tech (everyone signed in before the move signs in once more), and ratq.itqan.dev redirects to quran.tech. api.ratq.itqan.dev keeps answering as an alias for API keys.

### Added
Resources imported from the quran.tech sources sheet now show their sheet fields: the catalog filters by content domain, riwayah, language and whether an API exists, and the detail page lists API links, authentication, data formats, rate limits, download, repository, license, scholarly review, attribution and verification date (missing values read Not stated, English falls back to Arabic)
Public GitHub Discussions link and this CHANGELOG, linked from README (#168)