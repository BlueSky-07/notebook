import { NodeEntity, NodeDataTypeEnum } from '@api/models'
import { Image } from '@arco-design/web-react';
import { NodeProps, Node } from '@xyflow/react';
import styles from './styles.module.less'
import DefaultHandles from '../../custom-handles'

type CustomNodeImageData = Pick<NodeEntity['data'], 'src'>

type CustomNodeImageProps = NodeProps<
  Node<CustomNodeImageData, typeof NodeDataTypeEnum.Text>
>

export const CustomNodeImage  = (props: CustomNodeImageProps) => {
  const { data, id } = props

  return (
    <>
      <div className={styles.customImageNode}>
        Image Node @{id}

        <Image
          width={300}
          className={styles.image}
          src={data.src}
          alt='lamp'
        />
      </div>
      <DefaultHandles />
    </>
  );
}

export default CustomNodeImage