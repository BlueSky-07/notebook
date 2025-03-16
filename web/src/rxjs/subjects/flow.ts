import { type Edge, type Node } from '@xyflow/react'
import { convertFlowEdgeToEdgeEntity, convertFlowNodeToNodeEntity, convertFullDocumentToFlowModel, DEFAULT_FLOW_MODEL, FlowModel, getFlowEdge, getFlowNode } from '@/models/flow'
import { BehaviorSubject, Observable, share } from "rxjs"
import API from '@/services/api'
import { EdgeDataTypeEnum, EdgeEntity, NodeEntity } from '@api/models'
import { produce } from 'immer'
import { debounceRequest } from '@/utils/debounce-request'

export enum FLOW_SUBJECT_STORAGE {
  API, LOCAL_STORAGE
}

export default class FlowSubject {
  private flowId: number
  private localStorageKey: string
  private subject: BehaviorSubject<FlowModel>
  private observable: Observable<FlowModel>
  private unsubscribeMap = new WeakMap<Function, Function>()
  private storage: FLOW_SUBJECT_STORAGE = FLOW_SUBJECT_STORAGE.API

  constructor(flowId: number) {
    this.flowId = flowId
    this.localStorageKey = `flow_${flowId}`
    this.subject = new BehaviorSubject(DEFAULT_FLOW_MODEL)
    this.observable = this.subject.pipe(
      // log({
      //   prefix: 'flow changed:'
      // }),
      share(),
    )
  }

  getFlowId() {
    return this.flowId
  }

  loadFromAPI() {
    this.storage = FLOW_SUBJECT_STORAGE.API
    API.document.getFullDocument(this.flowId)
      .then(r => {
        this.subject.next(
          convertFullDocumentToFlowModel(r.data)
        )
      }).catch(e => {
      console.error(e)
    })
  }

  loadFromLocalStorage(autoSave = true) {
    this.storage = FLOW_SUBJECT_STORAGE.LOCAL_STORAGE
    try {
      const lastStore = localStorage.getItem(this.localStorageKey)
      if (lastStore) {
        this.subject.next(JSON.parse(lastStore))
      }
    } catch (error) {
      this.subject.next(DEFAULT_FLOW_MODEL)
    }
    if (autoSave) {
      this.subscribe((data) => {
        localStorage.setItem(
          this.localStorageKey,
          JSON.stringify(data)
        )
      })
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

  getValue<Path extends keyof FlowModel>(path?: Path):
    (Path extends undefined ? FlowModel : FlowModel[Path]) {
    const value = this.subject.getValue()
    if (path) {
      return value[path] as Path extends undefined ? FlowModel : FlowModel[Path]
    }
    return value as Path extends undefined ? FlowModel : FlowModel[Path]
  }

  next(data: Partial<FlowModel>, replace = false) {
    this.subject.next({
      ...!replace && this.subject.getValue(),
      ...data
    })
  }

  dispatchStorage = <Resp extends unknown>(
    handleAPI: () => Promise<Resp> | Resp,
    handleLocalStorage?: () => typeof handleLocalStorage extends undefined ? void : Resp,
  ): typeof handleAPI | typeof handleLocalStorage => {
    switch (this.storage) {
      case FLOW_SUBJECT_STORAGE.API:
        return handleAPI
      case FLOW_SUBJECT_STORAGE.LOCAL_STORAGE:
        return handleLocalStorage ?? (() => {}) as typeof handleLocalStorage
    }
  }

  async addNode(
    dataType: NodeEntity['dataType'],
    copyFrom?: Node
  ) {
    const newNode = copyFrom ?? getFlowNode(Date.now().toString(), dataType)
    const createResp = await this.dispatchStorage(
      async () => {
        const resp = await API.node.addNode(
          convertFlowNodeToNodeEntity(newNode, this.flowId)
        )
        newNode.id = resp.data.id.toString()
        return newNode
      },
      () => newNode
    )()
    this.next({
      nodes: produce(this.getValue('nodes'), draft => {
        draft.push(createResp)
      })
    })
  }

  async updateNodeData(
    id: string, data: Node['data']
  ) {
    const nodes = this.getValue('nodes')
    const nodeIndex = nodes.findIndex(node => node.id === id)
    if (nodeIndex !== -1) {
      this.next({
        nodes: produce(nodes, draft => {
          draft[nodeIndex].data = data
        })
      })
      this.dispatchStorage(
        debounceRequest(
          `update-node-data-${id}`,
          () => API.node.patchNode(
            parseInt(id), { data }
          ),
        )
      )()
    }
  }

  async updateNodePosition(
    id: string, position: Node['position']
  ) {
    const nodes = this.getValue('nodes')
    const nodeIndex = nodes.findIndex(node => node.id === id)
    if (nodeIndex !== -1) {
      this.next({
        nodes: produce(nodes, draft => {
          draft[nodeIndex].position = position
        })
      })
      this.dispatchStorage(
        debounceRequest(
          `update-node-position-${id}`,
          () => API.node.patchNode(
            parseInt(id), { positionX: position.x, positionY: position.y }
          ),
        ),
      )()
    }
  }

  async deleteNode(
    id: string
  ) {
    const nodes = this.getValue('nodes')
    const nodeIndex = nodes.findIndex(node => node.id === id)
    if (nodeIndex !== -1) {
      this.next({
        nodes: produce(nodes, draft => {
          draft.splice(nodeIndex, 1)
        })
      })
      this.dispatchStorage(
        debounceRequest(
          `delete-node-${id}`,
          () => API.node.deleteNode(
            parseInt(id)
          ),
        )
      )()
    }
  }

  async addEdge(
    source: string,
    target: string,
    sourceHandle: string,
    targetHandle: string,
    dataType: EdgeEntity['dataType'] = EdgeDataTypeEnum.Label,
  ) {
    const newEdge = getFlowEdge(Date.now().toString(), source, target, sourceHandle, targetHandle, dataType)
    const createResp = await this.dispatchStorage(
      async () => {
        const resp = await API.edge.addEdge(
          convertFlowEdgeToEdgeEntity(newEdge, this.flowId)
        )
        newEdge.id = resp.data.id.toString()
        return newEdge
      },
      () => newEdge
    )()
    this.next({
      edges: produce(this.getValue('edges'), draft => {
        draft.push(createResp)
      })
    })
  }

  async updateEdgeData(
    id: string, data: Edge['data']
  ) {
    const edges = this.getValue('edges')
    const edgeIndex = edges.findIndex(edge => edge.id === id)
    if (edgeIndex !== -1) {
      this.next({
        edges: produce(edges, draft => {
          draft[edgeIndex].data = data
        })
      })
      this.dispatchStorage(
        debounceRequest(
          `update-edge-data-${id}`,
          () => API.edge.patchEdge(
            parseInt(id), { data }
          ),
        )
      )()
    }
  }

  async deleteEdge(
    id: string
  ) {
    const edges = this.getValue('edges')
    const edgeIndex = edges.findIndex(edge => edge.id === id)
    if (edgeIndex !== -1) {
      this.next({
        edges: produce(edges, draft => {
          draft.splice(edgeIndex, 1)
        })
      })
      this.dispatchStorage(
        debounceRequest(
          `delete-edge-${id}`,
          () => API.edge.deleteEdge(
            parseInt(id)
          ),
        )
      )()
    }
  }

  complete() {
    this.subject.complete()
  }
}
