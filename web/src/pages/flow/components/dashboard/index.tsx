import {
  ReactFlow,
  MiniMap,
  Panel,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import { useShallow } from 'zustand/react/shallow';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useEffect, useRef } from 'react';
import { useCustomNodes } from '../../custom-nodes';
import { useCustomEdges } from '../../custom-edges';
import { Footer } from '../footer';
import { ConfigProvider } from '@arco-design/web-react';
import { FlowEntity } from '@api/models';
import enUS from '@arco-design/web-react/es/locale/en-US';
import ConnectionLine from '../connection-line';
import ReactFlowRefForwarder, {
  ReactFlowRef,
} from '../react-flow-ref-forwarder';

interface FlowDashboardProps {
  flowId?: FlowEntity['id'];
}

export const FlowDashboard = (props: FlowDashboardProps) => {
  const { flowId } = props;
  const reactFlowRef = useRef<ReactFlowRef>(null);

  const nodeTypes = useCustomNodes();
  const edgeTypes = useCustomEdges();
  const {
    bootstrap,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    minimapVisible,
  } = useFlowStore(
    useShallow<
      FlowState,
      Pick<
        FlowState,
        | 'bootstrap'
        | 'nodes'
        | 'edges'
        | 'onNodesChange'
        | 'onEdgesChange'
        | 'onConnect'
        | 'minimapVisible'
      >
    >((state) => ({
      bootstrap: state.bootstrap,
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      minimapVisible: state.minimapVisible,
    })),
  );

  useEffect(() => {
    if (flowId) {
      bootstrap(flowId, reactFlowRef);
    }
  }, [bootstrap, flowId]);

  return (
    <ConfigProvider
      locale={enUS}
      // fit react-flow zoom ratio
      componentConfig={{
        Tooltip: {
          getPopupContainer: () => document.body,
        },
        Popover: {
          getPopupContainer: () => document.body,
        },
        Select: {
          getPopupContainer: (node) => node,
        },
        Dropdown: {
          getPopupContainer: (node) => node,
        },
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // fitView={true}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={ConnectionLine}
      >
        {minimapVisible && <MiniMap pannable={true} zoomable={true} />}
        <Panel position="bottom-left">
          <Footer />
        </Panel>
        <Background
          id="base"
          gap={10}
          color="#ccc"
          variant={BackgroundVariant.Dots}
        />
        <ReactFlowRefForwarder ref={reactFlowRef} />
      </ReactFlow>
    </ConfigProvider>
  );
};

export default FlowDashboard;
