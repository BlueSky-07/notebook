import { debounce, DebouncedFunc, DebounceSettings } from 'lodash-es';

const debouncedQueue = new Map<string, DebouncedFunc<any>>();

export function debounceRequest<Resp>(
  debounceKey: string,
  request: () => Promise<Resp>,
  wait = 300,
  options?: DebounceSettings,
) {
  const lastRequest = debouncedQueue.get(debounceKey);
  if (lastRequest) {
    lastRequest.cancel();
  }
  const debounced = debounce(
    () =>
      request().finally(() => {
        debouncedQueue.delete(debounceKey);
      }),
    wait,
    options,
  );
  debouncedQueue.set(debounceKey, debounced);
  return debounced;
}
