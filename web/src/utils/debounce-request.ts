import { debounce, DebouncedFunc, DebounceSettings } from 'lodash-es';
const debouncedQueue = new Map<string, DebouncedFunc<any>>();

export function debounceRequest(
  debounceKey: string,
  request: () => Promise<unknown>,
  wait = 300,
  options?: DebounceSettings,
): ReturnType<typeof debounce> {
  const lastRequest = debouncedQueue.get(debounceKey);
  if (lastRequest) {
    lastRequest.cancel();
  }
  const debounced = debounce(
    () => {
      request().finally(() => {
        debouncedQueue.delete(debounceKey);
      });
    },
    wait,
    options,
  );
  debouncedQueue.set(debounceKey, debounced);
  return debounced;
}
