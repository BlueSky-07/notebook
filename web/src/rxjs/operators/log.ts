import { MonoTypeOperatorFunction, Observer, pipe } from "rxjs"
import { tap } from "rxjs/operators"
import { defaults, isFunction, isString } from 'lodash-es'
import { ObserverLikeRecordProperty, MaybePartialObserverLikeRecord } from '../type'

type ConsoleFn = keyof Pick<typeof console, 'info' | 'error' | 'debug' | 'table' | 'log'>

interface LogOptions {
  timestamp?: boolean
  fn?: MaybePartialObserverLikeRecord<ConsoleFn>
  customFn?: MaybePartialObserverLikeRecord<(...args: any[]) => void>
  prefix?: MaybePartialObserverLikeRecord<string>
}

const DEFAULT_LOG_OPTIONS: LogOptions = {
  timestamp: true,
  fn: {
    next: 'info',
    error: 'error',
    complete: 'info',
  },
}

function getLogFn(
  options: LogOptions,
  property: ObserverLikeRecordProperty,
  fallback: (...args: any[]) => void,
) {
  const rawLogFn = isFunction(options.customFn)
  ? options.customFn
  : options.customFn?.[property]
    ?? (
      isString(options.fn)
        ? console[options.fn as string]?.bind(console)
        : console[options.fn[property]]?.bind(console)
      ) ?? fallback
  const timestampLogFn = options.timestamp
    ? (...args: any[]) => rawLogFn(new Date().toLocaleTimeString(), ...args)
    : rawLogFn
  const prefix: string | null = isString(options.prefix)
    ? options.prefix
    : isString(options.prefix?.[property])
      ? options.prefix?.[property]
      : null
  const prefixLogFn = prefix ?  (...args: any[]) => timestampLogFn(prefix, ...args) : timestampLogFn
  return prefixLogFn
}

export default function log<T>(options: LogOptions = {}): MonoTypeOperatorFunction<T> {
  const finalOptions = defaults(options, DEFAULT_LOG_OPTIONS)
  const logger: Observer<T> = {
    next: getLogFn(finalOptions, 'next', console.info.bind(console)),
    error: getLogFn(finalOptions, 'error', console.info.bind(console)),
    complete: getLogFn(finalOptions, 'complete', console.info.bind(console)),
  }
  return pipe(tap(logger))
}