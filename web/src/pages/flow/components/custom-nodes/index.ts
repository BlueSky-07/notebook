import { useMemo } from 'react'
import CustomNodeText from './text'
import CustomNodeImage from './image'
import { NodeDataTypeEnum } from '@api/models'

export const useCustomNodes = () => {
  const nodeTypes = useMemo(() => {
    return {
      [NodeDataTypeEnum.Text]: CustomNodeText,
      [NodeDataTypeEnum.Image]: CustomNodeImage,
    }
  }, [])

  return nodeTypes
}