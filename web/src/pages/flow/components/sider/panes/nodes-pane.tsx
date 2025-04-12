import { Tree, Typography } from '@arco-design/web-react';
import styles from './styles.module.less';
import { IconImage, IconPen, IconPushpin } from '@arco-design/web-react/icon';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useShallow } from 'zustand/shallow';
import { NodeDataTypeEnum } from '@api/models';
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import TipButton from '@/components/tip-button';
import { CustomNodeTextData } from '@/pages/flow/custom-nodes/text';

export const NodesPane = () => {
  const { reactFlowRef, nodes, selectedNodeIds, onNodesChange } = useFlowStore(
    useShallow<
      FlowState,
      Pick<
        FlowState,
        'reactFlowRef' | 'nodes' | 'selectedNodeIds' | 'onNodesChange'
      >
    >((state) => ({
      reactFlowRef: state.reactFlowRef,
      nodes: state.nodes,
      selectedNodeIds: state.selectedNodeIds,
      onNodesChange: state.onNodesChange,
    })),
  );

  const treeData = nodes.map<TreeDataType>((node) => ({
    title: `${node.type} Node @${node.id}`,
    key: node.id,
    icons: {
      switcherIcon: {
        [NodeDataTypeEnum.Text]: <IconPen />,
        [NodeDataTypeEnum.Image]: <IconImage />,
      }[node.type],
    },
    children: [
      node.type === NodeDataTypeEnum.Text && {
        key: `${node.id}:preview`,
        title: (
          <Typography.Ellipsis rows={2} expandable={false} className="preview">
            {(node.data as CustomNodeTextData).content.slice(0, 50)}
          </Typography.Ellipsis>
        ),
        icons: {
          switcherIcon: null,
        },
      },
    ].filter(Boolean),
  }));

  return (
    <Tree
      className={styles.nodesPane}
      showLine={true}
      draggable={false}
      blockNode={true}
      selectedKeys={selectedNodeIds
        .map((nodeId) => {
          const treeNode = treeData.find((node) => node.key === nodeId);
          if (treeNode && treeNode.children?.length > 0) {
            return [nodeId, treeNode.children[0].key];
          }
          return nodeId;
        })
        .flat(2)}
      defaultExpandedKeys={
        treeData
          .map((node) => (node.children?.length ? node.key : false))
          .filter(Boolean) as string[]
      }
      treeData={treeData}
      renderExtra={(node) =>
        !node.dataRef.key.endsWith('preview') && (
          <TipButton
            tip="Move to Node"
            icon={<IconPushpin />}
            type="text"
            onClick={() => {
              const reactFlow = reactFlowRef.current?.get();
              if (reactFlow) {
                reactFlow.fitView({
                  duration: 500,
                  nodes: [{ id: node.dataRef.key }],
                });
              }
            }}
          />
        )
      }
      onSelect={(selectedKeys) => {
        const targetNodeId = selectedKeys[0].split(':')[0];
        const nextSelected = !selectedNodeIds.includes(targetNodeId);
        onNodesChange([
          {
            id: targetNodeId,
            type: 'select',
            selected: nextSelected,
          },
        ]);
        if (nextSelected) {
          const reactFlow = reactFlowRef.current?.get();
          if (reactFlow) {
            reactFlow.fitView({
              duration: 500,
              nodes: [{ id: targetNodeId }],
            });
          }
        }
      }}
    />
  );
};

export default NodesPane;
