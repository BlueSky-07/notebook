import { useRequest } from 'ahooks';
import API from '@/services/api';
import {
  Radio,
  type RadioGroupProps,
  Select,
  Spin,
  type SelectProps,
  Checkbox,
  Empty,
  Divider,
  Space,
} from '@arco-design/web-react';
import styles from './styles.module.less';
import ModelInfo from '@/components/model-info';
import { createElement, CSSProperties, ReactNode, useState } from 'react';
import cs from 'classnames';
import { groupBy, intersection } from 'lodash-es';
import { getModelProviderIcon } from '../model-info/helper';
import { AiModelInfo } from '@api/models';
import { MODEL_FEATURES } from '../model-info/const';
import TipButton from '../tip-button';
import { IconFilter } from '@arco-design/web-react/icon';

interface ModelSelectorProps {
  type?: 'select' | 'radio';
  id?: string;
  onChange?: (id: string) => void;
  features?: AiModelInfo['features'];
  showFilterByFeatures?: boolean;
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
    features,
    notAvailableContent = <Empty />,
    onSelectedNotFound,
  } = props;
  const modelsResp = useRequest(() => API.ai.getAllModels());
  const [filterByFeatures, setFilterByFeatures] = useState<string[]>([]);

  if (modelsResp.loading || !modelsResp.data?.data)
    return <Spin loading={true} />;

  const aiInfo = modelsResp.data.data;
  const availableModels = aiInfo.models.filter((model) => {
    if (features?.length) {
      return Boolean(intersection(features, model.features).length);
    }
    return true;
  });

  const models = availableModels.filter((model) => {
    if (filterByFeatures.length) {
      return Boolean(intersection(filterByFeatures, model.features).length);
    }
    return true;
  });
  const groups = groupBy(models, (model) => model.provider) ?? {};

  const enabled = aiInfo.enabled && Boolean(availableModels.length);
  if (
    id &&
    !availableModels.find((model) => model.id === id) &&
    onSelectedNotFound
  ) {
    onSelectedNotFound(id);
  }

  const filterByFeatureOptions = new Set<string>();
  for (const model of availableModels) {
    for (const feature of model.features) filterByFeatureOptions.add(feature);
  }

  return (
    <div
      className={cs(styles.modelSelector, props.className)}
      style={props.style}
    >
      {!enabled && notAvailableContent}
      {enabled &&
        props.showFilterByFeatures &&
        filterByFeatureOptions.size > 1 && (
          <Space size={16}>
            <IconFilter />
            <Checkbox.Group onChange={setFilterByFeatures}>
              {Array.from(filterByFeatureOptions).map((feature) => {
                const featureConfig = MODEL_FEATURES[feature] ?? {
                  label: feature,
                  icon: null,
                };
                return (
                  <Checkbox value={feature}>
                    {({ checked }) => (
                      <TipButton
                        size="mini"
                        type={checked ? 'primary' : 'default'}
                        tip={featureConfig.label}
                        icon={featureConfig.icon}
                      />
                    )}
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </Space>
        )}
      {enabled && type === 'select' && (
        <Select
          disabled={!enabled}
          style={{ width: '100%' }}
          value={id}
          onChange={onChange}
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
          placeholder="Please select a model"
          {...props.selectProps}
        >
          {Object.entries(groups).map(([provider, models]) => {
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
          {Object.entries(groups).map(([provider, models], index) => {
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
                      <ModelInfo
                        id={model.id}
                        nameTooltipProps={{ position: 'top' }}
                        providerIconVisible={false}
                        features={model.features}
                      />
                    </Radio>
                  ))}
                </div>
                {index !== Object.keys(groups).length - 1 && (
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
