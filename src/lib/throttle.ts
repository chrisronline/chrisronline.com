export function throttle(callback: Function, ms: number) {
  let waiting = false;
  return (...args: any) => {
    if (waiting) return;
    waiting = true;
    setTimeout(() => {
      callback.apply(this, args);
      waiting = false;
    }, ms)
  }
}