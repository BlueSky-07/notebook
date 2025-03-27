import { Observer } from 'rxjs';

export type ObserverLikeRecordProperty = keyof Observer<unknown>;
export type ObserverLikeRecord<T> = Record<ObserverLikeRecordProperty, T>;
export type MaybeObserverLikeRecord<T> = T | ObserverLikeRecord<T>;
export type MaybePartialObserverLikeRecord<T> =
  | T
  | Partial<ObserverLikeRecord<T>>;
