import { useRequest } from 'ahooks';
import API from '@/services/api';
import {
  Radio,
  type RadioGroupProps,
  Select,
  Spin,
  type SelectProps,
  Space,
  Empty,
  Divider,
} from '@arco-design/web-react';
import styles from './styles.module.less';
import ModelInfo from '@/components/model-info';
import { createElement, CSSProperties, ReactNode } from 'react';
import cs from 'classnames';
import { groupBy } from 'lodash-es';
import { getModelProviderIcon } from '../model-info/helper';

interface ModelSelectorProps {
  type?: 'select' | 'radio';
  id?: string;
  onChange?: (id: string) => void;
  notAvailableContent?: ReactNode;
  style?: CSSProperties;
  className?: string;
  selectProps?: SelectProps;
  radioGroupProps?: RadioGroupProps;
  onSelectedNotFound?: (id: string) => void;
}

export const ModelSelector = (props: ModelSelectorProps) => {
  const {
    type = 'select',
    id,
    onChange,
    notAvailableContent = <Empty />,
    onSelectedNotFound,
  } = props;
  const modelsResp = useRequest(() => API.ai.getModels());

  if (modelsResp.loading || !modelsResp.data?.data)
    return <Spin loading={true} />;
  const aiInfo = modelsResp.data.data;
  const models = aiInfo.models;
  const enabled = aiInfo.enabled && Boolean(models.length);
  if (id && !models.find((model) => model.id === id) && onSelectedNotFound) {
    onSelectedNotFound(id);
  }
  const group = groupBy(models, (model) => model.provider) ?? {};

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
          value={id}
          onChange={onChange}
          allowClear={true}
          renderFormat={(option, value) => {
            const model = models.find((model) => model.id === value);
            return model ? (
              <ModelInfo
                id={value as string}
                nameTooltipProps={{ position: 'top' }}
                features={model.features}
              />
            ) : (
              <>{value}</>
            );
          }}
          showSearch={true}
          filterOption={(inputValue, option) => {
            return (option.props as { value: string }).value.includes(
              inputValue?.trim()?.toLowerCase(),
            );
          }}
          {...props.selectProps}
        >
          {Object.entries(group).map(([provider, models]) => {
            const [providerName, providerIcon] = getModelProviderIcon(
              provider,
            ) ?? [provider];
            return (
              <Select.OptGroup
                label={
                  providerIcon ? (
                    <div className={styles.providerGroupName}>
                      {createElement(providerIcon, {
                        size: 14,
                        style: { marginRight: 8 },
                      })}
                      <span>{providerName}</span>
                    </div>
                  ) : (
                    provider
                  )
                }
                key={provider}
              >
                {models.map((model) => (
                  <Select.Option key={model.id} value={model.id}>
                    <ModelInfo
                      id={model.id}
                      nameTooltipProps={{ position: 'top' }}
                      providerIconVisible={false}
                      features={model.features}
                    />
                  </Select.Option>
                ))}
              </Select.OptGroup>
            );
          })}
        </Select>
      )}
      {enabled && type === 'radio' && (
        <Radio.Group
          direction="vertical"
          disabled={!enabled}
          style={{ width: '100%' }}
          value={id}
          onChange={onChange}
          {...props.radioGroupProps}
          className={cs(styles.radioGroup, props.radioGroupProps?.className)}
        >
          {Object.entries(group).map(([provider, models], index) => {
            const [providerName, providerIcon] = getModelProviderIcon(
              provider,
            ) ?? [provider];
            return (
              <>
                <div className={styles.providerGroup}>
                  {providerIcon ? (
                    <div className={styles.providerGroupName}>
                      {createElement(providerIcon, {
                        size: 18,
                        style: { marginRight: 8 },
                      })}
                      <span>{providerName}</span>
                    </div>
                  ) : (
                    provider
                  )}
                  {models.map((model) => (
                    <Radio key={model.id} value={model.id}>
                      {(radioProps) => {
                        return (
                          <Radio
                            {...radioProps}
                            className={styles.radioWrapper}
                          >
                            <ModelInfo
                              id={model.id}
                              nameTooltipProps={{ position: 'top' }}
                              providerIconVisible={false}
                              features={model.features}
                            />
                          </Radio>
                        );
                      }}
                    </Radio>
                  ))}
                </div>
                {index !== Object.keys(group).length - 1 && (
                  <Divider className={styles.divider} />
                )}
              </>
            );
          })}
        </Radio.Group>
      )}
    </div>
  );
};

export default ModelSelector;
