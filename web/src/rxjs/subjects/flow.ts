import { convertFullDocumentToFlowModel, DEFAULT_FLOW_MODEL, FlowModel } from '@/models/flow'
import { BehaviorSubject, Observable, pipe, share } from "rxjs"
import log from '../operators/log'
import API from '@/services/api'

export default class FlowSubject {
  private flowId: number
  private localStorageKey: string
  private subject: BehaviorSubject<FlowModel>
  private observable: Observable<FlowModel>
  private unsubscribeMap = new WeakMap<Function, Function>()
  private enabledAutoSaveToLocalStorage = false

  constructor(flowId: number) {
    this.flowId = flowId
    this.localStorageKey = `flow_${flowId}`
    this.subject = new BehaviorSubject(DEFAULT_FLOW_MODEL)
    this.observable = this.subject.pipe(
      log({
        prefix: 'flow changed:'
      }),
      share(),
    )
  }

  loadFromAPI() {
    API.document.getFullDocument(this.flowId)
      .then(r => {
        this.subject.next(
          convertFullDocumentToFlowModel(r.data)
        )
      }).catch(e => {
      console.error(e)
    })
    this.enableAutoSaveToLocalStorage()
  }

  loadFromLocalStorage() {
    try {
      const lastStore = localStorage.getItem(this.localStorageKey)
      if (lastStore) {
        this.subject.next(JSON.parse(lastStore))
      }
    } catch (error) {
      this.subject.next(DEFAULT_FLOW_MODEL)
    }
    this.enableAutoSaveToLocalStorage()
  }

  enableAutoSaveToLocalStorage() {
    if (!this.enabledAutoSaveToLocalStorage) {
      this.subscribe((data) => {
        localStorage.setItem(
          this.localStorageKey,
          JSON.stringify(data)
        )
      })
      this.enabledAutoSaveToLocalStorage = true
    }
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
