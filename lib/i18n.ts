// Chrome strings only. Page copy stays Arabic in EN mode, as on the live site.
// ponytail: EN footer/menu strings not yet recorded from the live toggle; they fall back to AR.
export const dict = {
  ar: {
    home: "الرئيسية", library: "مكتبة الموارد", roadmap: "مسار المطور", stacks: "حزم التطبيقات",
    categories: "التصنيفات", standard: "معيار إتقان", beta: "نسخة تجريبية", logoAlt: "شعار رَتْق",
    search: "ابحث في الموارد...", searchAria: "البحث السريع", themeAria: "تبديل المظهر", langAria: "تبديل اللغة",
    menuAria: "القائمة", langBtn: "EN",
  },
  en: {
    home: "Home", library: "Resources Library", roadmap: "Dev Roadmap", stacks: "App Stacks",
    categories: "Categories", standard: "Itqan Standard", beta: "Beta Prototype", logoAlt: "RATQ logo",
    search: "ابحث في الموارد...", searchAria: "Quick search", themeAria: "Toggle theme", langAria: "Toggle language",
    menuAria: "Menu", langBtn: "عربي",
  },
} as const;

export type Dict = (typeof dict)["ar"];
