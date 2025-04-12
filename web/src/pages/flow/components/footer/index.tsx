import { Space } from '@arco-design/web-react';
import { NodeDataTypeEnum, NodeEntity } from '@api/models';
import { IconImage, IconPen } from '@arco-design/web-react/icon';
import { useShallow } from 'zustand/react/shallow';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useReactFlow, useStoreApi } from '@xyflow/react';
import styles from './styles.module.less';
import TipButton from '@/components/tip-button';

export const Footer = () => {
  const store = useStoreApi();
  const { screenToFlowPosition } = useReactFlow();

  const handleAdd = (type: NodeEntity['dataType']) => {
    const { domNode } = store.getState();
    const boundingRect = domNode?.getBoundingClientRect();
    if (boundingRect) {
      const center = screenToFlowPosition({
        x: boundingRect.x + boundingRect.width / 2,
        y: boundingRect.y + boundingRect.height / 2,
      });
      addNode(type, undefined, center);
    } else {
      addNode(type);
    }
  };

  const { addNode } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'addNode'>>((state) => ({
      addNode: state.addNode,
    })),
  );

  return (
    <Space className={styles.footer}>
      Add
      <TipButton
        tip="Text Node"
        icon={<IconPen />}
        onClick={() => handleAdd(NodeDataTypeEnum.Text)}
      />
      <TipButton
        tip="Image Node"
        icon={<IconImage />}
        onClick={() => handleAdd(NodeDataTypeEnum.Image)}
      />
    </Space>
  );
};
