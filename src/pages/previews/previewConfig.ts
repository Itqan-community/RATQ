// src/pages/previews/previewConfig.ts
import {
  Layers,
  FolderTree,
  LucideIcon,
} from 'lucide-react';

export interface PreviewIdea {
  id: string;
  path: string;
  number: number;
  titleAr: string;
  titleEn: string;
  shortLabelAr: string;
  taglineAr: string;
  descriptionAr: string;
  tagAr: string;
  icon: LucideIcon;
}

export const PREVIEW_IDEAS: PreviewIdea[] = [
  {
    id: 'sections',
    path: '/resources/preview-sections',
    number: 1,
    titleAr: 'العرض بالأقسام مع شريط القفز اللاصق',
    titleEn: 'Categorized Sections with Sticky Scroll-Spy',
    shortLabelAr: '١. أقسام وشريط قفز لاصق',
    taglineAr: 'العرض بالأقسام مع شريط القفز اللاصق ومعالجة السكرول الطويل',
    descriptionAr:
      'تقسيم الموارد وفق فئات واضحة مع شريط علوي لاصق يتيح القفز الفوري لأي قسم، مع إمكانية طي وتوسيع الموارد داخل كل قسم.',
    tagAr: 'أقسام مصنفة',
    icon: Layers,
  },
  {
    id: 'tree-explorer',
    path: '/resources/preview-tree-explorer',
    number: 2,
    titleAr: 'مستكشف المجلدات الهرمي القابل للطي',
    titleEn: 'Collapsible Directory Tree (VS Code Explorer)',
    shortLabelAr: '٢. مستكشف شجري هرمي',
    taglineAr: 'تصفح شجري منظم وسريع للأصول البرمجية',
    descriptionAr:
      'مجلدات معمارية رئيسية وفرعية يمكن طيها وتوسيعها بنقرة واحدة، مع استعراض تفاصيل المورد المحدد في اللوحة المجاورة.',
    tagAr: 'استكشاف مجلدات',
    icon: FolderTree,
  },
];
