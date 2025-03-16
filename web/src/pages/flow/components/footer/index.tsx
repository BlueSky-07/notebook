import { Space, Button } from '@arco-design/web-react'
import { NodeDataTypeEnum, NodeEntity } from '@api/models'
import { IconPlusCircle } from '@arco-design/web-react/icon'
import { useShallow } from 'zustand/react/shallow'
import useFlowStore, { type FlowState } from '@/stores/flow'
import { useReactFlow, useStoreApi } from '@xyflow/react'

export const Footer = () => {
  const store = useStoreApi()
  const { screenToFlowPosition } = useReactFlow()

  const handleAdd = (
    type: NodeEntity['dataType'],
  ) =>{
    const { domNode } = store.getState()
    const boundingRect = domNode?.getBoundingClientRect()
    if (boundingRect) {
      const center = screenToFlowPosition({
        x: boundingRect.x + boundingRect.width / 2,
        y: boundingRect.y + boundingRect.height / 2,
      })
      addNode(type, undefined, center)
    } else {
      addNode(type)
    }
  }

  const {
    addNode
  } = useFlowStore(
    useShallow<FlowState, Pick<FlowState,
      | 'addNode'
    >>((state) => ({
      addNode: state.addNode,
    }))
  )

  return (
    <Space>
      <IconPlusCircle /> Add
      <Button onClick={() => handleAdd(NodeDataTypeEnum.Text)} type='text' size='mini'>Text</Button>
      <Button onClick={() => handleAdd(NodeDataTypeEnum.Image)} type='text' size='mini'>Image</Button>
    </Space>
)
}