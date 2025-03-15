import { NodeEntity, NodeDataTypeEnum, GeneratingTaskStatusEnum } from '@api/models'
import { Button, Input, Space, Spin } from '@arco-design/web-react';
import { NodeProps, Node, useNodeConnections } from '@xyflow/react';
import styles from './styles.module.less'
import useFlowStore, { type FlowState } from '@/stores/flow'
import { useShallow } from 'zustand/shallow';
import DefaultHandles from '../../custom-handles'
import API from '@/services/api'
import { useState } from 'react'
import { useRequest } from 'ahooks'

type CustomNodeTextData = Pick<NodeEntity['data'], 'content'> & {
  $state?: NodeEntity['state']
}

type CustomNodeTextProps = NodeProps<
  Node<CustomNodeTextData, typeof NodeDataTypeEnum.Text>
>

export const CustomNodeText = (props: CustomNodeTextProps) => {
  const { data, id } = props
  const connections = useNodeConnections({
    handleType: 'target',
  });
  const [generatingTaskId, setGeneratingTaskId] = useState(data.$state?.generatingTaskId)
  const [generatingTaskStatus, setGeneratingTaskStatus] = useState(data.$state?.generatingTaskStatus)

  const generating = ([
    GeneratingTaskStatusEnum.Pending,
    GeneratingTaskStatusEnum.Generating,
  ] as GeneratingTaskStatusEnum[]
  ).includes(generatingTaskStatus)

  const generatingTaskResp = useRequest(() => API.generatingTask.getGeneratingTask(generatingTaskId), {
    refreshDeps: [generatingTaskId],
    ready: generating,
    pollingInterval: 5000,
    onSuccess: async (resp) => {
      if (resp.data.status !== GeneratingTaskStatusEnum.Done) {
        setGeneratingTaskStatus(resp.data.status)
        return
      }
      const latestNodeResp = await API.node.getNode(parseInt(id))
      updateNodeData(id, {
        content: latestNodeResp.data.data.content
      })
      setGeneratingTaskId(undefined)
      setGeneratingTaskStatus(undefined)
    }
  })

  const { getFlowId, updateNodeData } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'getFlowId' | 'updateNodeData'>>((state) => ({
      getFlowId: state.getFlowId,
      updateNodeData: state.updateNodeData,
    }))
  )

  const generateContent = async () => {
    const createGenerateTaskResp = await API.generatingTask.addGeneratingTask({
      targetNodeId: parseInt(id),
      flowId: getFlowId(),
      input: {
        sourceNodeIds: Array.from(
          new Set(connections.map(conn => parseInt(conn.source)))
        ),
        edgeIds: Array.from(
          new Set(connections.map(conn => parseInt(conn.edgeId)))
        ),
      }
    })
    setGeneratingTaskId(createGenerateTaskResp.data.id)
    setGeneratingTaskStatus(GeneratingTaskStatusEnum.Pending)
  }
  return (
    <>
      <Space className={styles.customTextNode} direction='vertical'>
        <span>Text Node @{id}</span>

        <Spin loading={generating} style={{ width: '100%' }} tip="Generating">
          <Input.TextArea
            placeholder='Enter text content here, or prompt here then Generate'
            autoSize={{ minRows: 10, maxRows: 10 }}
            value={generating ? [
              data.content, generatingTaskResp.data?.data?.output?.generatedContent
            ].filter(Boolean).join('') : data.content}
            onChange={(v) => {
              updateNodeData(id, {
                content: v,
              })
            }}
            className="nodrag nopan nowheel"
          />
        </Spin>

        <Space className={styles.buttons}>
          <Button type='text' loading={generating} onClick={generateContent}>{generating ? 'Generating': 'Generate'}</Button>
          {generatingTaskId && <span>GeneratingTask @{generatingTaskId} / {generatingTaskStatus}</span>}
        </Space>
      </Space>
      <DefaultHandles />
    </>
  );
}

export default CustomNodeText