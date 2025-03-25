import { NodeEntity, NodeDataTypeEnum, GeneratingTaskStatusEnum } from '@api/models'
import { Button, Input, Space, Spin, Tooltip } from '@arco-design/web-react';
import { NodeProps, Node, useNodeConnections } from '@xyflow/react';
import styles from './styles.module.less'
import useFlowStore, { type FlowState } from '@/stores/flow'
import { useShallow } from 'zustand/shallow';
import DefaultHandles from '../../custom-handles'
import API from '@/services/api'
import { useState } from 'react'
import { useRequest } from 'ahooks'
import CopyNode from '../../copy-node'
import { IconBulb, IconPen, IconRecordStop } from '@arco-design/web-react/icon'

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
    ready: generating || generatingTaskStatus === GeneratingTaskStatusEnum.Failed,
    pollingInterval: generating ? 3000 : undefined,
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

  const { getFlowId, getNode, updateNodeData } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'getFlowId' | 'getNode' | 'updateNodeData'>>((state) => ({
      getFlowId: state.getFlowId,
      getNode: state.getNode,
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

  const stopGenerate = async () => {
    const stopGenerateTaskResp = await API.generatingTask.stopGeneratingTask(
      generatingTaskId
    )
    generatingTaskResp.run
  }

  return (
    <>
      <Space className={styles.customTextNode} direction='vertical'>
        <div className={styles.buttons}>
          <span><IconPen /> Text Node @{id}</span>
          <CopyNode flowId={getFlowId()} node={getNode(id)} />
        </div>

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

        <div className={styles.buttons}>
          {!generating && <Button icon={<IconBulb />} type='text' onClick={generateContent}>{generating ? 'Generating': 'Generate'}</Button>}
          {generating && <Button icon={<IconRecordStop />} type='text' status='danger' onClick={stopGenerate}>Stop</Button>}
          {generatingTaskId && <span>GeneratingTask @{generatingTaskId} / <Tooltip content={generatingTaskResp.data?.data?.output?.errorMessage}>{generatingTaskStatus}</Tooltip></span>}
        </div>
      </Space>
      <DefaultHandles />
    </>
  );
}

export default CustomNodeText