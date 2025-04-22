import {
  type ConnectionLineComponentProps,
  getSimpleBezierPath,
  useNodes,
  useReactFlow,
} from '@xyflow/react';

/**
 * @doc https://reactflow.dev/examples/edges/multi-connection-line
 */
export const ConnectionLine = (props: ConnectionLineComponentProps) => {
  const { toX, toY, fromHandle, fromNode } = props;
  const { getInternalNode } = useReactFlow();
  const nodes = useNodes();
  const selectedNodes = nodes.filter((node) => node.selected);

  const multipleMode =
    selectedNodes.length > 1 &&
    selectedNodes.some((node) => node.id === fromNode.id);

  const handleBounds = (multipleMode ? selectedNodes : [fromNode]).flatMap(
    (userNode) => {
      const node = getInternalNode(userNode.id);

      if (
        fromHandle.type === 'source' &&
        node?.internals?.handleBounds?.source
      ) {
        return node.internals.handleBounds.source
          .filter((bounds) => bounds.id === fromHandle.id)
          .map((bounds) => ({
            id: node.id,
            positionAbsolute: node.internals.positionAbsolute,
            bounds,
          }));
      } else if (
        fromHandle.type === 'target' &&
        node?.internals?.handleBounds?.target
      ) {
        return node.internals.handleBounds.target
          .filter((bounds) => bounds.id === fromHandle.id)
          .map((bounds) => ({
            id: node.id,
            positionAbsolute: node.internals.positionAbsolute,
            bounds,
          }));
      }

      return [];
    },
  );

  return handleBounds.map(({ id, positionAbsolute, bounds }) => {
    const fromHandleX = bounds.x + bounds.width / 2;
    const fromHandleY = bounds.y + bounds.height / 2;
    const fromX = positionAbsolute.x + fromHandleX;
    const fromY = positionAbsolute.y + fromHandleY;
    const [d] = getSimpleBezierPath({
      sourceX: fromX,
      sourceY: fromY,
      targetX: toX,
      targetY: toY,
    });

    return (
      <g key={`${id}-${bounds.id}`}>
        <path
          fill="none"
          strokeWidth={6}
          stroke="var(--xy-theme-edge-connection-connecting)"
          d={d}
        />
        <circle
          cx={toX}
          cy={toY}
          fill="#fff"
          r={3}
          stroke="black"
          strokeWidth={1.5}
        />
      </g>
    );
  });
};

export default ConnectionLine;
