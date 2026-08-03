export const en = {
  // Header
  header: {
    nav: {
      resources: 'Resources',
      about: 'About',
      dashboard: 'Dashboard',
    },
    auth: {
      login: 'Log in',
      register: 'Register',
      logout: 'Log out',
    },
    langSwitch: {
      ar: 'عربي',
      en: 'English',
    },
    mobileMenu: 'Menu',
  },

  // Home page
  home: {
    hero: {
      title: 'Discover Quranic Development Assets',
      subtitle:
        'The definitive source of truth for libraries, SDKs, datasets, APIs, and scholarly resources tailored to Quranic software development.',
      categories: ['Libraries', 'SDKs', 'Datasets', 'APIs', 'Tafsir'],
    },
    cta: {
      title: 'Publish Your Quranic Resource',
      subtitle:
        'Share your library, SDK, or dataset with the community. Reach developers building the next generation of Quranic software.',
      getStarted: 'Get Started',
      explore: 'Explore Resources',
    },
    featured: {
      title: 'Featured Resources',
      browseAll: 'Browse all',
      empty: 'No featured resources yet.',
    },
    stats: {
      resources: 'Resources',
      publishers: 'Publishers',
      developers: 'Developers',
      downloads: 'Downloads',
    },
  },

  // Announcements
  announcements: {
    title: 'Announcements',
    types: {
      release: 'New Release',
      new_resource: 'New Resource',
      maintenance: 'Maintenance',
      breaking_change: 'Breaking Change',
    },
    ago: '{{count}} ago',
    viewResource: 'View resource',
    learnMore: 'Learn more',
    viewChangelog: 'View changelog',
    noAnnouncements: '',
  },

  // Trending
  trending: {
    title: 'Trending Resources',
    browseAll: 'Browse all',
    period7d: '7 days',
    period30d: '30 days',
    periodAllTime: 'All-time',
    downloads: '{{count}} downloads',
    viewResource: 'View resource',
    rankFirst: '1st place',
    rankSecond: '2nd place',
    rankThird: '3rd place',
  },

  // Catalog page
  catalog: {
    title: 'Resources',
    subtitle:
      'Discover libraries, SDKs, datasets, APIs, and scholarly resources for Quranic development.',
    showing: 'Showing {{count}} of {{total}} resources',
    showingSearch: 'Showing {{count}} of {{total}} resources for "{{query}}"',
    empty: {
      title: 'No resources found.',
      subtitle: 'Try adjusting your filters or search query.',
    },
    sort: {
      by: 'Sort by',
      options: {
        relevance: 'Relevance',
        downloads: 'Most Downloaded',
        newest: 'Newest First',
        oldest: 'Oldest First',
        name_asc: 'Name (A-Z)',
        name_desc: 'Name (Z-A)',
      },
    },
    filters: {
      title: 'Filters',
      type: 'Type',
      allTypes: 'All Types',
      license: 'License',
      allLicenses: 'All',
      itqanBadge: 'Itqan Verified',
      verifiedOnly: 'Verified only',
      notVerified: 'Not verified',
    },
    types: {
      library: 'Library',
      sdk: 'SDK',
      dataset: 'Dataset',
      api: 'API',
      tafsir: 'Tafsir',
      audio: 'Audio',
      pdf: 'PDF',
      json: 'JSON',
    },
  },

  // Resource card
  resource: {
    itqanBadge: '★ Itqan',
    details: 'Details',
    github: 'GitHub',
    version: 'Version',
    githubStats: {
      title: 'GitHub Statistics',
      stars: 'Stars',
      forks: 'Forks',
      openIssues: 'Open Issues',
      lastCommit: 'Last Commit',
      viewOnGithub: 'View on GitHub',
      statsUnavailable: 'Stats unavailable',
    },
    detail: {
      home: 'Home',
      resources: 'Resources',
      description: 'Description',
      information: 'Information',
      license: 'License',
      type: 'Type',
      created: 'Created',
      updated: 'Last Updated',
      version: 'Version',
      documentation: 'Documentation',
      accessRequest: 'Request Access',
      accessRequestDescription: 'Need access to this resource? Submit a request and it will be reviewed by the publisher.',
      quickSummary: 'Quick Summary',
      status: 'Status',
      published: 'Published',
      itqanCertified: 'Itqan Certified',
      yes: 'Yes ★',
      no: 'No',
      relatedResources: 'Related Resources',
      trustedBy: 'Trusted By',
      trustedByCount: 'Trusted by {{count}} applications',
      showMore: 'Show all {{count}}',
      showLess: 'Show less',
      comments: 'Comments',
      leaveAComment: 'Leave a comment...',
      authorName: 'Your name',
      post: 'Post',
      commingSoon: '※ Comments will be available soon with the backend',
      noComments: 'No comments yet',
      requestFailed: 'Failed to submit request. Please try again.',
      loginToRequest: 'Log in to request access',
      loginToReport: 'Log in to report',
      // Report
      report: 'Report',
      reportTooltip: 'Report this resource',
      reportModalTitle: 'Report this resource',
      reportReason: 'Reason',
      reportReasonInaccurate: 'Inaccurate',
      reportReasonInappropriate: 'Inappropriate',
      reportReasonInfringing: 'Infringing',
      reportReasonSpam: 'Spam',
      reportReasonOutdated: 'Outdated',
      reportReasonBrokenLink: 'Broken link',
      reportDetails: 'Details (optional)',
      reportSubmit: 'Submit Report',
      reportCancel: 'Cancel',
      reportSuccess: 'Report submitted successfully',
      reportError: 'Failed to submit report. Please try again.',
      reportDuplicate: "You've already reported this resource.",
      // Preview
      preview: 'Preview',
      previewUnavailable: 'Preview not available for this resource',
      previewCollapse: 'Collapse preview',
      previewExpand: 'Expand preview',
      previewApiEndpoint: 'Endpoint',
      previewApiTryIt: 'Try it',
      previewSdkInstall: 'Install',
      previewSdkCopied: 'Copied!',
      previewDatasetRows: 'Rows',
      previewDatasetColumns: 'Columns',
      previewDatasetSize: 'Size',
      previewJsonFormat: 'Formatted JSON',
      requestSent: 'Access request submitted successfully',
      requestReviewed: 'Your request will be reviewed soon',
      accessRequestFor: 'Request access for',
      accessReason: 'Explain why you need access to this resource...',
      submit: 'Submit',
      cancel: 'Cancel',
    },
  },

  // Footer
  footer: {
    description:
      'A community-driven hub for discovering, distributing, and governing Quranic development assets. Empowering developers and publishers with a trusted, curated marketplace.',
    platform: {
      title: 'Platform',
      browse: 'Browse Resources',
      standards: 'Itqan Standards',
      docs: 'Documentation',
    },
    community: {
      title: 'Community',
      about: 'About Us',
      contact: 'Contact',
      privacy: 'Privacy Policy',
    },
    copyright: '© {{year}} RATQ Community Platform. All rights reserved.',
  },

  // Pagination
  pagination: {
    of: 'of',
  },

  // About page
  about: {
    pageTitle: 'About Us',
    why: {
      paragraph1: 'For too long, developers building Quranic software have faced the same struggle — resources scattered across GitHub, personal blogs, and academic portals. No way to verify accuracy. No trusted standard. Publishers with valuable, copyright-protected content had no professional way to manage access or track usage.',
      paragraph2: 'We are developers, scholars, and publishers who lived this frustration every day. So we built a home for our community — a place where discovery is simple, quality is verified, and collaboration is the norm. This platform is not just a directory. It is the foundation of how we build, share, and grow together.',
    },
    whatIs: {
      paragraph1: 'RATQ is a community-driven hub for discovering, distributing, and governing Quranic development assets. It is a shared space where developers find verified libraries, SDKs, datasets, and APIs — and publishers share their resources with the community.',
      paragraph2Before: 'Every resource on the platform is reviewed against the ',
      paragraph2After: ', ensuring accuracy, completeness, and proper attribution. Whether you\'re building a Quranic app, researching translations, or publishing a tafsir dataset, RATQ is where our community comes together to build with trust.',
      standards: '**Itqan Standards**',
    },
    offer: {
      title: 'What We Offer',
      items: {
        catalog: {
          title: 'A Curated Resource Catalog',
          description: 'Browse libraries, SDKs, datasets, APIs, tafsir references, and translations, all organized and searchable in one place.',
        },
        verification: {
          title: 'Itqan Standards Verification',
          description: 'Resources earning the Itqan badge have been reviewed by our community for accuracy, completeness, and proper attribution. You can trust what you build on.',
        },
        access: {
          title: 'Access Management for Publishers',
          description: 'Share restricted or copyright-protected resources with a structured workflow. Manage access requests, track usage, and maintain control over your content.',
        },
        community: {
          title: 'Community Engagement',
          description: 'Rate resources, leave comments, and report issues. The platform grows stronger with every contribution from our community.',
        },
        tools: {
          title: 'Developer Tools',
          description: 'Secure API keys, version tracking, and integration webhooks to streamline your workflow from discovery to deployment.',
        },
      },
    },
    mission: {
      title: 'Our Mission',
      description: 'To empower developers and publishers with a secure, curated, and community-governed space for Quranic development resources — where quality is verified, access is streamlined, and collaboration thrives.',
    },
    vision: {
      title: 'Our Vision',
      description: 'To become the global standard for trust, accuracy, and collaboration in Quranic software development — a place every developer turns to first, and every publisher calls home.',
    },
  },
};
