export function throttle(callback: () => void, ms: number) {
  let waiting = false;
  return (...args: never) => {
    if (waiting) return;
    waiting = true;
    setTimeout(() => {
      callback.apply(this, args);
      waiting = false;
    }, ms)
  }
}