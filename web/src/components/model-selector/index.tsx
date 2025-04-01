import { useRequest } from 'ahooks';
import API from '@/services/api';
import {
  Radio,
  type RadioGroupProps,
  Select,
  Spin,
  type SelectProps,
} from '@arco-design/web-react';
import styles from './styles.module.less';
import ModelInfo from '@/components/model-info';
import { CSSProperties, ReactNode } from 'react';
import cs from 'classnames';

interface ModelSelectorProps {
  type?: 'select' | 'radio';
  id?: string;
  onChange?: (id: string) => void;
  notAvailableContent?: ReactNode;
  style?: CSSProperties;
  className?: string;
  selectProps?: SelectProps;
  radioGroupProps?: RadioGroupProps;
}

export const ModelSelector = (props: ModelSelectorProps) => {
  const { type = 'select', id, onChange, notAvailableContent } = props;
  const modelsResp = useRequest(() => API.ai.getModels());

  if (modelsResp.loading || !modelsResp.data?.data)
    return <Spin loading={true} />;
  const aiInfo = modelsResp.data.data;
  const models = aiInfo.models;
  const enabled = aiInfo.enabled && Boolean(models.length);

  return (
    <div
      className={cs(styles.modelSelector, props.className)}
      style={props.style}
    >
      {!enabled && notAvailableContent}
      {enabled && type === 'select' && (
        <Select
          disabled={!enabled}
          style={{ width: '100%' }}
          options={models.map((model) => ({
            label: (
              <ModelInfo id={model.id} nameTooltipProps={{ position: 'top' }} />
            ),
            value: model.id,
          }))}
          value={id}
          onChange={onChange}
          allowClear={true}
          {...props.selectProps}
        />
      )}
      {enabled && type === 'radio' && (
        <Radio.Group
          direction="vertical"
          disabled={!enabled}
          style={{ width: '100%' }}
          options={models.map((model) => ({
            label: (
              <ModelInfo
                id={model.id}
                nameTooltipProps={{ position: 'right' }}
              />
            ),
            value: model.id,
          }))}
          value={id}
          onChange={onChange}
          {...props.radioGroupProps}
          className={cs(styles.radioGroup, props.radioGroupProps?.className)}
        />
      )}
    </div>
  );
};

export default ModelSelector;
