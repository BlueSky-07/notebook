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
import { DataTypeEnum } from '@api/models'
import { useEffect, useMemo } from 'react'
import CustomNodeText from '../custom-nodes/Text'
import { IconPlusCircle } from '@arco-design/web-react/icon'

interface FlowDashboardProps {
  flowId?: string
}

export const FlowDashboard = (props: FlowDashboardProps) => {
  const { flowId } = props

  const nodeTypes = useMemo(() => {
    return {
      [DataTypeEnum.Text]: CustomNodeText
    }
  }, [])

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
      fitView={true}
      nodeTypes={nodeTypes}
    >
      <MiniMap pannable={true} zoomable={true} />
      <Panel position="bottom-left" style={{ backgroundColor: 'white', padding: 10,  }}>
        <Space>
          <IconPlusCircle /> Add
          <Button onClick={() => addNode(DataTypeEnum.Text)} type='text' size='mini'>Text</Button>
          <Button onClick={() => addNode(DataTypeEnum.Image)} type='text' size='mini'>Image</Button>
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