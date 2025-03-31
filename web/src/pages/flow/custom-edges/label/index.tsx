import { EdgeDataTypeEnum, EdgeEntity } from '@api/models';
import {
  BaseEdge,
  EdgeProps,
  Edge,
  EdgeLabelRenderer,
  getStraightPath,
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

  const [_edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const centerY = (targetY - sourceY) / 2 + sourceY;
  const fixHorizontalArrow = 20;
  const edgePath = [
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

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={markerStart}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <Input
          size="small"
          value={data.label}
          onChange={(v) => {
            updateEdgeData(id, {
              label: v,
            });
          }}
          style={{
            width: 150,
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
