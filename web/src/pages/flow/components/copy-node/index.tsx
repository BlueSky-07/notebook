import { Button, Dropdown, Menu } from "@arco-design/web-react"
import { useRequest } from "ahooks"
import API from '@/services/api'
import useFlowStore, { FlowState } from "@/stores/flow"
import { useShallow } from "zustand/shallow"
import { type Node } from '@xyflow/react'
import { NodeEntity } from "@api/models"
import { convertFlowNodeToNodeEntity } from "@/models/flow"
import { useEffect, useState } from "react"
import { IconCheckCircleFill, IconCopy } from "@arco-design/web-react/icon"

interface CopyNodeProps {
  flowId: number;
  node: Node
}

export const CopyNode = (props: CopyNodeProps) => {
  const { flowId, node } = props
  const [done, setDone] = useState(false)

  const { addNode } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'addNode'>>(state => ({
      addNode: state.addNode
    }))
  )

  const listResp = useRequest((pageNumber?: number) => API.flow.getAllFlows(10, pageNumber), {
    manual: true,
  })

  useEffect(() => {
    setTimeout(() => setDone(false), 3000)
  }, [done])

  return (
    <Dropdown droplist={(
      listResp.loading ? null : (
        <Menu onClickMenuItem={async (key) => {
          const newNode = {
            ...node,
            id: Date.now().toString(),
          }
          if (key === flowId.toString()) {
            addNode(node.type as NodeEntity['dataType'], {
              ...newNode,
              position: { x: node.position.x + 100, y: node.position.y + 100 }
            })
          } else {
            await API.node.addNode(
              convertFlowNodeToNodeEntity(newNode, parseInt(key))
            )
            setDone(true)
          }
        }}>
          {(listResp.data?.data?.items ?? []).map(
            item => (
              <Menu.Item
                key={item.id.toString()}
                style={{ backgroundColor: item.id === flowId ? 'aliceblue' : undefined }}
              >
                {item.name}
              </Menu.Item>
            )
          )}
        </Menu>
      )
    )} onVisibleChange={(visible) => {
      if (visible) listResp.run()
    }}>
      <Button
        icon={done ? <IconCheckCircleFill /> : <IconCopy />}
        size='mini'
        type='text'
        status={done ? 'success' : 'default'}
        loading={listResp.loading}
      >
        {done? 'Done' : 'Copy'}
      </Button>
    </Dropdown>
  )
}

export default CopyNode