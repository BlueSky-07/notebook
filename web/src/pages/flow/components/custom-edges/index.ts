import { useMemo } from 'react'
import CustomEdgeLabel from './label'
import { EdgeDataTypeEnum } from '@api/models'

export const useCustomEdges = () => {
  const edgeTypes = useMemo(() => {
    return {
      [EdgeDataTypeEnum.Label]: CustomEdgeLabel,
    }
  }, [])

  return edgeTypes
}