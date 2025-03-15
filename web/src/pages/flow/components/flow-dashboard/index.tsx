import {
  ReactFlow,
  MiniMap,
  Panel,
  Background,
  BackgroundVariant,
} from '@xyflow/react'
import { useShallow } from 'zustand/react/shallow'
import useFlowStore, { type FlowState } from '@/stores/flow'
import { Space, Button } from '@arco-design/web-react'
import { NodeDataTypeEnum } from '@api/models'
import { useEffect } from 'react'
import { IconPlusCircle } from '@arco-design/web-react/icon'
import { useCustomNodes } from '../custom-nodes'
import { useCustomEdges } from '../custom-edges'

interface FlowDashboardProps {
  flowId?: string
}

export const FlowDashboard = (props: FlowDashboardProps) => {
  const { flowId } = props

  const nodeTypes = useCustomNodes()
  const edgeTypes = useCustomEdges()
  const {
    bootstrap,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode
  } = useFlowStore(
    useShallow<FlowState, Pick<FlowState,
      | 'bootstrap'
      | 'nodes'
      | 'edges'
      | 'onNodesChange'
      | 'onEdgesChange'
      | 'onConnect'
      | 'addNode'
    >>((state) => ({
      bootstrap: state.bootstrap,
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      addNode: state.addNode,
    }))
  )

  useEffect(() => {
    if (flowId) {
      bootstrap(parseInt(flowId, 10))
    }
  }, [bootstrap, flowId])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      // fitView={true}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
    >
      <MiniMap pannable={true} zoomable={true} />
      <Panel position="bottom-left" style={{ backgroundColor: 'white', padding: 10,  }}>
        <Space>
          <IconPlusCircle /> Add
          <Button onClick={() => addNode(NodeDataTypeEnum.Text)} type='text' size='mini'>Text</Button>
          <Button onClick={() => addNode(NodeDataTypeEnum.Image)} type='text' size='mini'>Image</Button>
        </Space>
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