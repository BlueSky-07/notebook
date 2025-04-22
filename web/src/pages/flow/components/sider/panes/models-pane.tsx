import { Tag } from '@arco-design/web-react';
import styles from './styles.module.less';
import useFlowStore, { type FlowState } from '@/stores/flow';
import { useShallow } from 'zustand/shallow';
import ModelSelector from '@/components/model-selector';

export const ModelsPane = () => {
  const { modelId, updateModelId } = useFlowStore(
    useShallow<FlowState, Pick<FlowState, 'modelId' | 'updateModelId'>>(
      (state) => ({
        modelId: state.modelId,
        updateModelId: state.updateModelId,
      }),
    ),
  );

  return (
    <div className={styles.modelsPane}>
      <div className={styles.description}>Select a model for Generating:</div>
      <ModelSelector
        type="radio"
        id={modelId}
        onChange={updateModelId}
        notAvailableContent={
          <Tag color="red" size="small">
            AI Models Not Available
          </Tag>
        }
        showFilterByFeatures={true}
        selectProps={{
          placeholder: 'Model',
        }}
        onSelectedNotFound={() => {
          updateModelId(undefined);
        }}
      />
    </div>
  );
};

export default ModelsPane;
