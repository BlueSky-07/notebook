import { NodeEntity, NodeDataTypeEnum } from '@api/models';
import { Spin } from '@arco-design/web-react';
import { NodeProps, Node, useNodeConnections } from '@xyflow/react';
import styles from './styles.module.less';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useShallow } from 'zustand/shallow';
import { useEffect, useState } from 'react';
import { IconItalic, IconPen } from '@arco-design/web-react/icon';
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
import cs from 'classnames';

export type CustomNodeTextData = Pick<NodeEntity['data'], 'content'> &
  CustomNodeData;

type CustomNodeTextProps = NodeProps<
  Node<CustomNodeTextData, typeof NodeDataTypeEnum.Text>
>;

export const CustomNodeText = (props: CustomNodeTextProps) => {
  const { data, id, selected } = props;
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
        patchNodeResp.run({ content: latestNodeResp.data.data.content });
      }, 1000);
    },
  });

  const patchNodeResp = usePatchNode<CustomNodeTextData>({ id, data });

  const { getFlowId, modelId, updateModelId } = useFlowStore(
    useShallow<
      FlowState,
      Pick<FlowState, 'getFlowId' | 'modelId' | 'updateModelId'>
    >((state) => ({
      getFlowId: state.getFlowId,
      modelId: state.modelId,
      updateModelId: state.updateModelId,
    })),
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
        maxHeight: 2000,
      }}
      title={
        <span>
          <IconPen /> Text Node @{id}
        </span>
      }
      footer={
        <>
          <GeneratingTaskTrigger
            modelId={modelId}
            modelFeatures={['text-generation', 'vision', 'reasoning']}
            onChangeModelId={updateModelId}
            generating={generating || patchNodeResp.loading}
            icon={<IconItalic />}
            disabled={!modelId}
            disabledTooltip="Please select a model with text generation capability"
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
          <GeneratingTaskStatus
            {...generatingTask}
            onUndo={
              generatingTask.data?.input.targetNodeSnapshot
                ? () => {
                    if (generatingTask.data?.input.targetNodeSnapshot) {
                      setContent(
                        generatingTask.data?.input.targetNodeSnapshot.data
                          ?.content,
                      );
                      patchNodeResp.run({
                        content:
                          generatingTask.data?.input.targetNodeSnapshot.data
                            ?.content,
                      });
                    }
                  }
                : undefined
            }
            onRedo={
              generatingTask.data?.output.generatedText
                ? () => {
                    if (generatingTask.data?.output.generatedText) {
                      const content = [
                        generatingTask.data?.input.targetNodeSnapshot?.data
                          ?.content,
                        generatingTask.data?.output.generatedText,
                      ]
                        .filter(Boolean)
                        .join('\n\n');
                      setContent(content);
                      patchNodeResp.run({ content });
                    }
                  }
                : undefined
            }
          />
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
          placeholder="Enter text content here, or enter prompt here then Generate"
          className={cs(styles.editor, {
            [styles.selected]: selected,
          })}
        />
      </Spin>
    </NodeWrapper>
  );
};

export default CustomNodeText;
