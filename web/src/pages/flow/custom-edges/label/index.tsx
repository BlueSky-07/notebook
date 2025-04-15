import { EdgeDataTypeEnum, EdgeEntity, EdgeHandleEnum } from '@api/models';
import {
  BaseEdge,
  EdgeProps,
  Edge,
  EdgeLabelRenderer,
  getStraightPath,
  getBezierPath,
  Position,
} from '@xyflow/react';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useShallow } from 'zustand/shallow';
import { Typography } from '@arco-design/web-react';
import TipButton from '@/components/tip-button';
import { IconDelete } from '@arco-design/web-react/icon';
import cs from 'classnames';
import styles from './styles.module.less';

type CustomEdgeLabelData = Pick<EdgeEntity['data'], 'label'>;

type CustomEdgeLabelProps = EdgeProps<
  Edge<CustomEdgeLabelData, typeof EdgeDataTypeEnum.Label>
>;

export const LabelEdge = (props: CustomEdgeLabelProps) => {
  const {
    data,
    id,
    targetY,
    targetX,
    sourceY,
    sourceX,
    markerStart,
    markerEnd,
    sourcePosition,
    targetPosition,
    targetHandleId,
  } = props;

  const { updateEdgeData, deleteEdge } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'updateEdgeData' | 'deleteEdge'>>(
      (state) => ({
        updateEdgeData: state.updateEdgeData,
        deleteEdge: state.deleteEdge,
      }),
    ),
  );

  /**
   * Straight Path
   */
  const [_straightLabelXEdgePath, straightLabelX, straightLabelY] =
    getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });

  const centerY = (targetY - sourceY) / 2 + sourceY;
  const fixHorizontalArrow = 20;
  const straightEdgePath = [
    `M ${sourceX} ${sourceY}`,
    sourcePosition === Position.Right &&
      `L ${sourceX + (sourcePosition === Position.Right ? fixHorizontalArrow : 0)} ${sourceY}`,
    `L ${sourceX + (sourcePosition === Position.Right ? fixHorizontalArrow : 0)} ${centerY}`,
    `L ${targetX - (targetPosition === Position.Left ? fixHorizontalArrow : 0)} ${centerY}`,
    targetPosition === Position.Left &&
      `L ${targetX - (targetPosition === Position.Left ? fixHorizontalArrow : 0)} ${targetY}`,
    `L ${targetX} ${targetY}`,
  ]
    .filter(Boolean)
    .join(' ');

  /**
   * Bezier Path
   */
  const [
    bezierEdgePath,
    bezierLabelX,
    bezierLabelY,
    bezierOffsetX,
    bezierOffsetY,
  ] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const { edgePath, labelX, labelY, offsetX, offsetY } = {
    straight: {
      edgePath: straightEdgePath,
      labelX: straightLabelX,
      labelY: straightLabelY,
      offsetX: undefined,
      offsetY: undefined,
    },
    bezier: {
      edgePath: bezierEdgePath,
      labelX: bezierLabelX,
      labelY: bezierLabelY,
      offsetX: bezierOffsetX,
      offsetY: bezierOffsetY,
    },
  }['bezier'];

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={markerStart}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          className={cs('nodrag nopan', styles.customLabelEdge)}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <div className={styles.toolbar}>
            <TipButton
              tip="Delete Edge"
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
                content: `Are you sure to delete edge?`,
                okText: 'Yes',
                onOk: () => {
                  deleteEdge(id);
                },
              }}
            />
          </div>
          <Typography.Text
            className={styles.label}
            editable={{
              tooltipProps: {
                content: 'Edit Label',
              },
              onChange: (v) => {
                updateEdgeData(id, {
                  label: v,
                });
              },
            }}
          >
            {data?.label}
          </Typography.Text>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default LabelEdge;
