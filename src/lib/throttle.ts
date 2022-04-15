export function throttle(callback: () => void, ms: number) {
  let waiting = false;
  let timeout: NodeJS.Timeout = null;
  return (...args: never) => {
    if (waiting) return;
    clearTimeout(timeout);
    callback.apply(this, args);
    waiting = true;
    timeout = setTimeout(() => {
      waiting = false;
    }, ms);
  };
}
