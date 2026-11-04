// Demo personas behind the header role switcher (captured from the live site; role is in-memory only).
export const ROLES = [
  {
    "id": "developer",
    "label": "مطور (Developer)",
    "name": "أحمد المنصور",
    "handle": "@ahmed_dev",
    "letter": "أ"
  },
  {
    "id": "publisher_owner",
    "label": "ناشر (Publisher)",
    "name": "د. طارق الهاشمي (ناشر معتمد)",
    "handle": "@quran_tech",
    "letter": "د"
  },
  {
    "id": "reviewer",
    "label": "مراجع إتقان (Reviewer)",
    "name": "د. سليمان الخالد (مراجع معتمد)",
    "handle": "@dr_sulaiman",
    "letter": "د"
  },
  {
    "id": "moderator",
    "label": "مشرف (Moderator)",
    "name": "عمر الرشيدي (مشرف المجتمع)",
    "handle": "@omar_mod",
    "letter": "ع"
  },
  {
    "id": "admin",
    "label": "مسؤول المنصة (Admin)",
    "name": "الإدارة المركزية (مدير المنصة)",
    "handle": "@admin_ratq",
    "letter": "ا"
  },
  {
    "id": "guest",
    "label": "زائر (Guest)"
  }
] as const;

export type RoleId = (typeof ROLES)[number]["id"];
