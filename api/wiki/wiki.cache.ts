const cache = new Map<string, string[]>();

export function getCached(key: string): string[] | undefined {
  return cache.get(key);
}

export function setCached(key: string, value: string[], ttl = 60000): void {
  cache.set(key, value);
  setTimeout(() => cache.delete(key), ttl);
}
