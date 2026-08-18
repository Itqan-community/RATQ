export interface GithubRepoRef {
  owner: string;
  repo: string;
}

/**
 * Accepts only https://github.com/{owner}/{repo}, optionally with a trailing
 * slash or .git suffix. Anything else (http, other hosts, extra path) is null.
 */
export function parseGithubRepoUrl(url: string | null | undefined): GithubRepoRef | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return null;
    if (parsed.hostname !== 'github.com') return null;

    const parts = parsed.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    if (parts.length !== 2) return null;

    const [owner, rawRepo] = parts;
    const repo = rawRepo.replace(/\.git$/i, '');
    if (!owner || !repo) return null;

    return { owner, repo };
  } catch {
    return null;
  }
}
