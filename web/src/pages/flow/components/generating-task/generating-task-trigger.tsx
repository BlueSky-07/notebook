import { IconRecordStop } from '@arco-design/web-react/icon';
import { UseGeneratingTask } from './use-generating-task';
import { ReactNode } from 'react';
import { Tooltip, Button } from '@arco-design/web-react';

type GeneratingTaskTriggerProps = Pick<UseGeneratingTask, 'generating'> & {
  icon?: ReactNode;
  disabled?: boolean;
  disabledTooltip?: ReactNode;
  onStartTask?: () => void;
  onStopTask?: () => void;
};

export const GeneratingTaskTrigger = (props: GeneratingTaskTriggerProps) => {
  const {
    generating,
    icon,
    disabled,
    disabledTooltip,
    onStartTask,
    onStopTask,
  } = props;

  return (
    <>
      {!generating && (
        <Tooltip disabled={!disabled} content={disabledTooltip}>
          <Button
            icon={icon}
            onClick={() => onStartTask?.()}
            disabled={disabled}
          >
            {generating ? 'Generating' : 'Generate'}
          </Button>
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
    </>
  );
};

export default GeneratingTaskTrigger;
