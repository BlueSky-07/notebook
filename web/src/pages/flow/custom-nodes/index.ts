import { useMemo } from 'react';
import CustomNodeText from './text';
import CustomNodeImage from './image';
import { NodeDataTypeEnum } from '@api/models';
import { type NodeTypes } from '@xyflow/react';

export const useCustomNodes = (): NodeTypes => {
  const nodeTypes = useMemo(() => {
    return {
      [NodeDataTypeEnum.Text]: CustomNodeText,
      [NodeDataTypeEnum.Image]: CustomNodeImage,
    };
  }, []);

  return nodeTypes;
};
