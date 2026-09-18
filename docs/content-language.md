# Resource content language

Resource records may declare the language of their human-facing content. The
field should use a stable BCP 47 language tag, remain optional for existing
records, and drive the page direction only where the content is rendered. API
validation and fixtures should cover both an English `en` record and an Arabic
`ar` record.
