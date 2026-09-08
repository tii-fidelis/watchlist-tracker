/**
 * Thin wrapper around window.localStorage that's safe to call during SSR
 * (where `window` doesn't exist) and won't throw in private-browsing modes
 * or when storage is disabled/full.
 */

export function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota exceeded or storage disabled — the in-memory store still works
    // for this tab, it just won't persist across reloads.
  }
}
