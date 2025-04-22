import { IconRecordStop } from '@arco-design/web-react/icon';
import { UseGeneratingTask } from './use-generating-task';
import { ReactNode } from 'react';
import { Tooltip, Button, Space, Dropdown } from '@arco-design/web-react';
import styles from './styles.module.less';
import { AiModelInfo } from '@api/models';
import ModelSelector from '@/components/model-selector';

type GeneratingTaskTriggerProps = Pick<UseGeneratingTask, 'generating'> & {
  modelId?: string;
  modelFeatures?: AiModelInfo['features'];
  onChangeModelId?: (modelId?: string) => void;
  icon?: ReactNode;
  disabled?: boolean;
  disabledTooltip?: ReactNode;
  onStartTask?: () => void;
  onStopTask?: () => void;
};

export const GeneratingTaskTrigger = (props: GeneratingTaskTriggerProps) => {
  const {
    modelId,
    modelFeatures,
    onChangeModelId,
    generating,
    icon,
    disabled,
    disabledTooltip,
    onStartTask,
    onStopTask,
  } = props;

  return (
    <Space>
      {!generating && (
        <Tooltip disabled={!disabled} content={disabledTooltip}>
          <div>
            <Dropdown
              droplist={
                <Space direction="vertical" className={styles.triggerPopup}>
                  <div className={styles.triggerPopupTitle}>
                    Select a model:
                  </div>
                  <div style={{ width: 250 }}>
                    <ModelSelector
                      type="select"
                      selectProps={{
                        getPopupContainer: () => document.body,
                      }}
                      id={modelId}
                      features={modelFeatures}
                      showFilterByFeatures={true}
                      onChange={onChangeModelId}
                    />
                  </div>
                </Space>
              }
            >
              <div>
                <Button
                  icon={icon}
                  onClick={() => onStartTask?.()}
                  disabled={disabled}
                >
                  {generating ? 'Generating' : 'Generate'}
                </Button>
              </div>
            </Dropdown>
          </div>
        </Tooltip>
      )}
      {generating && (
        <Button
          icon={<IconRecordStop />}
          status="danger"
          onClick={() => onStopTask?.()}
        >
          Stop
        </Button>
      )}
    </Space>
  );
};

export default GeneratingTaskTrigger;
