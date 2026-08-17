import type { GithubCommit, GithubRepoPreview } from '@/types/resource';

interface GithubCommitAuthor {
  name?: string;
  date?: string;
}

interface GithubCommitResponse {
  sha: string;
  html_url: string;
  commit?: {
    message?: string;
    author?: GithubCommitAuthor | null;
    committer?: GithubCommitAuthor | null;
  };
  author?: { login?: string } | null;
}

interface GithubTopicsResponse {
  names?: string[];
}

const GITHUB_API = 'https://api.github.com';
const REVALIDATE = 300;

function githubHeaders(token: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'RATQ (https://github.com/Itqan-community/RATQ)',
  };
}

function mapCommit(item: GithubCommitResponse): GithubCommit {
  const message = (item.commit?.message ?? '').split('\n')[0]?.trim() ?? '';
  const author =
    item.commit?.author?.name ||
    item.commit?.committer?.name ||
    item.author?.login ||
    '';
  const date = item.commit?.author?.date || item.commit?.committer?.date || '';

  return {
    sha: item.sha,
    message,
    author,
    date,
    url: item.html_url,
  };
}

export async function fetchGithubRepoPreview(
  owner: string,
  repo: string,
): Promise<GithubRepoPreview | null> {
  const token = process.env.GITHUB_API_TOKEN;
  if (!token) return null;

  const encodedOwner = encodeURIComponent(owner);
  const encodedRepo = encodeURIComponent(repo);
  const headers = githubHeaders(token);

  try {
    const [commitsRes, topicsRes] = await Promise.all([
      fetch(`${GITHUB_API}/repos/${encodedOwner}/${encodedRepo}/commits?per_page=5`, {
        headers,
        next: { revalidate: REVALIDATE },
      }),
      fetch(`${GITHUB_API}/repos/${encodedOwner}/${encodedRepo}/topics`, {
        headers,
        next: { revalidate: REVALIDATE },
      }),
    ]);

    if (!commitsRes.ok || !topicsRes.ok) return null;

    const commitsJson = (await commitsRes.json()) as GithubCommitResponse[];
    const topicsJson = (await topicsRes.json()) as GithubTopicsResponse;

    if (!Array.isArray(commitsJson)) return null;

    return {
      topics: Array.isArray(topicsJson.names) ? topicsJson.names : [],
      commits: commitsJson.map(mapCommit),
    };
  } catch {
    return null;
  }
}
