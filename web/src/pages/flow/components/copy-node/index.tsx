import { Drawer } from '@arco-design/web-react';
import { useRequest } from 'ahooks';
import API from '@/services/api';
import useFlowStore, { FlowState } from '@/stores/flow';
import { useShallow } from 'zustand/shallow';
import { type Node } from '@xyflow/react';
import { FlowEntity, NodeEntity } from '@api/models';
import { convertFlowNodeToNodeEntity } from '@/models/flow';
import { useState } from 'react';
import { IconCheckCircleFill, IconCopy } from '@arco-design/web-react/icon';
import TipButton from '@/components/tip-button';
import FlowBrowser from '@/pages/flow/components/flow-browser';

interface CopyNodeProps {
  flowId: FlowEntity['id'];
  node: Node;
}

export const CopyNode = (props: CopyNodeProps) => {
  const { flowId, node } = props;
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  const { addNode } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'addNode'>>((state) => ({
      addNode: state.addNode,
    })),
  );

  const listResp = useRequest(
    (pageNumber?: number) => API.flow.getAllFlows(10, pageNumber),
    {
      manual: true,
    },
  );

  const handleCopy = async (targetFlowId: FlowEntity['id']) => {
    const newNode = {
      ...node,
      id: Date.now().toString(),
    };
    if (targetFlowId === flowId) {
      await addNode(node.type as NodeEntity['dataType'], {
        ...newNode,
        position: {
          x: node.position.x + 100,
          y: node.position.y + 100,
        },
      });
    } else {
      await API.node.addNode(
        convertFlowNodeToNodeEntity(newNode, targetFlowId),
      );
    }
    setVisible(false);
    setDone(true);
    setTimeout(() => {
      setDone(false);
    }, 2000);
  };

  return (
    <>
      <TipButton
        tip="Copy"
        icon={done ? <IconCheckCircleFill /> : <IconCopy />}
        size="mini"
        type="text"
        status={done ? 'success' : 'default'}
        loading={listResp.loading}
        onClick={() => {
          if (!done) setVisible(true);
        }}
      />
      <Drawer
        title="Copy"
        visible={visible}
        onCancel={() => setVisible(false)}
        width={300}
        unmountOnExit={true}
        footer={null}
      >
        <FlowBrowser
          flowId={flowId}
          features={['search', 'select']}
          onSelect={handleCopy}
        />
      </Drawer>
    </>
  );
};

export default CopyNode;
