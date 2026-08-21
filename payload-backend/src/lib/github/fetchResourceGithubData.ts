interface GithubRepoStatsResponse {
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  pushed_at: string
}

interface GithubCommitResponse {
  sha: string
  html_url: string
  commit?: { message?: string; author?: { name?: string; date?: string } | null }
  author?: { login?: string } | null
}

interface GithubTopicsResponse {
  names?: string[]
}

const GITHUB_API = 'https://api.github.com'

function githubHeaders(token: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'RATQ (https://github.com/Itqan-community/RATQ)',
  }
}

export interface FetchedGithubData {
  stats: { stars: number; forks: number; open_issues: number; last_commit: string }
  commits: { sha: string; message: string; author: string; date: string; url: string }[]
  topics: string[]
}

export function parseGithubRepoUrl(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'github.com') return null
    const parts = parsed.pathname.replace(/\/+$/, '').split('/').filter(Boolean)
    if (parts.length !== 2) return null
    const [owner, rawRepo] = parts
    return { owner, repo: rawRepo.replace(/\.git$/i, '') }
  } catch {
    return null
  }
}

export async function fetchResourceGithubData(
  owner: string,
  repo: string,
  token: string,
): Promise<FetchedGithubData | null> {
  const headers = githubHeaders(token)
  const encodedOwner = encodeURIComponent(owner)
  const encodedRepo = encodeURIComponent(repo)

  try {
    const [repoRes, commitsRes, topicsRes] = await Promise.all([
      fetch(`${GITHUB_API}/repos/${encodedOwner}/${encodedRepo}`, { headers }),
      fetch(`${GITHUB_API}/repos/${encodedOwner}/${encodedRepo}/commits?per_page=5`, { headers }),
      fetch(`${GITHUB_API}/repos/${encodedOwner}/${encodedRepo}/topics`, { headers }),
    ])

    if (!repoRes.ok || !commitsRes.ok || !topicsRes.ok) return null

    const repoJson: GithubRepoStatsResponse = await repoRes.json()
    const commitsJson = (await commitsRes.json()) as GithubCommitResponse[]
    const topicsJson = (await topicsRes.json()) as GithubTopicsResponse

    if (!Array.isArray(commitsJson)) return null

    return {
      stats: {
        stars: repoJson.stargazers_count,
        forks: repoJson.forks_count,
        open_issues: repoJson.open_issues_count,
        last_commit: repoJson.pushed_at,
      },
      commits: commitsJson.map((item) => ({
        sha: item.sha,
        message: (item.commit?.message ?? '').split('\n')[0]?.trim() ?? '',
        author: item.commit?.author?.name || item.author?.login || '',
        date: item.commit?.author?.date || '',
        url: item.html_url,
      })),
      topics: Array.isArray(topicsJson.names) ? topicsJson.names : [],
    }
  } catch {
    return null
  }
}
