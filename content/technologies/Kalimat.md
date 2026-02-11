# Kalimat

[Kalimat](https://www.kalimat.dev/) is an advanced neural semantic search engine designed primarily for Islamic content, specifically for the Holy Quran and the six authentic books of Sunnah. It offers a range of services mainly through an API that enables voice or text-based search in over 130 languages. The platform is built to be scalable and user-friendly, making it easy to integrate into various applications.

## Key Features

- **Semantic Search:** Utilizes cutting-edge neural network technology for semantic search, providing accurate and relevant results.
    
- **Multilingual Support:** Search functionalities support over 130 languages, catering to a broad international audience.
    
- **Voice and Text Search:** Allows users to perform searches via voice commands or text inputs.
    
- **Scalability:** Designed from the ground up to handle varying demands, suitable for different application sizes and needs.
    
- **API Integration:** Offers a highly advanced API for seamless integration into web, mobile, or other applications.
    

## Technology and Infrastructure

- Built with neural network-based semantic search technology, likely leveraging modern NLP frameworks, although specific frameworks or languages are not detailed publicly.

## Usage

You can use Kalimat API in you applcation to search in the Quran and Sunnah nut you need API key first.

You can request one by clicking the blue button at the end of their home page that will redirect you to a [google form](https://forms.gle/T2qpkdvwKeDVwkDQ8) to fill it and submit it.

The data they need are full name, email address, organization or company (not required), website or portfolio (not required), project name, platform (web, mobile, etc..), Detailed Use Case Description, Commertial or Personal, and Estimated Monthly API Requests.

Kalimat is not an open-source based on the available information. It offers access to their API after submitting a request.
They provide an API documentation to support developers, you can find it [here](https://api.kalimat.dev/docs/).
The platform aims to provide access to Islamic knowledge through technological means, facilitating research and learning.


## API Example

```txt
https://api.kalimat.dev/api/v2/search?query=allah
```

```json
{
  "data": {
    "results": [
      {
        "id": "2:255",
        "type": "quran_verse",
        "text": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
        "textHighlighted": "<em>اللَّهُ</em> لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
        "translatedText": "Allah - there is no deity except Him, the Ever-Living, the Sustainer",
        "translatedTextHighlighted": "<em>Allah</em> - there is no deity except Him, the Ever-Living, the Sustainer",
        "isTransliteration": false
      }
    ],
    "totalResultsNum": 1
  },
  "meta": {
    "version": "2.0"
  }
}
```
