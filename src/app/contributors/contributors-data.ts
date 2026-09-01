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
      'Built this Contributors page and fixed the developer view navbar overlap, then built out the real developer notifications backend (a new Payload collection wired into access requests, reports, and comments), wired pagination into the resources catalog, found and fixed a stored XSS vulnerability in the JSON preview component, and later added four missing content pages (Contact, Privacy, Standards, Docs) with the footer links wired to them. Later added image upload support for resources, and then added a payload-backend typecheck step to CI after a type error slipped through undetected.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/250',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/251',
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
      'Fixed pages loading scrolled-to-bottom and animating up on navigation, by adding smooth-scroll behavior to the html element - his own diagnosed fix from when he opened the issue. Later added bilingual accessibility labels to the pagination buttons, then added a sort dropdown to the resources catalog with URL-based state, matching the existing filter pattern.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/148',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/220',
  },
  {
    name: 'phaghidow',
    githubUsername: 'phaghidow',
    githubUrl: 'https://github.com/phaghidow',
    avatarUrl: 'https://github.com/phaghidow.png',
    contribution:
      "Added a Contributor Covenant code of conduct and a short governance section explaining who has merge rights and how decisions get made, then documented AccessRequests' publisher-scope limitation.",
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/159',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/212',
  },
  {
    name: 'hugoboss092',
    githubUsername: 'hugoboss092',
    githubUrl: 'https://github.com/hugoboss092',
    avatarUrl: 'https://github.com/hugoboss092.png',
    contribution:
      "Fixed the last two English strings that had slipped through the Report modal - the reason dropdown's default option and the details placeholder - wiring both through the existing i18n system with real Arabic/English translations and tests for both locales.",
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/162',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/214',
  },
  {
    name: 'boss-moh',
    githubUsername: 'boss-moh',
    githubUrl: 'https://github.com/boss-moh',
    avatarUrl: 'https://github.com/boss-moh.png',
    contribution:
      'Wired the already-built AnnouncementsCarousel component into the homepage, replacing the old static banner that could only ever show one fixed message - the homepage now surfaces real, rotating announcements. Later did the same for Trending Resources, and found the real reason it had nothing to show (a downloads-based filter with no real download data yet to filter on).',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/155',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/241',
  },
  {
    name: 'OmarMontaser',
    githubUsername: 'OmarMontaser',
    githubUrl: 'https://github.com/OmarMontaser',
    avatarUrl: 'https://github.com/OmarMontaser.png',
    contribution:
      'Created CHANGELOG.md and added a Community section to the README linking to GitHub Discussions and the changelog, giving the project a public discussion channel and a clear changelog for anyone following along.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/168',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/237',
  },
  {
    name: 'samyrebiha',
    githubUsername: 'samyrebiha',
    githubUrl: 'https://github.com/samyrebiha',
    avatarUrl: 'https://github.com/samyrebiha.png',
    contribution:
      "Fixed a UX gap where an already-authenticated user could still land on the login page and see the form again - added an automatic redirect to the dashboard, with a loading guard so the form never flashes on screen while the session is being checked, plus tests covering both states. Later added the access-control test coverage the Users and Resources collections were missing - privilege escalation, owner-spoofing, and slug-collision handling all included.",
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/239',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/244',
  },
  {
    name: 'Walid-Khalfa',
    githubUsername: 'Walid-Khalfa',
    githubUrl: 'https://github.com/Walid-Khalfa',
    avatarUrl: 'https://github.com/Walid-Khalfa.png',
    contribution:
      'Built the real Payload backend for Announcements, replacing the mock data it had been running on - a proper collection with admin-only writes, public reads scoped to active/non-expired announcements, and resource links that resolve through the real catalog instead of pointing at fake resource IDs. Later added Edge Cache for GitHub repository previews, caching successful responses per-repository while explicitly excluding failed, invalid, or missing-token results from the cache.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/222',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/256',
  },
  {
    name: 'Zyad-Eltayabi',
    githubUsername: 'Zyad-Eltayabi',
    githubUrl: 'https://github.com/Zyad-Eltayabi',
    avatarUrl: 'https://github.com/Zyad-Eltayabi.png',
    contribution:
      "Added accessible names to the catalog search input and the consumer avatar links, so screen reader users get a real label instead of relying on placeholder text or nothing at all.",
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/232',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/243',
  },
  {
    name: 'Ramahadam',
    githubUsername: 'Ramahadam',
    githubUrl: 'https://github.com/Ramahadam',
    avatarUrl: 'https://github.com/Ramahadam.png',
    contribution:
      "Added session-expiry handling for authenticated API requests - an expired or invalid JWT now clears auth state and redirects to login with a clear message, while keeping that distinct from a genuine permission denial on a still-valid session.",
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/165',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/245',
  },
  {
    name: 'bessmasarri',
    githubUsername: 'bessmasarri',
    githubUrl: 'https://github.com/bessmasarri',
    avatarUrl: 'https://github.com/bessmasarri.png',
    contribution:
      "Fixed a security gap where any authenticated user could generate an API key for any resource regardless of ownership or an approved access request - added a validation guard requiring resource ownership or an approved access request before allowing key creation, with test coverage for all three cases. Later fixed another security gap where draft/unpublished resources and their comments were publicly readable via the API - added multi-tier access control (owner, admin, public-published-only) to both collections, with full test coverage.",
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/151',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/254',
  },
  {
    name: 'ekafe',
    githubUsername: 'ekafe',
    githubUrl: 'https://github.com/ekafe',
    avatarUrl: 'https://github.com/ekafe.png',
    contribution:
      "Added forgot-password, reset-password, and email-verification flows - previously missing entirely, so users who forgot their password now have a real way to recover their account.",
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/233',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/253',
  },
  {
    name: 'farhaghallab3',
    githubUsername: 'farhaghallab3',
    githubUrl: 'https://github.com/farhaghallab3',
    avatarUrl: 'https://github.com/farhaghallab3.png',
    contribution:
      'Fixed toast notifications always rendering left-aligned with LTR text regardless of the active language, even in Arabic mode - now reads the real direction from useLanguage() and switches both positioning and the dir attribute accordingly, with tests covering both locales.',
    issueUrl: 'https://github.com/Itqan-community/RATQ/issues/276',
    prUrl: 'https://github.com/Itqan-community/RATQ/pull/277',
  },
];
