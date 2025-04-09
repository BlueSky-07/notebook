import { EdgeDataTypeEnum, EdgeEntity } from '@api/models';
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
import { Input } from '@arco-design/web-react';

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
  } = props;

  const { updateEdgeData } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'updateEdgeData'>>((state) => ({
      updateEdgeData: state.updateEdgeData,
    })),
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
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 5 }}
          value={data.label}
          onChange={(v) => {
            updateEdgeData(id, {
              label: v,
            });
          }}
          style={{
            maxWidth: 250,
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        />
      </EdgeLabelRenderer>
    </>
  );
};

export default LabelEdge;
