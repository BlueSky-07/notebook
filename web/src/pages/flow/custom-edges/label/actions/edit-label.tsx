import TipButton from '@/components/tip-button';
import { Input } from '@arco-design/web-react';
import { IconEdit } from '@arco-design/web-react/icon';
import { useState } from 'react';

interface EditLabelProps {
  value?: string;
  onSubmit?: (value?: string) => void;
}

export const EditLabel = (props: EditLabelProps) => {
  const { value, onSubmit } = props;
  const [newValue, setNewValue] = useState(value);

  return (
    <TipButton
      tip="Edit Label"
      icon={<IconEdit />}
      size="mini"
      type="text"
      popconfirmProps={{
        icon: <IconEdit />,
        title: 'Edit Label',
        content: (
          <Input.TextArea
            autoSize={{ maxRows: 5, minRows: 2 }}
            style={{ width: 220 }}
            placeholder="Name"
            value={newValue}
            onChange={setNewValue}
            allowClear={true}
          />
        ),
        okText: 'Yes',
        onOk: () => {
          onSubmit?.(newValue);
        },
        onCancel: () => {
          setNewValue(value);
        },
      }}
    />
  );
};

export default EditLabel;
