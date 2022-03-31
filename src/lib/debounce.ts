export function debounce(callback: () => void, ms: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any) => {
    window.clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(this, args), ms);
  };
}
