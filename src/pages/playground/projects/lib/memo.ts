export function memo(callback: () => void, key?: string, durationInMs?: number) {
  const cache = new Map<string, () => void>();
  const cacheKey = key ?? callback.toString();
  return (...args: unknown[]) => {
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    const func = callback.apply(this, args);
    cache.set(cacheKey, func);
    setTimeout(
      () => {
        cache.delete(cacheKey);
      },
      durationInMs ? durationInMs : 300
    );
    return func;
  };
}