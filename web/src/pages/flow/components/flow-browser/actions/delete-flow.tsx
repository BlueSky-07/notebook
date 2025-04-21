import { FlowEntity } from '@api/models';
import API from '@/services/api';
import TipButton from '@/components/tip-button';
import { useRequest } from 'ahooks';
import { FileX } from 'lucide-react';

interface DeleteFlowProps {
  flow: Pick<FlowEntity, 'id' | 'name'>;
  onDelete?: () => void;
}

const DeleteFlow = (props: DeleteFlowProps) => {
  const { flow, onDelete } = props;
  const deleteReq = useRequest(() => API.flow.deleteFlow(flow.id), {
    manual: true,
  });
  return (
    <TipButton
      tip="Delete"
      icon={<FileX style={{ width: 16, height: 16 }} />}
      status="danger"
      type="text"
      size="mini"
      popconfirmProps={{
        icon: (
          <FileX
            style={{ width: 16, height: 16, color: 'rgb(var(--danger-6))' }}
          />
        ),
        title: (
          <span style={{ color: 'rgb(var(--danger-6))' }}>Delete Flow</span>
        ),
        content: `Are you sure to delete flow "${flow.name}"?`,
        okText: 'Yes',
        okButtonProps: {
          status: 'danger',
          loading: deleteReq.loading,
        },
        onOk: async () => {
          await deleteReq.runAsync();
          onDelete?.();
        },
      }}
    />
  );
};

export default DeleteFlow;
