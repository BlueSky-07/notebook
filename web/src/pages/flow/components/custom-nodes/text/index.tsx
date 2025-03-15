import { NodeEntity, NodeDataTypeEnum } from '@api/models'
import { Input } from '@arco-design/web-react';
import { NodeProps, Node } from '@xyflow/react';
import styles from './styles.module.less'
import useFlowStore, { type FlowState } from '@/stores/flow'
import { useShallow } from 'zustand/shallow';
import DefaultHandles from '../../custom-handles'

type CustomNodeTextData = Pick<NodeEntity['data'], 'content'>

type CustomNodeTextProps = NodeProps<
  Node<CustomNodeTextData, typeof NodeDataTypeEnum.Text>
>

export const CustomNodeText  = (props: CustomNodeTextProps) => {
  const { data, id } = props

  const { updateNodeData } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'updateNodeData'>>((state) => ({
      updateNodeData: state.updateNodeData,
    }))
  )

  return (
    <>
      <div className={styles.customTextNode}>
        Text Node @{id}

        <Input.TextArea
          placeholder='Enter text content here'
          autoSize={{ minRows: 2, maxRows: 10 }}
          value={data.content}
          onChange={(v) => {
            updateNodeData(id, {
              content: v
            })
          }}
          className="nodrag"
        />
      </div>
      <DefaultHandles />
    </>
  );
}

export default CustomNodeText