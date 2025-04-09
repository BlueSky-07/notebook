import { NodeEntity, NodeDataTypeEnum } from '@api/models';
import { Image } from '@arco-design/web-react';
import { NodeProps, Node } from '@xyflow/react';
import styles from './styles.module.less';
import { IconImage } from '@arco-design/web-react/icon';
import { useState } from 'react';
import NodeWrapper from '@/pages/flow/components/node-wrapper';

type CustomNodeImageData = Pick<NodeEntity['data'], 'src' | 'background'>;

type CustomNodeImageProps = NodeProps<
  Node<CustomNodeImageData, typeof NodeDataTypeEnum.Image>
>;

export const CustomNodeImage = (props: CustomNodeImageProps) => {
  const { data, id } = props;
  const [src, setSrc] = useState(data.src);
  const background = data.background || 'white';

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
      footer={<div>footer</div>}
    >
      <Image
        className={styles.image}
        src={src}
        style={{
          background: `color-mix(in srgb, ${background} 75%, white 100%)`,
        }}
      />
    </NodeWrapper>
  );
};

export default CustomNodeImage;
