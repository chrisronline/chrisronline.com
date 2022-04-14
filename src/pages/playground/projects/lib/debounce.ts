export function debounce(callback: () => void, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: unknown[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(this, ...args);
      timer = null;
    }, delay);
  };
}
