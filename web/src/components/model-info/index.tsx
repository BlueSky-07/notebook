import {
  Tag,
  Divider,
  Tooltip,
  type TooltipProps,
  Typography,
} from '@arco-design/web-react';
import { getModelProviderIcon, getModelNameIcon } from './helper';
import { createElement } from 'react';
import styles from './styles.module.less';

interface ModelInfoProps {
  id?: string;
  provider?: string;
  name?: string;
  nameTooltipProps?: TooltipProps;
}

export const ModelInfo = (props: ModelInfoProps) => {
  const { nameTooltipProps } = props;
  const provider = props.provider || props.id?.split('@')[1];
  const name = props.name || props.id?.split('@')[0];

  const [providerName, providerIcon] = getModelProviderIcon(provider) ?? [
    provider,
  ];
  const modelNameIcon = getModelNameIcon(name);
  const isSame = providerIcon === modelNameIcon && Boolean(modelNameIcon);

  return (
    <div className={styles.modelInfo}>
      <Tooltip content={providerName} disabled={!providerName}>
        {providerIcon ? (
          createElement(providerIcon, { size: 14, style: { lineHeight: 22 } })
        ) : (
          <Tag className={styles.provider} size="small" color="gray">
            {providerName.slice(0, 5)}
          </Tag>
        )}
      </Tooltip>
      {!isSame && modelNameIcon && (
        <>
          {providerIcon && <Divider type="vertical" />}
          {createElement(modelNameIcon, {
            size: 14,
            style: { lineHeight: 22 },
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
  );
};

export default ModelInfo;
