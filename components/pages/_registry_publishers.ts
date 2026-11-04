export const REG: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "alfanous-team": () => import("./publishers__alfanous-team"),
  "islamhouse": () => import("./publishers__islamhouse"),
  "king-fahd-complex": () => import("./publishers__king-fahd-complex"),
  "mknoon-society": () => import("./publishers__mknoon-society"),
  "quran-com": () => import("./publishers__quran-com"),
  "quran-qiraat": () => import("./publishers__quran-qiraat"),
  "quran-tech-foundation": () => import("./publishers__quran-tech-foundation"),
  "quranpedia": () => import("./publishers__quranpedia"),
  "ratq": () => import("./publishers__ratq"),
  "saudi-recitations-center": () => import("./publishers__saudi-recitations-center"),
  "tafsir-studies-center": () => import("./publishers__tafsir-studies-center"),
  "tahbeer-qiraat": () => import("./publishers__tahbeer-qiraat"),
  "uthmanic-type-lab": () => import("./publishers__uthmanic-type-lab"),
};

export const TITLES: Record<string, string> = {"alfanous-team": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية", "islamhouse": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية", "king-fahd-complex": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية", "mknoon-society": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية", "quran-com": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية", "quran-qiraat": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية", "quran-tech-foundation": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية", "quranpedia": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية", "ratq": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية", "saudi-recitations-center": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية", "tafsir-studies-center": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية", "tahbeer-qiraat": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية", "uthmanic-type-lab": "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية"};
