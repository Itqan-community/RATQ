interface PaginatedDocs<T> {
  docs: T[];
  totalPages?: number;
}

/**
 * Follow a Payload paginated listing to the end so counts reflect every record,
 * not the first `limit` (dashboard stat cards read these totals).
 */
export async function fetchAllPages<T>(
  buildUrl: (page: number) => string,
  onBadStatus: () => Error,
): Promise<T[]> {
  const out: T[] = [];
  let page = 1;
  for (;;) {
    const res = await fetch(buildUrl(page), { credentials: 'include' });
    if (!res.ok) throw onBadStatus();
    const data = (await res.json()) as PaginatedDocs<T>;
    out.push(...(data.docs ?? []));
    if (page >= (data.totalPages ?? 1)) break;
    page += 1;
  }
  return out;
}
