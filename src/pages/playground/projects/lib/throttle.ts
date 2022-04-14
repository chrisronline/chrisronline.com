export function throttle(callback: () => void, delay: number) {
  let called = false;
  let lastArgs: unknown[] = null;
  return (...args: unknown[]) => {
    if (called) {
      lastArgs = args;
      return;
    }
    called = true;
    callback.apply(this, ...args);
    setTimeout(() => {
      callback.apply(this, lastArgs);
      lastArgs = null;
      called = false;
    }, delay);
  };
}
