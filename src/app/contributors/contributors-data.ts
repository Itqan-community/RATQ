export interface Contributor {
  name: string;
  githubUsername: string;
  githubUrl: string;
  avatarUrl: string;
  contribution: string;
  issueUrl: string;
  prUrl: string;
}

// Curated by hand alongside the Flarum Hall of Fame post and GitHub
// Discussion leaderboard (see issue #197). Update this list manually when a
// new community PR is merged and added to those two sources.
export const contributors: Contributor[] = [
  {
    name: 'Omarr-kh',
    githubUsername: 'Omarr-kh',
    githubUrl: 'https://github.com/Omarr-kh',
    avatarUrl: 'https://github.com/Omarr-kh.png',
    contribution:
      'Removed a fake, hardcoded GitHub repo browser from the resource detail page, and later removed a dead font-face declaration that was causing 4 failed requests per page load.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/180',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/188',
  },
  {
    name: 'sanataff',
    githubUsername: 'sanataff',
    githubUrl: 'https://github.com/sanataff',
    avatarUrl: 'https://github.com/sanataff.png',
    contribution:
      'Deleted dead i18n source files (en.ts / ar.ts) that were never imported, fixed the stale docs pointing to them, and later wired the developer comments page to real data instead of mock comments.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/172',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/191',
  },
  {
    name: 'abatn',
    githubUsername: 'abatn',
    githubUrl: 'https://github.com/abatn',
    avatarUrl: 'https://github.com/abatn.png',
    contribution:
      "Fixed a missing 'Home' nav i18n key that was hardcoded as a ternary instead of going through the translation object.",
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/173',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/190',
  },
  {
    name: 'usefahmed07',
    githubUsername: 'usefahmed07',
    githubUrl: 'https://github.com/usefahmed07',
    avatarUrl: 'https://github.com/usefahmed07.png',
    contribution:
      'Built this Contributors page, and fixed the developer view navbar overlapping the sidebar.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/197',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/201',
  },
];
