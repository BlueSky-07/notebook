import { Divider, Space, Trigger } from '@arco-design/web-react';
import { NodeDataTypeEnum, NodeEntity } from '@api/models';
import {
  IconApps,
  IconFullscreen,
  IconImage,
  IconLeftCircle,
  IconMinus,
  IconPen,
  IconPlus,
  IconRightCircle,
} from '@arco-design/web-react/icon';
import { useShallow } from 'zustand/react/shallow';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useReactFlow, useStoreApi, useViewport } from '@xyflow/react';
import styles from './styles.module.less';
import TipButton from '@/components/tip-button';
import { LAYOUT_MAX_ZOOM, LAYOUT_MIN_ZOOM } from '@/pages/flow/const';
import { CSSProperties, useState } from 'react';

export const Footer = () => {
  const store = useStoreApi();
  const reactFlow = useReactFlow();
  const { x, y, zoom } = useViewport();
  const zoomPercent = Math.ceil(zoom * 100);
  const [collapsed, setCollapsed] = useState(true);

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

  const renderToolbar = (hideToggle: boolean, style: CSSProperties = {}) => (
    <Space className={styles.toolbar} style={style}>
      {!hideToggle && (
        <TipButton
          tip="Hide Toolbar"
          icon={<IconLeftCircle />}
          size="mini"
          shape="round"
          onClick={() => setCollapsed(true)}
          className={styles.triggerForInvisible}
        />
      )}
      <TipButton
        tip="Minimap"
        icon={<IconApps />}
        size="mini"
        shape="round"
        type={minimapVisible ? 'primary' : 'default'}
        onClick={() => {
          toggleMinimapVisible();
        }}
      />
      <TipButton
        tip="Fit"
        icon={<IconFullscreen />}
        size="mini"
        shape="round"
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
        shape="round"
        type="text"
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
        shape="round"
        type="text"
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

  if (collapsed) {
    return (
      // @ts-ignore
      <Trigger
        position="right"
        popup={() => renderToolbar(true, { paddingLeft: 10, marginLeft: 5 })}
      >
        <div className={styles.triggerForVisible}>
          <TipButton
            tip="Pin Toolbar"
            icon={<IconRightCircle />}
            size="mini"
            shape="round"
            onClick={() => setCollapsed(false)}
          />
        </div>
      </Trigger>
    );
  }

  return renderToolbar(false);
};
