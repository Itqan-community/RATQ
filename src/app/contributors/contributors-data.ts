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
      'Built this Contributors page and fixed the developer view navbar overlap, then built out the real developer notifications backend (a new Payload collection wired into access requests, reports, and comments), wired pagination into the resources catalog, and found and fixed a stored XSS vulnerability in the JSON preview component.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/197',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/210',
  },
  {
    name: 'HamzaElabboubi',
    githubUsername: 'HamzaElabboubi',
    githubUrl: 'https://github.com/HamzaElabboubi',
    avatarUrl: 'https://github.com/HamzaElabboubi.png',
    contribution:
      'Stripped a stray UTF-8 BOM byte from source files, after independently verifying which of the originally-listed files still existed post-restructure.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/171',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/205',
  },
  {
    name: 'mayafouad',
    githubUsername: 'mayafouad',
    githubUrl: 'https://github.com/mayafouad',
    avatarUrl: 'https://github.com/mayafouad.png',
    contribution:
      'Added an admin override so admins can delete or update any comment, while keeping regular users restricted to their own - with tests covering every role case.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/156',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/203',
  },
  {
    name: 'Thabetahmed',
    githubUsername: 'Thabetahmed',
    githubUrl: 'https://github.com/Thabetahmed',
    avatarUrl: 'https://github.com/Thabetahmed.png',
    contribution:
      'Fixed a React hydration mismatch that fired on every page load for logged-in users, by moving the localStorage read out of the initial render and into a post-hydration effect.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/154',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/202',
  },
  {
    name: 'Abdalla2200',
    githubUsername: 'Abdalla2200',
    githubUrl: 'https://github.com/Abdalla2200',
    avatarUrl: 'https://github.com/Abdalla2200.png',
    contribution:
      'Fixed pages loading scrolled-to-bottom and animating up on navigation, by adding smooth-scroll behavior to the html element - his own diagnosed fix from when he opened the issue.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/187',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/195',
  },
  {
    name: 'phaghidow',
    githubUsername: 'phaghidow',
    githubUrl: 'https://github.com/phaghidow',
    avatarUrl: 'https://github.com/phaghidow.png',
    contribution:
      'Added a Contributor Covenant code of conduct and a short governance section explaining who has merge rights and how decisions get made.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/167',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/208',
  },
];
