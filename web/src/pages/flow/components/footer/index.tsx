import { Divider, Space } from '@arco-design/web-react';
import { NodeDataTypeEnum, NodeEntity } from '@api/models';
import {
  IconApps,
  IconFullscreen,
  IconImage,
  IconMinus,
  IconPen,
  IconPlus,
} from '@arco-design/web-react/icon';
import { useShallow } from 'zustand/react/shallow';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useReactFlow, useStoreApi, useViewport } from '@xyflow/react';
import styles from './styles.module.less';
import TipButton from '@/components/tip-button';
import { LAYOUT_MAX_ZOOM, LAYOUT_MIN_ZOOM } from '@/pages/flow/const';

export const Footer = () => {
  const store = useStoreApi();
  const reactFlow = useReactFlow();
  const { x, y, zoom } = useViewport();
  const zoomPercent = Math.ceil(zoom * 100);

  const handleAdd = (type: NodeEntity['dataType']) => {
    const { domNode } = store.getState();
    const boundingRect = domNode?.getBoundingClientRect();
    if (boundingRect) {
      const center = reactFlow.screenToFlowPosition({
        x: boundingRect.x + boundingRect.width / 2,
        y: boundingRect.y + boundingRect.height / 2,
      });
      addNode(type, undefined, center);
    } else {
      addNode(type);
    }
  };

  const { addNode, minimapVisible, toggleMinimapVisible } = useFlowStore(
    useShallow<
      FlowState,
      Pick<FlowState, 'addNode' | 'minimapVisible' | 'toggleMinimapVisible'>
    >((state) => ({
      addNode: state.addNode,
      minimapVisible: state.minimapVisible,
      toggleMinimapVisible: state.toggleMinimapVisible,
    })),
  );

  return (
    <Space className={styles.footer}>
      <TipButton
        tip="Minimap"
        icon={<IconApps />}
        size="mini"
        type={minimapVisible ? 'primary' : 'default'}
        onClick={() => {
          toggleMinimapVisible();
        }}
      />
      <TipButton
        tip="Fit"
        icon={<IconFullscreen />}
        size="mini"
        onClick={() => {
          reactFlow.fitView({
            duration: 500,
          });
        }}
      />
      <TipButton
        tip="Zoom Out"
        icon={<IconMinus />}
        size="mini"
        onClick={() => {
          reactFlow.setViewport({
            x,
            y,
            zoom:
              Math.max(
                Math.min(zoomPercent - 10, LAYOUT_MAX_ZOOM),
                LAYOUT_MIN_ZOOM,
              ) / 100,
          });
        }}
      />
      <span>{zoomPercent} %</span>
      <TipButton
        tip="Zoom In"
        icon={<IconPlus />}
        size="mini"
        onClick={() => {
          reactFlow.setViewport({
            x,
            y,
            zoom:
              Math.max(
                Math.min(zoomPercent + 10, LAYOUT_MAX_ZOOM),
                LAYOUT_MIN_ZOOM,
              ) / 100,
          });
        }}
      />
      <Divider type="vertical" />
      <span>Add</span>
      <TipButton
        tip="Text Node"
        icon={<IconPen />}
        onClick={() => handleAdd(NodeDataTypeEnum.Text)}
        type="text"
      />
      <TipButton
        tip="Image Node"
        icon={<IconImage />}
        onClick={() => handleAdd(NodeDataTypeEnum.Image)}
        type="text"
      />
    </Space>
  );
};
