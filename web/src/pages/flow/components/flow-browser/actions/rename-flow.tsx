import TipButton from '@/components/tip-button';
import { Input } from '@arco-design/web-react';
import { useState } from 'react';
import { useRequest } from 'ahooks';
import API from '@/services/api';
import { FlowEntity } from '@api/models';
import { SquarePen } from 'lucide-react';

interface RenameFlowProps {
  flow: Pick<FlowEntity, 'id' | 'name'>;
  onRename?: () => void;
}

export const RenameFlow = (props: RenameFlowProps) => {
  const { flow, onRename } = props;
  const [newName, setNewName] = useState<string>();

  const patchReq = useRequest(
    (name: string) =>
      API.flow.patchFlow(flow.id, {
        name,
      }),
    {
      manual: true,
    },
  );

  return (
    <TipButton
      tip="Rename"
      icon={<SquarePen style={{ width: 16, height: 16 }} />}
      type="text"
      size="mini"
      popconfirmProps={{
        icon: (
          <SquarePen
            style={{ width: 16, height: 16, color: 'rgb(var(--primary-6))' }}
          />
        ),
        title: 'Rename Flow',
        content: (
          <Input
            style={{ width: 220 }}
            placeholder="Name"
            value={newName}
            onChange={setNewName}
          />
        ),
        onOk: async () => {
          if (!newName || newName === flow.name) return;
          try {
            await patchReq.runAsync(newName);
            setNewName('');
            onRename?.();
          } catch (error) {
            /* empty */
          }
        },
        onCancel: () => {
          setNewName('');
        },
        okButtonProps: {
          disabled: !newName,
          loading: patchReq.loading,
        },
      }}
    />
  );
};

export default RenameFlow;
