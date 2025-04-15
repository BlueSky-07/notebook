import {
  Tag,
  Tooltip,
  type TooltipProps,
  Typography,
  Space,
} from '@arco-design/web-react';
import { getModelProviderIcon, getModelNameIcon } from './helper';
import { createElement } from 'react';
import styles from './styles.module.less';
import { AiModelInfo } from '@api/models';
import { MODEL_FEATURES } from './const';

interface ModelInfoProps {
  id?: string;
  provider?: string;
  name?: string;
  nameTooltipProps?: TooltipProps;
  providerIconVisible?: boolean;
  features?: AiModelInfo['features'];
}

export const ModelInfo = (props: ModelInfoProps) => {
  const { nameTooltipProps, providerIconVisible = true, features = [] } = props;
  const provider = props.provider || props.id?.split('@')[1] || '';
  const name = props.name || props.id?.split('@')[0] || '';

  const [providerName, providerIcon] = getModelProviderIcon(provider) ?? [
    provider,
  ];
  const modelNameIcon = getModelNameIcon(name);
  const isSame = providerIcon === modelNameIcon && Boolean(modelNameIcon);

  const renderFeatureTip = () => {
    const featureConfigs = features.map(
      (feature) =>
        MODEL_FEATURES[feature] ?? {
          label: feature,
          icon: null,
        },
    );
    if (!featureConfigs.length) return null;

    return (
      <Space className={styles.feature}>
        {featureConfigs.map((feature) => (
          <Tooltip content={feature.label}>
            {feature.icon ?? feature.label}
          </Tooltip>
        ))}
      </Space>
    );
  };

  return (
    <>
      <div className={styles.modelInfo}>
        {renderFeatureTip()}
        {providerIconVisible && (
          <Tooltip content={providerName} disabled={!providerName}>
            {providerIcon ? (
              createElement(providerIcon, { size: 14 })
            ) : (
              <Tag className={styles.provider} size="small" color="gray">
                {providerName.slice(0, 5)}
              </Tag>
            )}
          </Tooltip>
        )}
        {!isSame && modelNameIcon && (
          <>
            {createElement(modelNameIcon, {
              size: 14,
            })}
          </>
        )}
        <div className={styles.name}>
          <Typography.Ellipsis
            showTooltip={{ position: 'right', ...nameTooltipProps }}
          >
            {name}
          </Typography.Ellipsis>
        </div>
      </div>
    </>
  );
};

export default ModelInfo;
