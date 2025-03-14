import {
  ReactFlow,
  MiniMap,
  Panel,
  Background,
  BackgroundVariant,
} from '@xyflow/react'
import { useShallow } from 'zustand/react/shallow'
import useFlowStore, { type FlowState } from '@/stores/flow'

interface FlowDashboardProps {
  flowId?: string
}

export const FlowDashboard = (props: FlowDashboardProps) => {
  const { flowId } = props
  // todo use flowId to init data

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'nodes' | 'edges' | 'onNodesChange' | 'onEdgesChange' | 'onConnect'>>((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
    }))
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView={true}
    >
      <MiniMap pannable={true} zoomable={true} />
      <Panel position="bottom-center">
        <div style={{}}>bottom center panel</div>
      </Panel>
      <Background
        id="base"
        gap={10}
        color="#ccc"
        variant={BackgroundVariant.Dots}
      />
    </ReactFlow>
  )
}

export default FlowDashboard