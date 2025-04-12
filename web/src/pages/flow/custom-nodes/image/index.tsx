import { NodeEntity, NodeDataTypeEnum, FileEntity } from '@api/models';
import {
  Image,
  Button,
  Upload,
  type UploadProps,
} from '@arco-design/web-react';
import { NodeProps, Node } from '@xyflow/react';
import styles from './styles.module.less';
import { IconImage, IconUpload } from '@arco-design/web-react/icon';
import { ReactNode, useEffect, useState } from 'react';
import NodeWrapper from '@/pages/flow/components/node-wrapper';
import usePatchNode from '@/pages/flow/hooks/usePatchNode';
import API from '@/services/api';
import { getFileEntityLink } from '@/utils/storage';

type CustomNodeImageData = Pick<
  NodeEntity['data'],
  'src' | 'fileId' | 'background'
>;

type CustomNodeImageProps = NodeProps<
  Node<CustomNodeImageData, typeof NodeDataTypeEnum.Image>
>;

export const CustomNodeImage = (props: CustomNodeImageProps) => {
  const { data, id } = props;
  const [src, setSrc] = useState(data.src);

  const patchNodeResp = usePatchNode<CustomNodeImageData>({ id, data });

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
      footer={renderUpload(
        <Button icon={<IconUpload />} loading={patchNodeResp.loading}>
          Upload
        </Button>,
      )}
    >
      {({ background }) => {
        return src ? (
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
        );
      }}
    </NodeWrapper>
  );
};

export default CustomNodeImage;
