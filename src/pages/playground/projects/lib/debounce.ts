export function debounce<T>(callback: (...callbackArgs: unknown[]) => T, delay: number, leading?: boolean) {
  let timer: NodeJS.Timeout;
  return (...args: unknown[]) => {
    if (timer) {
      clearTimeout(timer);
    } else if (leading) {
      callback.apply(this, args);
    }
    timer = setTimeout(() => {
      if (!leading) callback.apply(this, args);
      timer = null;
    }, delay);
  };
}
