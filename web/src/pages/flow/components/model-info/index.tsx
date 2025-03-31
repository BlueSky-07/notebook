import { useRequest } from 'ahooks';
import API from '@/services/api';
import { Select, Space, Spin, Tag } from '@arco-design/web-react';
import styles from './styles.module.less';
import { IconBulb } from '@arco-design/web-react/icon';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useShallow } from 'zustand/shallow';

export const ModelInfo = () => {
  const modelsResponse = useRequest(() => API.ai.getModels());

  const { modelId, updateModelId } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'modelId' | 'updateModelId'>>(
      (state) => ({
        modelId: state.modelId,
        updateModelId: state.updateModelId,
      }),
    ),
  );

  if (modelsResponse.loading || !modelsResponse.data?.data)
    return <Spin loading={true} />;
  const aiInfo = modelsResponse.data.data;
  const models = aiInfo.models;
  const enabled = aiInfo.enabled && Boolean(models.length);

  return (
    <div className={styles.aiInfo}>
      <Space>
        <span className={styles.label}>
          <IconBulb /> AI
        </span>
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? 'Ready' : 'Not Ready'}
        </Tag>
      </Space>
      {Boolean(models.length) && (
        <Space direction="vertical" className={styles.name}>
          <Select
            disabled={!enabled}
            style={{ width: 200 }}
            size="mini"
            placeholder="Please select a model first"
            options={models.map((model) => ({
              label: model.modelName,
              value: model.id,
            }))}
            value={modelId}
            onChange={updateModelId}
            allowClear={true}
          />
        </Space>
      )}
    </div>
  );
};
