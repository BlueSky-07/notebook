import { NodeEntity, NodeDataTypeEnum } from '@api/models'
import { Input } from '@arco-design/web-react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import styles from './styles.module.less'
import useFlowStore, { type FlowState } from '@/stores/flow'
import { useShallow } from 'zustand/shallow';

type CustomNodeTextData = Pick<NodeEntity['data'], 'content'>

type CustomNodeTextProps = NodeProps<
  Node<CustomNodeTextData, typeof NodeDataTypeEnum.Text>
>

export const CustomNodeText  = (props: CustomNodeTextProps) => {
  const { data, id } = props

  const { updateNodeData: updateNode } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'updateNode'>>((state) => ({
      updateNodeData: state.updateNodeData,
    }))
  )

  return (
    <>
      <div className={styles.customTextNode}>
        Node @{id}

        <Input.TextArea
          placeholder='Enter text content here'
          autoSize={{ minRows: 2, maxRows: 10 }}
          value={data.content}
          onChange={(v) => {
            updateNode(id, {
              content: v
            })
          }}
          className="nodrag"
        />
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
      />
    </>
  );
}

export default CustomNodeText