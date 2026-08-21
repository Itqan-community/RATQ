import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'
import { fetchResourceGithubData, parseGithubRepoUrl } from '@/lib/github/fetchResourceGithubData'

const BATCH_SIZE = 10
const BATCH_DELAY_MS = 2000

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(request: Request) {
  const jobSecret = process.env.JOBS_SECRET
  const token = process.env.GITHUB_STATS_TOKEN
  if (!jobSecret || !token) {
    return NextResponse.json({ error: 'not_configured' }, { status: 500 })
  }
  if (request.headers.get('x-job-secret') !== jobSecret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })

  const { docs: resources } = await payload.find({
    collection: 'resources',
    where: { github_url: { exists: true } },
    limit: 500,
    sort: 'github_stats_fetched_at',
  })

  let updated = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < resources.length; i += BATCH_SIZE) {
    const batch = resources.slice(i, i + BATCH_SIZE)

    await Promise.all(
      batch.map(async (resource) => {
        const ref = parseGithubRepoUrl(resource.github_url as string)
        if (!ref) {
          skipped += 1
          return
        }

        const data = await fetchResourceGithubData(ref.owner, ref.repo, token)
        if (!data) {
          failed += 1
          return
        }

        await payload.update({
          collection: 'resources',
          id: resource.id,
          data: {
            github_stats: data.stats,
            github_commits: data.commits,
            github_topics: data.topics,
            github_stats_fetched_at: new Date().toISOString(),
          },
        })
        updated += 1
      }),
    )

    if (i + BATCH_SIZE < resources.length) {
      await sleep(BATCH_DELAY_MS)
    }
  }

  return NextResponse.json({ total: resources.length, updated, skipped, failed })
}
