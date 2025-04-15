import { NodeEntity, NodeDataTypeEnum } from '@api/models';
import { Button, Spin, Tooltip } from '@arco-design/web-react';
import { NodeProps, Node, useNodeConnections } from '@xyflow/react';
import styles from './styles.module.less';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useShallow } from 'zustand/shallow';
import { useEffect, useState } from 'react';
import {
  IconItalic,
  IconPen,
  IconRecordStop,
} from '@arco-design/web-react/icon';
import MarkdownEditor from '@/components/markdown-editor';
import NodeWrapper, {
  CustomNodeData,
} from '@/pages/flow/components/node-wrapper';
import usePatchNode from '@/pages/flow/hooks/use-patch-node';
import API from '@/services/api';
import {
  useGeneratingTask,
  GeneratingTaskTrigger,
  GeneratingTaskStatus,
} from '../../components/generating-task';

export type CustomNodeTextData = Pick<NodeEntity['data'], 'content'> &
  CustomNodeData;

type CustomNodeTextProps = NodeProps<
  Node<CustomNodeTextData, typeof NodeDataTypeEnum.Text>
>;

export const CustomNodeText = (props: CustomNodeTextProps) => {
  const { data, id } = props;
  const [content, setContent] = useState(data.content);

  const connections = useNodeConnections({
    handleType: 'target',
  });

  const { generating, ...generatingTask } = useGeneratingTask({
    id: data.$state?.generatingTaskId,
    status: data.$state?.generatingTaskStatus,
    onDone: () => {
      setTimeout(async () => {
        const latestNodeResp = await API.node.getNode(parseInt(id));
        setContent(latestNodeResp.data.data.content);
      }, 1000);
    },
  });

  const patchNodeResp = usePatchNode<CustomNodeTextData>({ id, data });

  const { getFlowId, modelId } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'getFlowId' | 'modelId'>>(
      (state) => ({
        getFlowId: state.getFlowId,
        modelId: state.modelId,
      }),
    ),
  );

  useEffect(() => {
    setContent(data.content);
  }, [data.content]);

  return (
    <NodeWrapper<CustomNodeTextData, typeof NodeDataTypeEnum.Text>
      {...props}
      resizerProps={{
        minWidth: 500,
        minHeight: 300,
        maxWidth: 2000,
        maxHeight: 1000,
      }}
      title={
        <span>
          <IconPen /> Text Node @{id}
        </span>
      }
      footer={
        <>
          <GeneratingTaskTrigger
            generating={generating || patchNodeResp.loading}
            icon={<IconItalic />}
            disabled={!modelId}
            disabledTooltip="Please select a model"
            onStartTask={() => {
              if (!modelId) return;
              generatingTask.start({
                targetNodeId: parseInt(id),
                flowId: getFlowId(),
                input: {
                  modelId,
                  sourceNodeIds: Array.from(
                    new Set(connections.map((conn) => parseInt(conn.source))),
                  ),
                  edgeIds: Array.from(
                    new Set(connections.map((conn) => parseInt(conn.edgeId))),
                  ),
                },
              });
            }}
            onStopTask={() => generatingTask.stop()}
          />
          <GeneratingTaskStatus {...generatingTask} />
        </>
      }
    >
      <Spin loading={generating} className={styles.spin} tip="Generating">
        <MarkdownEditor
          value={content}
          onChange={(markdown) => {
            setContent(markdown);
            patchNodeResp.run({ content: markdown });
          }}
          placeholder="Enter text content here, or prompt here then Generate"
        />
      </Spin>
    </NodeWrapper>
  );
};

export default CustomNodeText;
