import { MaybePromise } from "@/utils/type"
import { MonoTypeOperatorFunction, pipe } from "rxjs"
import { tap } from "rxjs/operators"

interface PutStoreInstance<Data, Key = string> {
  put(key: Key, data: Data): MaybePromise<Key>
}

interface PutStoreOptions<Data, Key = string> {
  instance: PutStoreInstance<Data, Key>
  getData?: (...args: any[]) => Data
  key?: Key
  getKey?: (data: Data) => Key
}

export default function put<T, Data, Key = string>(
  options: PutStoreOptions<Data, Key>
): MonoTypeOperatorFunction<T> {
  return pipe(tap(v => {
    const data = options.getData?.(v) ?? v as unknown as Data
    const key = options.getKey?.(data) ?? options.key ?? crypto.randomUUID() as Key
    options.instance.put(key, data)
  }))
}