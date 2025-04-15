import { useMemo } from 'react';
import CustomEdgeLabel from './label';
import { EdgeDataTypeEnum } from '@api/models';
import { type EdgeTypes } from '@xyflow/react';

export const useCustomEdges = (): EdgeTypes => {
  const edgeTypes = useMemo(() => {
    return {
      [EdgeDataTypeEnum.Label]: CustomEdgeLabel,
    };
  }, []);

  return edgeTypes;
};
