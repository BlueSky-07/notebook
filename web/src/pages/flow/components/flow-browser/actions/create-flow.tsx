import TipButton from '@/components/tip-button';
import { Input } from '@arco-design/web-react';
import { useState } from 'react';
import { useRequest } from 'ahooks';
import API from '@/services/api';
import { FlowEntity } from '@api/models';
import { FilePlus } from 'lucide-react';

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
      icon={<FilePlus style={{ width: 16, height: 16 }} />}
      type="text"
      popconfirmProps={{
        icon: (
          <FilePlus
            style={{ width: 16, height: 16, color: 'rgb(var(--primary-6))' }}
          />
        ),
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
