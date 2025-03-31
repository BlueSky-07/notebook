import {
  NodeEntity,
  NodeDataTypeEnum,
  GeneratingTaskStatusEnum,
} from '@api/models';
import {
  Button,
  ColorPicker,
  Input,
  Space,
  Spin,
  Tooltip,
} from '@arco-design/web-react';
import {
  NodeProps,
  Node,
  useNodeConnections,
  NodeResizer,
} from '@xyflow/react';
import styles from './styles.module.less';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useShallow } from 'zustand/shallow';
import DefaultHandles from '../../custom-handles';
import API from '@/services/api';
import { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import CopyNode from '../../components/copy-node';
import { IconBulb, IconPen, IconRecordStop } from '@arco-design/web-react/icon';
import cs from 'classnames';
import { omit } from 'lodash-es';

type CustomNodeTextData = Pick<NodeEntity['data'], 'content' | 'background'> & {
  $state?: NodeEntity['state'];
};

type CustomNodeTextProps = NodeProps<
  Node<CustomNodeTextData, typeof NodeDataTypeEnum.Text>
>;

export const CustomNodeText = (props: CustomNodeTextProps) => {
  const { data, id, selected } = props;
  const [content, setContent] = useState(data.content);
  const [background, setBackground] = useState(data.background || 'white');

  const connections = useNodeConnections({
    handleType: 'target',
  });
  const [generatingTaskId, setGeneratingTaskId] = useState(
    data.$state?.generatingTaskId,
  );
  const [generatingTaskStatus, setGeneratingTaskStatus] = useState(
    data.$state?.generatingTaskStatus,
  );

  const generating = (
    [
      GeneratingTaskStatusEnum.Pending,
      GeneratingTaskStatusEnum.Generating,
    ] as GeneratingTaskStatusEnum[]
  ).includes(generatingTaskStatus);

  const generatingTaskResp = useRequest(
    () => API.generatingTask.getGeneratingTask(generatingTaskId),
    {
      refreshDeps: [generatingTaskId],
      ready:
        generating || generatingTaskStatus === GeneratingTaskStatusEnum.Failed,
      pollingInterval: generating ? 3000 : undefined,
      onSuccess: (resp) => {
        setGeneratingTaskStatus(resp.data.status);
        if (resp.data.status === GeneratingTaskStatusEnum.Done) {
          setTimeout(async () => {
            const latestNodeResp = await API.node.getNode(parseInt(id));
            setContent(latestNodeResp.data.data.content);
          }, 1000);
        }
      },
    },
  );

  const patchNodeResp = useRequest(
    (nextData: Partial<Omit<CustomNodeTextData, '$state'>>) => {
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

  const { getFlowId, getNode, updateNodeData, modelId } = useFlowStore(
    useShallow<
      FlowState,
      Pick<FlowState, 'getFlowId' | 'getNode' | 'updateNodeData' | 'modelId'>
    >((state) => ({
      getFlowId: state.getFlowId,
      getNode: state.getNode,
      updateNodeData: state.updateNodeData,
      modelId: state.modelId,
    })),
  );

  const generateContent = async () => {
    const createGenerateTaskResp = await API.generatingTask.addGeneratingTask({
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
    setGeneratingTaskId(createGenerateTaskResp.data.id);
    setGeneratingTaskStatus(GeneratingTaskStatusEnum.Pending);
  };

  const stopGenerate = async () => {
    await API.generatingTask.stopGeneratingTask(generatingTaskId);
    generatingTaskResp.run();
  };

  useEffect(() => {
    setContent(data.content);
  }, [data.content]);

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={500}
        minHeight={300}
        maxWidth={2000}
        maxHeight={1000}
        lineClassName={styles.customTextNodeResizerLine}
      />
      <div className={styles.customTextNode} style={{ background }}>
        <div className={cs(styles.header, styles.buttons)}>
          <span>
            <IconPen /> Text Node @{id}
          </span>
          <Space className={styles.flex}>
            <CopyNode flowId={getFlowId()} node={getNode(id)} />
            <ColorPicker
              showPreset={true}
              value={background}
              onChange={(background) => {
                setBackground(background);
                patchNodeResp.run({ background });
              }}
              size="mini"
            />
          </Space>
        </div>

        <div className={styles.body}>
          <Spin loading={generating} className={styles.spin} tip="Generating">
            <Input.TextArea
              placeholder="Enter text content here, or prompt here then Generate"
              value={
                // generating
                //   ? [
                //       content,
                //       generatingTaskResp.data?.data?.output?.generatedContent, // todo stream output here
                //     ]
                //       .filter(Boolean)
                //       .join('')
                //   :
                content
              }
              onChange={(content) => {
                setContent(content);
                patchNodeResp.run({ content });
              }}
              className={cs('nodrag nopan nowheel', styles.textarea)}
            />
          </Spin>
        </div>

        <div className={cs(styles.footer, styles.buttons)}>
          {!generating && (
            <Tooltip
              disabled={Boolean(modelId)}
              content="Please select a model first"
            >
              <Button
                icon={<IconBulb />}
                onClick={() => void generateContent()}
                disabled={!modelId || patchNodeResp.loading}
              >
                {generating ? 'Generating' : 'Generate'}
              </Button>
            </Tooltip>
          )}
          {generating && (
            <Button
              icon={<IconRecordStop />}
              status="danger"
              onClick={() => void stopGenerate()}
            >
              Stop
            </Button>
          )}
          {generatingTaskId && (
            <span>
              GeneratingTask @{generatingTaskId} /{' '}
              <Tooltip
                content={generatingTaskResp.data?.data?.output?.errorMessage}
              >
                {generatingTaskStatus}
              </Tooltip>
            </span>
          )}
        </div>
      </div>
      <DefaultHandles />
    </>
  );
};

export default CustomNodeText;
