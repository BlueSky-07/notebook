import { NodeEntity, NodeDataTypeEnum, FileEntity } from '@api/models';
import {
  Image,
  Button,
  Upload,
  type UploadProps,
  Spin,
  Space,
} from '@arco-design/web-react';
import { NodeProps, Node, useNodeConnections } from '@xyflow/react';
import styles from './styles.module.less';
import {
  IconImage,
  IconPalette,
  IconUpload,
} from '@arco-design/web-react/icon';
import { ReactNode, useEffect, useState } from 'react';
import NodeWrapper, {
  CustomNodeData,
} from '@/pages/flow/components/node-wrapper';
import usePatchNode from '@/pages/flow/hooks/use-patch-node';
import API from '@/services/api';
import { getFileEntityLink } from '@/utils/storage';
import {
  useGeneratingTask,
  GeneratingTaskTrigger,
  GeneratingTaskStatus,
} from '../../components/generating-task';
import useFlowStore, { FlowState } from '@/stores/flow';
import { useShallow } from 'zustand/shallow';

type CustomNodeImageData = Pick<
  NodeEntity['data'],
  'src' | 'fileId' | 'background'
> &
  CustomNodeData;

type CustomNodeImageProps = NodeProps<
  Node<CustomNodeImageData, typeof NodeDataTypeEnum.Image>
>;

export const CustomNodeImage = (props: CustomNodeImageProps) => {
  const { data, id } = props;
  const [src, setSrc] = useState(data.src);

  const connections = useNodeConnections({
    handleType: 'target',
  });

  const { generating, ...generatingTask } = useGeneratingTask({
    id: data.$state?.generatingTaskId,
    status: data.$state?.generatingTaskStatus,
    onDone: () => {
      setTimeout(async () => {
        const latestNodeResp = await API.node.getNode(parseInt(id));
        setSrc(latestNodeResp.data.data.src);
      }, 1000);
    },
  });

  const patchNodeResp = usePatchNode<CustomNodeImageData>({ id, data });

  const { getFlowId, modelId } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'getFlowId' | 'modelId'>>(
      (state) => ({
        getFlowId: state.getFlowId,
        modelId: state.modelId,
      }),
    ),
  );

  useEffect(() => {
    setSrc(data.src);
  }, [data.src]);

  const renderUpload = (trigger: ReactNode, uploadProps?: UploadProps) => {
    return (
      <Upload
        accept="image/*"
        limit={1}
        fileList={[]}
        disabled={patchNodeResp.loading}
        customRequest={async (customRequestProps) => {
          const { file, onSuccess, onError, onProgress } = customRequestProps;
          try {
            onProgress(10);
            const resp = await API.file.uploadFileObject(file);
            onSuccess(resp.data);
            onProgress(100);
          } catch (e) {
            onError(e);
          }
        }}
        onChange={(fileList) => {
          const file = fileList[0];
          if (file && file.status === 'done') {
            const typedFile = file.response as FileEntity;
            patchNodeResp.run({
              fileId: typedFile.id,
              src: getFileEntityLink(typedFile),
            });
          }
        }}
        showUploadList={false}
        {...uploadProps}
      >
        {trigger}
      </Upload>
    );
  };

  return (
    <NodeWrapper<CustomNodeImageData, typeof NodeDataTypeEnum.Image>
      {...props}
      resizerProps={{
        minWidth: 300,
        minHeight: 300,
        maxWidth: 1000,
        maxHeight: 1000,
      }}
      title={
        <span>
          <IconImage /> Image Node @{id}
        </span>
      }
      footer={
        <>
          <Space>
            <GeneratingTaskTrigger
              generating={generating || patchNodeResp.loading}
              icon={<IconPalette />}
              disabled={!modelId || !connections.length}
              disabledTooltip={[
                !modelId && 'Please select a model',
                !connections.length && 'Please connect a node as source',
              ].find(Boolean)}
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
            {src &&
              renderUpload(
                <Button icon={<IconUpload />} loading={patchNodeResp.loading}>
                  Upload
                </Button>,
              )}
          </Space>
          <GeneratingTaskStatus {...generatingTask} />
        </>
      }
    >
      {({ background }) => {
        return (
          <Spin loading={generating} className={styles.spin} tip="Generating">
            {src ? (
              <Image
                className={styles.image}
                src={src}
                style={{
                  background: `color-mix(in srgb, ${background} 75%, white 100%)`,
                }}
              />
            ) : (
              renderUpload(undefined, {
                drag: true,
                tip: 'Only picture can be uploaded',
                className: styles.dragUpload,
              })
            )}
          </Spin>
        );
      }}
    </NodeWrapper>
  );
};

export default CustomNodeImage;
