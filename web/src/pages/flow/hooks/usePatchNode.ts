import { NodeEntity } from '@api/models';
import { useRequest } from 'ahooks';
import { omit } from 'lodash-es';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { type Node } from '@xyflow/react';
import { useShallow } from 'zustand/shallow';

interface UsePatchNodeProps<NodeData extends Partial<NodeEntity['data']>> {
  id: Node['id'];
  data?: NodeData;
}

export const usePatchNode = <NodeData extends Partial<NodeEntity['data']>>(
  props: UsePatchNodeProps<NodeData>,
) => {
  const { id, data } = props;

  const { updateNodeData } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'updateNodeData'>>((state) => ({
      updateNodeData: state.updateNodeData,
    })),
  );

  return useRequest(
    (nextData: Partial<Omit<NodeData, '$state'>>) => {
      return updateNodeData(
        id,
        omit(
          {
            ...data,
            ...nextData,
          },
          '$state',
        ),
      );
    },
    {
      refreshDeps: [data],
      manual: true,
      debounceWait: 300,
    },
  );
};

export default usePatchNode;
