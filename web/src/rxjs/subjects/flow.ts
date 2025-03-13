import { DEFAULT_FLOW_MODEL, FlowModel } from '@/models/flow'
import { BehaviorSubject, Observable, share } from "rxjs"
import log from '../operators/log'
import put from '../operators/put'
import API from '@/services/api'

const LOCAL_STORAGE_KEY = 'flow'

export default class FlowSubject {
  private subject: BehaviorSubject<FlowModel>
  private observable: Observable<FlowModel>
  private unsubscribeMap = new WeakMap<Function, Function>()

  constructor(data?: FlowModel) {
    if (data) {
      this.subject = new BehaviorSubject(data)
    } else {
      // test api
      API.document.getFullDocument(1).then(r => {
        console.log('full document', r.data)
      })
      try {
        const lastStore = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (lastStore) {
          this.subject = new BehaviorSubject(JSON.parse(lastStore))
        }
      } finally {
        if (!this.subject) {
          this.subject = new BehaviorSubject(DEFAULT_FLOW_MODEL)
        }
      }
    }
    this.observable = this.subject.pipe(
        log({
          prefix: 'flow changed:'
        }),
        put<FlowModel, string>({
          instance: {
            put: (key, data) => {
              localStorage.setItem(key, data)
              return key
            }
          },
          key: LOCAL_STORAGE_KEY,
          getData: (d) => JSON.stringify(d)
        }),
        share(),
      )
  }

  subscribe(nextFn: (data: FlowModel) => void) {
    const subscription = this.observable.subscribe(nextFn)
    this.unsubscribeMap.set(nextFn, subscription.unsubscribe.bind(subscription))
    return subscription
  }

  unsubscribe(nextFn: (data: FlowModel) => void) {
    const unsubscribe = this.unsubscribeMap.get(nextFn)
    if (unsubscribe) unsubscribe()
  }

  next(data: FlowModel) {
    this.subject.next(data)
  }

  complete() {
    this.subject.complete()
  }
}
