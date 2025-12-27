/**
 * Client-side cache system with staleness detection
 */

const CACHE_KEY = 'arc-raiders-items-cache';
const CACHE_TIMESTAMP_KEY = 'arc-raiders-cache-timestamp';
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface CacheMetadata {
  timestamp: number;
  itemCount: number;
  version: string;
}

export interface CachedData<T> {
  data: T;
  metadata: CacheMetadata;
}

/**
 * Check if cache exists and is still fresh
 */
export function isCacheFresh(): boolean {
  if (typeof window === 'undefined') return false;

  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  if (!timestamp) return false;

  const age = Date.now() - parseInt(timestamp, 10);
  return age < CACHE_MAX_AGE;
}

/**
 * Get cached data if available
 */
export function getCachedData<T>(): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed: CachedData<T> = JSON.parse(cached);
    return parsed.data;
  } catch (error) {
    console.error('Failed to parse cached data:', error);
    return null;
  }
}

/**
 * Get cache metadata
 */
export function getCacheMetadata(): CacheMetadata | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed: CachedData<unknown> = JSON.parse(cached);
    return parsed.metadata;
  } catch (error) {
    return null;
  }
}

/**
 * Store data in cache
 */
export function setCachedData<T>(data: T): void {
  if (typeof window === 'undefined') return;

  try {
    const cachedData: CachedData<T> = {
      data,
      metadata: {
        timestamp: Date.now(),
        itemCount: Array.isArray(data) ? data.length : 0,
        version: '1.0',
      },
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Failed to cache data:', error);
  }
}

/**
 * Clear cache
 */
export function clearCache(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
}

/**
 * Get cache age in milliseconds
 */
export function getCacheAge(): number | null {
  if (typeof window === 'undefined') return null;

  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  if (!timestamp) return null;

  return Date.now() - parseInt(timestamp, 10);
}

/**
 * Get human-readable cache age
 */
export function getCacheAgeString(): string {
  const age = getCacheAge();
  if (!age) return 'No cache';

  const hours = Math.floor(age / (60 * 60 * 1000));
  const minutes = Math.floor((age % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours}h ${minutes}m ago`;
  }
  return `${minutes}m ago`;
}
