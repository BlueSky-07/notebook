import { FlowEntity } from '@api/models';
import { Popconfirm, Input } from '@arco-design/web-react';
import { useState } from 'react';
import API from '@/services/api';
import { useRequest } from 'ahooks';

interface FlowNameProps {
  flowId: FlowEntity['id'];
  name: FlowEntity['name'];
  onChange: (name: FlowEntity['name']) => void;
}

export const FlowName = (props: FlowNameProps) => {
  const { flowId, name, onChange } = props;
  const [newName, setNewName] = useState<string>(name);
  const updateResp = useRequest(
    (name: string) =>
      API.flow.patchFlow(flowId, {
        name,
      }),
    {
      manual: true,
    },
  );

  return (
    <Popconfirm
      title="Set New Name:"
      position="right"
      content={<Input value={newName} onChange={setNewName} />}
      okButtonProps={{
        loading: updateResp.loading,
        disabled: !newName,
      }}
      cancelButtonProps={{
        loading: updateResp.loading,
      }}
      onOk={async () => {
        if (!newName) return;
        try {
          await updateResp.runAsync(newName);
          onChange(newName);
        } catch (error) {}
      }}
      onCancel={() => {
        setNewName(name);
      }}
    >
      {name}
    </Popconfirm>
  );
};

export default FlowName;
