import { FlowEntity } from '@api/models';
import API from '@/services/api';
import TipButton from '@/components/tip-button';
import { IconDelete } from '@arco-design/web-react/icon';
import { useRequest } from 'ahooks';

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
      icon={<IconDelete />}
      status="danger"
      type="text"
      size="mini"
      popconfirmProps={{
        icon: <IconDelete style={{ color: 'rgb(var(--danger-6))' }} />,
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
