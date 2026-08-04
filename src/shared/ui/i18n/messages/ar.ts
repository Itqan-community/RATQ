export const ar = {
  // Header
  header: {
    nav: {
      resources: 'الموارد',
      about: 'حول',
      dashboard: 'لوحة التحكم',
    },
    auth: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
    },
    langSwitch: {
      ar: 'عربي',
      en: 'English',
    },
    mobileMenu: 'القائمة',
  },

  // Home page
  home: {
    hero: {
      title: 'اكتشف موارد تطوير البرمجيات القرآنية',
      subtitle:
        'المصدر الشامل للمكتبات وأدوات التطوير والمجموعات البيانات وواجهات البرمجة والمراجع العلمية المخصصة لتطوير البرمجيات القرآنية.',
      categories: ['مكتبات', 'أدوات تطوير', 'مجموعات بيانات', 'واجهات برمجة', 'تفاسير'],
    },
    cta: {
      title: 'انشر موردك القرآني',
      subtitle:
        'شارك مكتبتك أو أداة التطوير أو مجموعة البيانات مع المجتمع. وصل إلى المطورين الذين يبنيون الجيل القادم من البرمجيات القرآنية.',
      getStarted: 'ابدأ الآن',
      explore: 'استكشف الموارد',
    },
    featured: {
      title: 'موارد مميزة',
      browseAll: 'تصفح الكل',
      empty: 'لا توجد موارد مميزة بعد.',
    },
    stats: {
      resources: 'موارد',
      publishers: 'منشرون',
      developers: 'مطورون',
      downloads: 'تحميلات',
    },
  },

  // الإعلانات
  announcements: {
    title: 'الإعلانات',
    types: {
      release: 'إصدار جديد',
      new_resource: 'مورد جديد',
      maintenance: 'صيانة',
      breaking_change: 'تغيير جوهري',
    },
    ago: 'منذ {{count}}',
    viewResource: 'عرض المورد',
    learnMore: 'اعرف المزيد',
    viewChangelog: 'عرض سجل التغييرات',
    noAnnouncements: '',
  },

  // الموارد الرائجة
  trending: {
    title: 'الموارد الرائجة',
    browseAll: 'تصفح الكل',
    period7d: '7 أيام',
    period30d: '30 يومًا',
    periodAllTime: 'كل الأوقات',
    downloads: '{{count}} تحميل',
    viewResource: 'عرض المورد',
    rankFirst: 'المركز الأول',
    rankSecond: 'المركز الثاني',
    rankThird: 'المركز الثالث',
  },

  // Catalog page
  catalog: {
    title: 'الموارد',
    subtitle: 'اكتشف المكتبات وأدوات التطوير ومجموعات البيانات وواجهات البرمجة والمراجع العلمية لتطوير البرمجيات القرآنية.',
    showing: 'عرض {{count}} من {{total}} مورد',
    showingSearch: 'عرض {{count}} من {{total}} مورد لـ "{{query}}"',
    empty: {
      title: 'لم يتم العثور على موارد',
      subtitle: 'حاول تعديل الفلاتر أو البحث.',
    },
    sort: {
      by: 'ترتيب حسب',
      options: {
        relevance: 'الأكثر صلة',
        downloads: 'الأكثر تحميلاً',
        newest: 'الأحدث أولاً',
        oldest: 'الأقدم أولاً',
        name_asc: 'الاسم (أ-ي)',
        name_desc: 'الاسم (ي-أ)',
      },
    },
    filters: {
      title: 'الفلاتر',
      type: 'النوع',
      allTypes: 'جميع الأنواع',
      license: 'الترخيص',
      allLicenses: 'الكل',
      itqanBadge: 'موثق بإتقان',
      verifiedOnly: 'موثق فقط',
      notVerified: 'غير موثق',
    },
    types: {
      library: 'مكتبة',
      sdk: 'أداة تطوير',
      dataset: 'مجموعة بيانات',
      api: 'واجهة برمجة',
      tafsir: 'تفسير',
      audio: 'صوت',
      pdf: 'PDF',
      json: 'JSON',
    },
  },

  // Resource card
  resource: {
    itqanBadge: '★ إتقان',
    details: 'التفاصيل',
    github: 'GitHub',
    version: 'الإصدار',
    githubStats: {
      title: 'إحصائيات GitHub',
      stars: 'النجوم',
      forks: 'الشقوق',
      openIssues: 'القضايا المفتوحة',
      lastCommit: 'آخر تحديث',
      viewOnGithub: 'عرض على GitHub',
      statsUnavailable: 'الإحصائيات غير متاحة',
    },
    detail: {
      home: 'الرئيسية',
      resources: 'الموارد',
      description: 'الوصف',
      information: 'المعلومات',
      license: 'الرخصة',
      type: 'النوع',
      created: 'تاريخ الإنشاء',
      updated: 'آخر تحديث',
      version: 'الإصدار',
      documentation: 'التوثيق',
      accessRequest: 'طلب الوصول',
      accessRequestDescription: 'هل تحتاج إلى الوصول إلى هذا المورد؟ أرسل طلباً وسيتم مراجعته من قبل الناشر.',
      quickSummary: 'ملخص سريع',
      status: 'الحالة',
      published: 'منشور',
      itqanCertified: 'شهادة إتقان',
      yes: 'نعم ★',
      no: 'لا',
      // Report
      report: 'إبلاغ',
      reportTooltip: 'إبلاغ عن هذا المورد',
      reportModalTitle: 'إبلاغ عن هذا المورد',
      reportReason: 'السبب',
      reportReasonInaccurate: 'غير دقيق',
      reportReasonInappropriate: 'غير لائق',
      reportReasonInfringing: 'انتهاك حقوق',
      reportReasonSpam: 'مزعج',
      reportReasonOutdated: 'عفا عليه الزمن',
      reportReasonBrokenLink: 'رابط معطل',
      reportDetails: 'تفاصيل (اختياري)',
      reportSubmit: 'إرسال الإبلاغ',
      reportCancel: 'إلغاء',
      reportSuccess: 'تم إرسال الإبلاغ بنجاح',
      reportError: 'فشل إرسال الإبلاغ. يرجى المحاولة مرة أخرى.',
      reportDuplicate: 'لقد قمت بالإبلاغ عن هذا المورد من قبل.',
      // Preview
      preview: 'معاينة',
      previewUnavailable: 'المعاينة غير متاحة لهذا المورد',
      previewCollapse: 'طي المعاينة',
      previewExpand: 'توسيع المعاينة',
      previewApiEndpoint: 'نقطة النهاية',
      previewApiTryIt: 'جربه',
      previewSdkInstall: 'تثبيت',
      previewSdkCopied: 'تم النسخ!',
      previewDatasetRows: 'صفوف',
      previewDatasetColumns: 'أعمدة',
      previewDatasetSize: 'الحجم',
      previewJsonFormat: 'JSON مُنسق',
      relatedResources: 'موارد ذات صلة',
      trustedBy: 'موثوق من قبل',
      trustedByCount: 'موثوق من قبل {{count}} تطبيق',
      showMore: 'عرض الكل ({{count}})',
      showLess: 'عرض أقل',
      comments: 'التعليقات',
      leaveAComment: 'أضف تعليقاً...',
      authorName: 'اسمك',
      post: 'نشر',
      commingSoon: '※ التعليقات ستتوفر قريباً مع الخلفية الخلفية',
      noComments: 'لا توجد تعليقات بعد',
      requestFailed: 'فشل في إرسال الطلب. حاول مرة أخرى.',
      loginToRequest: 'تسجيل الدخول لطلب الوصول',
      loginToReport: 'تسجيل الدخول للإبلاغ',
      requestSent: 'تم إرسال طلب الوصول بنجاح',
      requestReviewed: 'سيتم مراجعة طلبك قريباً',
      accessRequestFor: 'طلب الوصول لـ',
      accessReason: 'اشرح سبب حاجتك للوصول إلى هذا المورد...',
      submit: 'إرسال',
      cancel: 'إلغاء',
    },
  },

  // Footer
  footer: {
    description:
      'منصة مجتمعية لاكتشاف وتوزيع وإدارة موارد تطوير البرمجيات القرآنية. تمكين المطورين والنشرين بسوق موثوق ومختار بعناية.',
    platform: {
      title: 'المنصة',
      browse: 'تصفح الموارد',
      standards: 'معايير الإتقان',
      docs: 'التوثيق',
    },
    community: {
      title: 'المجتمع',
      about: 'حولنا',
      contact: 'تواصل معنا',
      privacy: 'سياسة الخصوصية',
    },
    copyright: '© {{year}} منصة RATQ المجتمعية. جميع الحقوق محفوظة.',
  },

  // Pagination
  pagination: {
    of: 'من',
  },

  // About page
  about: {
    pageTitle: 'حولنا',
    why: {
      paragraph1: 'طويلاً، واجه المطورون الذين يعملون على برمجيات قرآنية نفس التحدي — موارد مبعثرة بين منصات متعددة، بدون وسيلة للتحقق من دقتها أو موثوقيتها. والناشرون الذين يمتلكون محتوى قيّمًا محميًا بحقوق النشر لم يجدوا قناة مهنية لإدارته أو توزيعه.',
      paragraph2: 'نحن مطورون ودارسون وناشرون عشنا هذا التحدي من الداخل. فقررنا أن نبني بيتًا لمجتمعنا — مكانًا تتقاطع فيه الدقة مع الثقة، ويصبح التعاون أسلوب عمل وليس خيارًا. هذه المنصة ليست مجرد دليل، بل هي أساس كيف نبني ونشارك وننمو معًا.',
    },
    whatIs: {
      paragraph1: 'منصة RATQ هي مركز مجتمعي لاكتشاف وتوزيع وإدارة الموارد التطويرية القرآنية. فضاء مشترك يجتمع فيه المطورون للعثور على مكتبات وأدوات وبيانات موثقة، ويشارك فيه الناشرون مواردهم مع المجتمع.',
      paragraph2Before: 'كل مورد على المنصة يُراجع وفق ',
      paragraph2After: '، لضمان الدقة والاكتمال والنسبة الصحيحة لمصدره. سواء كنت تبني تطبيقًا قرآنيًا، أو تبحث في الترجمات، أو تنشر مجموعة بيانات تفسيرية — منصة RATQ هي حيث يجتمع مجتمعنا للبناء معًا وبثقة.',
      standards: '**معايير إتقان**',
    },
    offer: {
      title: 'ماذا نقدم',
      items: {
        catalog: {
          title: 'دليل موارد مختار بعناية',
          description: 'تصفح المكتبات وأدوات التطوير ومجموعات البيانات والواجهات البرمجية والمراجع التفسيرية والترجمات، كل شيء منظم وقابل للبحث في مكان واحد.',
        },
        verification: {
          title: 'التحقق وفق معايير إتقان',
          description: 'الموارد الحاملة لشعار إتقان تمت مراجعتها من قبل مجتمعنا من حيث الدقة والاكتمال والنسبة الصحيحة لمصدرها. ابنِ بثقة على ما تثق به.',
        },
        access: {
          title: 'إدارة الوصول للناشرين',
          description: 'شارك الموارد المحمية أو المقيدة عبر سير عمل منظم. أدر طلبات الوصول، تابع الاستخدام، واحفظ السيطرة على محتواك.',
        },
        community: {
          title: 'تفاعل مجتمعي',
          description: 'قيّم الموارد، اترك تعليقات، وأبلغ عن أي مشكلات. المنصة تنمو وتتقوى مع كل مساهمة من مجتمعنا.',
        },
        tools: {
          title: 'أدوات المطورين',
          description: 'مفاتيح API آمنة، تتبع الإصدارات، وتنبيهات التكامل لتبسيط سير عملك من الاكتشاف إلى النشر.',
        },
      },
    },
    mission: {
      title: 'مهمتنا',
      description: 'أن نمكّن المطورين والناشرين عبر فضاء آمن ومختار ومُدار مجتمعيًا للموارد التطويرية القرآنية — حيث تُتحقق الجودة، ويُبسّط الوصول، وينمو التعاون.',
    },
    vision: {
      title: 'رؤيتنا',
      description: 'أن نكون المعيار العالمي للثقة والدقة والتعاون في التطوير البرمجي القرآني — المكان الأول الذي يلجأ إليه كل مطور، والمنزل الذي يعود إليه كل ناشر.',
    },
  },
};
