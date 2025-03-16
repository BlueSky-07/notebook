import { NodeEntity, NodeDataTypeEnum } from '@api/models'
import { Image, Space } from '@arco-design/web-react';
import { NodeProps, Node } from '@xyflow/react';
import styles from './styles.module.less'
import DefaultHandles from '../../custom-handles'
import { IconImage } from '@arco-design/web-react/icon'

type CustomNodeImageData = Pick<NodeEntity['data'], 'src'>

type CustomNodeImageProps = NodeProps<
  Node<CustomNodeImageData, typeof NodeDataTypeEnum.Text>
>

export const CustomNodeImage  = (props: CustomNodeImageProps) => {
  const { data, id } = props

  return (
    <>
      <Space className={styles.customImageNode} direction='vertical'>
        <span><IconImage /> Image Node @{id}</span>

        <Image
          width={300}
          className={styles.image}
          src={data.src}
          alt='lamp'
        />
      </Space>
      <DefaultHandles />
    </>
  );
}

export default CustomNodeImage