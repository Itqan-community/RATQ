# quran.com-API

[quran.com-API](https://api-docs.quran.foundation/docs/category/content-apis/) is a RESTful API provided by [Quran.Foundation](../Quran.Foundation.md) that is designed to empower Muslim App developers to build on top of the same backend that powers Quran Foundation apps. These APIs provide the functionality and content on Quran.com and QuranReflect, facilitating easy access to comprehensive ayah and surah level content. User authentication enhances the App's functionality, enabling the sync of bookmarks, notes, reflections, reading history, streaks, and more. By integrating with this APIs users can enjoy a rich connected experience across Quranic apps, and you can focus on innovating unique solutions that the world needs.

Quran.Foundation Content APIs offer programmatic access to the Quran's core content like chapters, verses, recitations, translations, and more, distinct from user-specific data like notes and bookmarks provided by User-related APIs.

## Usage

The API is well documented, so no need to repeat it here. Just vist the link and follow the guidance.

## Source Code

The code is written in Ruby and you can find is in this repository [quran.com-api](https://github.com/quran/quran.com-api).

## Resources and Contributions

- [tanzil](./tanzil.md): An international Quranic project aimed at providing a highly-verified precise Quran text.
- [QuranComplex](https://qurancomplex.gov.sa/): King Fahd Glorious Qur'an Printing Complex is a leader in serving the Glorious Qur'an and its Sciences, translating its Meanings, and safeguarding the Qur'anic Text from distortion, through the optimal use of advanced technologies in the field of printing, audio recordings, electronic publishing and digital applications.
- [Collin Fair](https://github.com/cpfair/quran-align): A tool for producing word-precise segmentation of recorded Qur'anic recitation.
- [QuranEnc](https://quranenc.com/en/home): A portal featuring free and trustworthy translations of the meanings and exegeses of the noble Qur'an in many world languages.
- [Zekr](https://zekr.org): An open platform Quran study tool for browsing and researching on the Quran
- [Tarteel](https://tarteel.ai/): An AI-powered Quran memorization app. It's designed to help you memorize smarter, whether you're searching for a verse, tracking your progress, or following along with your recitation.
- [Lokalize](https://lokalise.com/): A computer-aided translation system that focuses on productivity and quality assurance and provides a seamless localization workflow.

## Searching Feature

The architecture of Quran.com search integrates both Elasticsearch and [Kalimat](./Kalimat.md) to leverage their respective strengths, but they serve different roles within the system.

### Elasticsearch Components

- **Core Search Back-end**: Elasticsearch acts as the primary engine for full-text search. It indexes Quranic data and helps perform fast, keyword-based searches across large volumes of text.​
- **Index and Shard Management**: It manages the creation of indices, primary shards, and replicas. Elasticsearch distributes data across nodes for scalability, fault tolerance, and load balancing.
- **Data Storage and Retrieval**: Handles storage of Quranic data, supporting real-time querying, filtering, and aggregations. Elasticsearch responds quickly to keyword and phrase searches, making it suitable for straightforward search needs.

### Kalimat Components

- **Semantic Search Layer**: Kalimat is a neural network-based semantic search engine that understands the context and meaning of queries. It enriches the search process by interpreting user intent beyond simple keyword matching.
- **Complementary Role**: It likely overlays or integrates with Elasticsearch, providing more nuanced, concept-based search results, especially for complex or natural language questions. Kalimat interacts with the search API, analyzing either part of or the entire query for better relevance.

### How They Work Together

- **Hybrid Architecture**
  Elasticsearch handles rapid, full-text searches. Kalimat processes user queries for semantic understanding. The combined system sends semantic insights from Kalimat to enhance or refine the search query in Elasticsearch.
- **Workflow**: When a user makes a search:
  1. Kalimat interprets the query to understand its context.
  2. The optimized or enriched query is sent to Elasticsearch.
  3. Elasticsearch retrieves precise keyword matches, which are then filtered or ranked based on Kalimat’s understanding.

### Diagram Concept

While no explicit diagram was available in the search results, the architecture can be visualized as:

```text
User Query
    |
    v
Kalimat (Semantic Understanding)
    |
    v
Enhanced Search Query
    |
    v
Elasticsearch (Full-Text Index & Search)
    |
    v
Search Results
```

## Conclusion

quran.com provide the users with web, android, and IOS applications both online and offline and provides developers with an API that requires only a request for the API-Key at the first time (and it is free). But it does not provided in source data by any means. Only contributors can have a mini dumb by joining their slack channel and requesting it from the project's collaborator.
