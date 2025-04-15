import { Empty, Tree, Typography } from '@arco-design/web-react';
import styles from './styles.module.less';
import {
  IconEye,
  IconEyeInvisible,
  IconImage,
  IconPen,
  IconPushpin,
} from '@arco-design/web-react/icon';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { type Node } from '@xyflow/react';
import { useShallow } from 'zustand/shallow';
import { NodeDataTypeEnum } from '@api/models';
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import TipButton from '@/components/tip-button';
import { CustomNodeTextData } from '@/pages/flow/custom-nodes/text';
import { useMemo } from 'react';

type TreeDataNode = TreeDataType & { node: Node };

export const NodesPane = () => {
  const {
    reactFlowRef,
    nodes,
    selectedNodeIds,
    onNodesChange,
    updateNodeHidden,
  } = useFlowStore(
    useShallow<
      FlowState,
      Pick<
        FlowState,
        | 'reactFlowRef'
        | 'nodes'
        | 'selectedNodeIds'
        | 'onNodesChange'
        | 'updateNodeHidden'
      >
    >((state) => ({
      reactFlowRef: state.reactFlowRef,
      nodes: state.nodes,
      selectedNodeIds: state.selectedNodeIds,
      onNodesChange: state.onNodesChange,
      updateNodeHidden: state.updateNodeHidden,
    })),
  );

  const treeData = useMemo(
    () =>
      nodes.map<TreeDataNode>((node) => ({
        title: `${node.type} Node @${node.id}`,
        key: node.id,
        node,
        selectable: !node.hidden,
        icons: {
          switcherIcon: {
            [NodeDataTypeEnum.Text]: <IconPen />,
            [NodeDataTypeEnum.Image]: <IconImage />,
          }[node.type || ''],
        },
        children: [
          node.type === NodeDataTypeEnum.Text && {
            key: `${node.id}:preview`,
            selectable: !node.hidden,
            title: (
              <Typography.Ellipsis
                rows={2}
                expandable={false}
                className="preview"
              >
                {(node.data as CustomNodeTextData).content?.slice(0, 50)}
              </Typography.Ellipsis>
            ),
            icons: {
              switcherIcon: null,
            },
          },
        ].filter(Boolean) as TreeDataNode[],
      })),
    [nodes],
  );

  if (!treeData.length) return <Empty />;

  return (
    // @ts-ignore, need arco fix type definition
    <Tree
      className={styles.nodesPane}
      showLine={true}
      draggable={false}
      blockNode={true}
      selectedKeys={
        selectedNodeIds
          .map((nodeId) => {
            const treeNode = treeData.find((node) => node.key === nodeId);
            if (treeNode && (treeNode.children?.length ?? 0) > 0) {
              return [nodeId, treeNode.children?.[0].key];
            }
            return nodeId;
          })
          .flat(2) as string[]
      }
      defaultExpandedKeys={
        treeData
          .map((node) => (node.children?.length ? node.key : false))
          .filter(Boolean) as string[]
      }
      treeData={treeData}
      renderExtra={(treeNode) => {
        if (treeNode.dataRef?.key?.endsWith('preview')) return null;
        const hidden = (treeNode.dataRef as TreeDataNode).node.hidden;
        return (
          <>
            <TipButton
              tip="Move to Node"
              icon={<IconPushpin />}
              type="text"
              disabled={hidden}
              onClick={() => {
                const reactFlow = reactFlowRef?.current?.get();
                if (reactFlow && treeNode?.dataRef?.key != null) {
                  reactFlow.fitView({
                    duration: 500,
                    nodes: [{ id: treeNode?.dataRef?.key }],
                  });
                }
              }}
            />
            <TipButton
              tip={hidden ? 'Show' : 'Hide'}
              icon={hidden ? <IconEye /> : <IconEyeInvisible />}
              type="text"
              onClick={() => {
                if (treeNode?.dataRef?.key != null) {
                  updateNodeHidden(treeNode.dataRef.key, !hidden);
                  onNodesChange([
                    {
                      id: treeNode.dataRef.key,
                      type: 'select',
                      selected: false,
                    },
                  ]);
                }
              }}
            />
          </>
        );
      }}
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
          const reactFlow = reactFlowRef?.current?.get();
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
