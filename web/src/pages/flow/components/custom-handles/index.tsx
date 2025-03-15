import { EdgeHandleEnum } from "@api/models"
import { Handle, Position } from '@xyflow/react';

interface DefaultHandlesProps {
  hidden?: EdgeHandleEnum[]
}

export const DefaultHandles = (props: DefaultHandlesProps) => {
  const { hidden = [] } = props
  return (
    <>
      {!hidden.includes(EdgeHandleEnum.Top) && (
        <Handle
          type="target"
          position={Position.Top}
          id={EdgeHandleEnum.Top}
        />
      )}
      {!hidden.includes(EdgeHandleEnum.Right) && (
        <Handle
          type="source"
          position={Position.Right}
          id={EdgeHandleEnum.Right}
        />
      )}
      {!hidden.includes(EdgeHandleEnum.Bottom) && (
        <Handle
          type="source"
          position={Position.Bottom}
          id={EdgeHandleEnum.Bottom}
        />
      )}
      {!hidden.includes(EdgeHandleEnum.Left) && (
        <Handle
          type="target"
          position={Position.Left}
          id={EdgeHandleEnum.Left}
        />
      )}
    </>
  )
}

export default DefaultHandles