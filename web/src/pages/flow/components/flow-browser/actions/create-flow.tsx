import TipButton from '@/components/tip-button';
import { Input } from '@arco-design/web-react';
import { useState } from 'react';
import { useRequest } from 'ahooks';
import API from '@/services/api';
import { IconDriveFile } from '@arco-design/web-react/icon';
import { FlowEntity } from '@api/models';

interface CreateFlowProps {
  onCreate?: (flowId: FlowEntity['id']) => void;
}

export const CreateFlow = (props: CreateFlowProps) => {
  const { onCreate } = props;
  const [newName, setNewName] = useState<string>('');

  const createReq = useRequest(
    (name: string) =>
      API.flow.addFlow({
        name,
      }),
    {
      manual: true,
    },
  );

  return (
    <TipButton
      tip="Create"
      icon={<IconDriveFile />}
      type="text"
      popconfirmProps={{
        icon: <IconDriveFile style={{ color: 'rgb(var(--primary-6))' }} />,
        title: 'Create Flow',
        content: (
          <Input
            style={{ width: 220 }}
            placeholder="Name"
            value={newName}
            onChange={setNewName}
          />
        ),
        onOk: async () => {
          if (!newName) return;
          try {
            const createResp = await createReq.runAsync(newName);
            setNewName('');
            onCreate?.(createResp.data?.id);
          } catch (error) {
            /* empty */
          }
        },
        okButtonProps: {
          disabled: !newName,
          loading: createReq.loading,
        },
      }}
    />
  );
};

export default CreateFlow;
