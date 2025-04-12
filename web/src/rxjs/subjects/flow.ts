import {
  type Edge,
  type Node,
  type NodeDimensionChange,
  type NodePositionChange,
  type XYPosition,
} from '@xyflow/react';
import {
  convertFlowEdgeToEdgeEntity,
  convertFlowFullToFlowModel,
  convertFlowNodeToNodeEntity,
  DEFAULT_FLOW_MODEL,
  FlowModel,
  getInitialFlowEdge,
  getInitialFlowNode,
} from '@/models/flow';
import { BehaviorSubject, Observable, share } from 'rxjs';
import API from '@/services/api';
import { EdgeDataTypeEnum, EdgeEntity, NodeEntity } from '@api/models';
import { produce } from 'immer';
import { debounceRequest } from '@/utils/debounce-request';
import { get, random, set } from 'lodash-es';

export enum FLOW_SUBJECT_STORAGE {
  API,
  LOCAL_STORAGE,
}

export default class FlowSubject {
  private readonly flowId: number;
  private readonly localStorageKey: string;
  private subject: BehaviorSubject<FlowModel>;
  private observable: Observable<FlowModel>;
  private storage: FLOW_SUBJECT_STORAGE = FLOW_SUBJECT_STORAGE.API;

  constructor(flowId: number) {
    this.flowId = flowId;
    this.localStorageKey = `flow_${flowId}`;
    this.subject = new BehaviorSubject(DEFAULT_FLOW_MODEL);
    this.observable = this.subject.pipe(share());
  }

  getFlowId() {
    return this.flowId;
  }

  async loadFromAPI() {
    this.storage = FLOW_SUBJECT_STORAGE.API;
    try {
      const r = await API.flow.getFlowFull(this.flowId);
      this.subject.next(convertFlowFullToFlowModel(r.data));
    } catch (e) {
      console.error(e);
    }
  }

  loadFromLocalStorage(autoSave = true) {
    this.storage = FLOW_SUBJECT_STORAGE.LOCAL_STORAGE;
    try {
      const lastStore = localStorage.getItem(this.localStorageKey);
      if (lastStore) {
        this.subject.next(JSON.parse(lastStore));
      }
    } catch (error) {
      this.subject.next(DEFAULT_FLOW_MODEL);
    }
    if (autoSave) {
      this.subscribe((data) => {
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
      });
    }
  }

  subscribe(nextFn: (data: FlowModel) => void) {
    return this.observable.subscribe(nextFn);
  }

  getValue<Path extends keyof FlowModel>(
    path?: Path,
  ): Path extends undefined ? FlowModel : FlowModel[Path] {
    const value = this.subject.getValue();
    if (path) {
      return value[path] as Path extends undefined
        ? FlowModel
        : FlowModel[Path];
    }
    return value as Path extends undefined ? FlowModel : FlowModel[Path];
  }

  next(data: Partial<FlowModel>, replace = false) {
    this.subject.next({
      ...(!replace && this.subject.getValue()),
      ...data,
    });
  }

  dispatchStorage = <Resp>(
    handleAPI: () => Promise<Resp> | Resp,
    handleLocalStorage?: () => typeof handleLocalStorage extends undefined
      ? void
      : Resp,
  ): typeof handleAPI | typeof handleLocalStorage => {
    switch (this.storage) {
      case FLOW_SUBJECT_STORAGE.API:
        return handleAPI;
      case FLOW_SUBJECT_STORAGE.LOCAL_STORAGE:
        return handleLocalStorage ?? ((() => {}) as typeof handleLocalStorage);
    }
  };

  async addNode(
    dataType: NodeEntity['dataType'],
    copyFrom?: Node,
    center?: XYPosition,
  ) {
    const newNode =
      copyFrom ?? getInitialFlowNode(Date.now().toString(), dataType);
    if (center && !copyFrom) {
      newNode.position.x = center.x + random(-100, 100);
      newNode.position.y = center.y + random(-100, 100);
    }
    const createResp = await this.dispatchStorage(
      async () => {
        const resp = await API.node.addNode(
          convertFlowNodeToNodeEntity(newNode, this.flowId),
        );
        newNode.id = resp.data.id.toString();
        return newNode;
      },
      () => newNode,
    )();
    this.next({
      nodes: produce(this.getValue('nodes'), (draft) => {
        draft.push(createResp);
      }),
    });
    return createResp;
  }

  updateNodeData(id: string, data: Node['data']) {
    const nodes = this.getValue('nodes');
    const nodeIndex = nodes.findIndex((node) => node.id === id);
    if (nodeIndex !== -1) {
      this.next({
        nodes: produce(nodes, (draft) => {
          draft[nodeIndex].data = data;
        }),
      });
      return this.dispatchStorage(
        debounceRequest(`update-node-data-${id}`, () =>
          API.node.patchNode(parseInt(id), { data }),
        ),
      )();
    }
  }

  updateNodePosition(id: Node['id'], change: NodePositionChange) {
    const nodes = this.getValue('nodes');
    const nodeIndex = nodes.findIndex((node) => node.id === id);
    if (nodeIndex !== -1) {
      this.next({
        nodes: produce(nodes, (draft) => {
          draft[nodeIndex].position = change.position;
        }),
      });
      const node = nodes[nodeIndex];
      if (change.dragging) {
        // don't save layout of dragging node, just update ui
        return;
      }

      return this.dispatchStorage(
        debounceRequest(`update-node-layout-${id}`, () =>
          API.node.patchNode(parseInt(id), {
            layout: {
              positionX: change.position.x,
              positionY: change.position.y,
              width: node.width,
              height: node.height,
              hidden: node.hidden,
            },
          }),
        ),
      )();
    }
  }

  updateNodeDimension(id: Node['id'], change: NodeDimensionChange) {
    const nodes = this.getValue('nodes');
    const nodeIndex = nodes.findIndex((node) => node.id === id);
    if (nodeIndex !== -1) {
      this.next({
        nodes: produce(nodes, (draft) => {
          if (!change.dimensions) {
            return;
          }
          draft[nodeIndex].width = change.dimensions.width;
          draft[nodeIndex].height = change.dimensions.height;
        }),
      });
      const node = nodes[nodeIndex];
      if (change.resizing || !node.selected) {
        // don't save layout of resizing node or non-selected node, just update ui
        return;
      }

      return this.dispatchStorage(
        debounceRequest(`update-node-layout-${id}`, () =>
          API.node.patchNode(parseInt(id), {
            layout: {
              positionX: node.position.x,
              positionY: node.position.y,
              width: change.dimensions?.width ?? node.width,
              height: change.dimensions?.height ?? node.height,
              hidden: node.hidden,
            },
          }),
        ),
      )();
    }
  }

  updateNodeHidden(id: Node['id'], hidden: Node['hidden']) {
    const nodes = this.getValue('nodes');
    const nodeIndex = nodes.findIndex((node) => node.id === id);
    if (nodeIndex !== -1) {
      this.next({
        nodes: produce(nodes, (draft) => {
          draft[nodeIndex].hidden = hidden;
        }),
      });
      const node = nodes[nodeIndex];
      return this.dispatchStorage(
        debounceRequest(`update-node-layout-${id}`, () =>
          API.node.patchNode(parseInt(id), {
            layout: {
              positionX: node.position.x,
              positionY: node.position.y,
              width: node.width,
              height: node.height,
              hidden,
            },
          }),
        ),
      )();
    }
  }

  deleteNode(id: Node['id']) {
    const nodes = this.getValue('nodes');
    const nodeIndex = nodes.findIndex((node) => node.id === id);
    if (nodeIndex !== -1) {
      this.next({
        nodes: produce(nodes, (draft) => {
          draft.splice(nodeIndex, 1);
        }),
      });
      return this.dispatchStorage(
        debounceRequest(`delete-node-${id}`, () =>
          API.node.deleteNode(parseInt(id)),
        ),
      )();
    }
  }

  async addEdge(
    source: Edge['source'],
    target: Edge['target'],
    sourceHandle: Edge['sourceHandle'],
    targetHandle: Edge['targetHandle'],
    dataType: EdgeEntity['dataType'] = EdgeDataTypeEnum.Label,
  ) {
    const newEdge = getInitialFlowEdge(
      Date.now().toString(),
      source,
      target,
      sourceHandle,
      targetHandle,
      dataType,
    );
    const createResp = await this.dispatchStorage(
      async () => {
        const resp = await API.edge.addEdge(
          convertFlowEdgeToEdgeEntity(newEdge, this.flowId),
        );
        newEdge.id = resp.data.id.toString();
        return newEdge;
      },
      () => newEdge,
    )();
    this.next({
      edges: produce(this.getValue('edges'), (draft) => {
        draft.push(createResp);
      }),
    });
  }

  updateEdgeData(id: Edge['id'], data: Edge['data']) {
    const edges = this.getValue('edges');
    const edgeIndex = edges.findIndex((edge) => edge.id === id);
    if (edgeIndex !== -1) {
      this.next({
        edges: produce(edges, (draft) => {
          draft[edgeIndex].data = data;
        }),
      });
      return this.dispatchStorage(
        debounceRequest(`update-edge-data-${id}`, () =>
          API.edge.patchEdge(parseInt(id), { data }),
        ),
      )();
    }
  }

  deleteEdge(id: Edge['id']) {
    const edges = this.getValue('edges');
    const edgeIndex = edges.findIndex((edge) => edge.id === id);
    if (edgeIndex !== -1) {
      this.next({
        edges: produce(edges, (draft) => {
          draft.splice(edgeIndex, 1);
        }),
      });
      return this.dispatchStorage(
        debounceRequest(`delete-edge-${id}`, () =>
          API.edge.deleteEdge(parseInt(id)),
        ),
      )();
    }
  }

  complete() {
    this.subject.complete();
  }
}
