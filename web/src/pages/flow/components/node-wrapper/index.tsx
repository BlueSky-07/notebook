import cs from 'classnames';
import styles from './styles.module.less';
import { ReactNode, useState } from 'react';
import {
  NodeProps,
  NodeResizer,
  useReactFlow,
  type Node,
  type NodeResizerProps,
} from '@xyflow/react';
import { NodeEntity } from '@api/models';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useShallow } from 'zustand/shallow';
import CopyNode from '@/pages/flow/components/copy-node';
import { ColorPicker, Space } from '@arco-design/web-react';
import {
  IconBgColors,
  IconDelete,
  IconEyeInvisible,
  IconFullscreen,
} from '@arco-design/web-react/icon';
import TipButton from '@/components/tip-button';
import usePatchNode from '@/pages/flow/hooks/use-patch-node';
import DefaultHandles from '@/pages/flow/custom-handles';

export type CustomNodeData = Pick<NodeEntity['data'], 'background'> & {
  $state?: NodeEntity['state'];
};

export interface NodeWrapperProps<
  Data extends CustomNodeData,
  Type extends string,
> extends NodeProps<Node<Data, Type>> {
  title?: ReactNode;
  footer?: ReactNode;
  resizable?: boolean; // default: true
  resizerProps?: NodeResizerProps; // default: { minWidth: 300, minHeight: 300, maxWidth: 2000, maxHeight: 2000 }
  children?:
    | ReactNode
    | ((props: Pick<CustomNodeData, 'background'>) => ReactNode);
  className?: string;
}

export const NodeWrapper = <Data extends CustomNodeData, Type extends string>(
  props: NodeWrapperProps<Data, Type>,
) => {
  const { title, footer, children, className, data, id, selected } = props;
  const [background, setBackground] = useState(data.background || 'white');
  const reactFlow = useReactFlow();

  const { getFlowId, getNode, deleteNode, updateNodeHidden } = useFlowStore(
    useShallow<
      FlowState,
      Pick<
        FlowState,
        'getFlowId' | 'getNode' | 'deleteNode' | 'updateNodeHidden'
      >
    >((state) => ({
      getFlowId: state.getFlowId,
      getNode: state.getNode,
      deleteNode: state.deleteNode,
      updateNodeHidden: state.updateNodeHidden,
    })),
  );

  const patchNodeResp = usePatchNode<CustomNodeData>({ id, data });

  return (
    <>
      {props.resizable !== false && (
        <NodeResizer
          isVisible={selected}
          minWidth={300}
          minHeight={300}
          maxWidth={2000}
          maxHeight={2000}
          lineClassName={styles.nodeResizerLine}
          {...props.resizerProps}
        />
      )}
      <DefaultHandles />
      <div className={cs(styles.nodeWrapper, className)} style={{ background }}>
        <div className={cs(styles.header, styles.buttons)}>
          {title}
          <Space className={styles.flex}>
            <TipButton
              tip="Fit at center"
              icon={<IconFullscreen />}
              size="mini"
              type="text"
              onClick={() => {
                reactFlow.fitView({
                  duration: 500,
                  nodes: [{ id }],
                });
              }}
            />
            <TipButton
              tip="Hide"
              icon={<IconEyeInvisible />}
              size="mini"
              type="text"
              onClick={() => {
                updateNodeHidden(id, true);
              }}
            />
            <CopyNode flowId={getFlowId()} node={getNode(id)} />
            <ColorPicker
              showPreset={true}
              value={background}
              onChange={(background) => {
                setBackground(background as string);
                patchNodeResp.run({
                  background: background as string,
                });
              }}
              size="mini"
              triggerElement={
                <div>
                  <TipButton
                    tip="Set Background"
                    icon={<IconBgColors />}
                    size="mini"
                    type="text"
                  />
                </div>
              }
            />
            <TipButton
              tip="Delete"
              icon={<IconDelete />}
              status="danger"
              size="mini"
              type="text"
              popconfirmProps={{
                okButtonProps: {
                  status: 'danger',
                },
                icon: <IconDelete style={{ color: 'rgb(var(--danger-6))' }} />,
                title: (
                  <span style={{ color: 'rgb(var(--danger-6))' }}>
                    Delete Node
                  </span>
                ),
                content: `Are you sure to delete node?`,
                okText: 'Yes',
                onOk: () => {
                  deleteNode(id);
                },
              }}
            />
          </Space>
        </div>

        <div className={cs('nodrag nopan nowheel', styles.body)}>
          {typeof children === 'function' ? children({ background }) : children}
        </div>

        {footer && (
          <div className={cs(styles.footer, styles.buttons)}>{footer}</div>
        )}
      </div>
    </>
  );
};

export default NodeWrapper;
