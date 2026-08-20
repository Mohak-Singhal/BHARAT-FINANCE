// Lightweight in-memory TTL cache shared by serverless API routes.
// Vercel keeps the module alive between invocations within the same
// instance, so this meaningfully cuts external API calls (rate limits).

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const store = new Map<string, CacheEntry<unknown>>()

const MAX_ENTRIES = 200

export function getCached<T>(key: string): T | null {
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return null
  }
  return entry.data as T
}

export function setCached<T>(key: string, data: T, ttlMs: number): T {
  if (store.size >= MAX_ENTRIES) {
    const oldestKey = store.keys().next().value
    if (oldestKey) store.delete(oldestKey)
  }
  store.set(key, { data, expiresAt: Date.now() + ttlMs })
  return data
}

export async function getOrSetCached<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>
): Promise<T> {
  const cached = getCached<T>(key)
  if (cached !== null) return cached
  const data = await loader()
  return setCached(key, data, ttlMs)
}