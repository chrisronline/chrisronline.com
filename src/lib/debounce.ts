export function debounce(callback: Function, ms: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any) => {
    window.clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(this, args), ms);
  }
}