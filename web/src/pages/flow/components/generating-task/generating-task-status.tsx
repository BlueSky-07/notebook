import { Tooltip } from '@arco-design/web-react';
import { UseGeneratingTask } from './use-generating-task';

type GeneratingTaskStatusProps = Pick<
  UseGeneratingTask,
  'id' | 'data' | 'status'
>;

export const GeneratingTaskStatus = (props: GeneratingTaskStatusProps) => {
  const { id, data, status } = props;

  return (
    <>
      {id && (
        <span>
          GeneratingTask @{id} /{' '}
          <Tooltip content={data?.output?.errorMessage}>{status}</Tooltip>
        </span>
      )}
    </>
  );
};

export default GeneratingTaskStatus;
