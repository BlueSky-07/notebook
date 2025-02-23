import {
  ReactFlow,
  MiniMap,
  Panel,
  Background,
  BackgroundVariant,
} from '@xyflow/react'
import { useShallow } from 'zustand/react/shallow'
import useFlowStore, { type FlowState } from '@/stores/flow'

import '@xyflow/react/dist/style.css'

export default function App() {
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
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView={true}
      >
        <MiniMap pannable={true} zoomable={true} />
        <Panel position="top-left">
          <div style={{ background: 'white', width: 300, height: 'calc(100vh - 30px)', border: '1px solid gray' }}>
            Panel
          </div>
        </Panel>
        <Background
          id="base"
          gap={10}
          color="#ccc"
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </div>
  )
}
