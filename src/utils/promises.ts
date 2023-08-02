export function memoize<T>(func: () => Promise<T>) {
  let cachedPromise: Promise<T> | null = null;
  return () => {
    if (cachedPromise != null) {
      return cachedPromise;
    }

    cachedPromise = func();
    cachedPromise.finally(() => {
      cachedPromise = null;
    });
    return cachedPromise;
  };
}
