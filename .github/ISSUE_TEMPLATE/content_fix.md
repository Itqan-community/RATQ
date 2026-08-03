---
name: Copy / translation fix
about: Typo, wrong wording, or an English/Arabic mismatch in the app's UI text
title: "[Content] "
labels: documentation
assignees: ""
---

## Where

<!-- Page and/or component, e.g. src/components/resources/ResourceCard.tsx -->

## What needs fixing

<!-- Typo, wrong translation, missing translation key, hardcoded string that should use src/i18n/messages -->

## Acceptance criteria

- [ ] Text is corrected in both `src/i18n/messages/ar.json` and `en.json` where applicable
- [ ] No hardcoded strings introduced, uses the `t.*` translation object
