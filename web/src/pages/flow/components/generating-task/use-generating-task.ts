import {
  GeneratingTaskAddInput,
  GeneratingTaskEntity,
  GeneratingTaskStatusEnum,
} from '@api/models';
import { useState } from 'react';
import API from '@/services/api';
import useRequest from 'ahooks/lib/useRequest';

export interface UseGeneratingTaskProps {
  id?: GeneratingTaskEntity['id'];
  status?: GeneratingTaskEntity['status'];
  onDone?: (task: GeneratingTaskEntity) => void;
}

export interface UseGeneratingTask {
  generating: boolean;
  id?: GeneratingTaskEntity['id'];
  status?: GeneratingTaskEntity['status'];
  data?: GeneratingTaskEntity;
  start: (body: GeneratingTaskAddInput) => Promise<GeneratingTaskEntity['id']>;
  stop: () => Promise<void>;
}

export const useGeneratingTask = (
  props: UseGeneratingTaskProps,
): UseGeneratingTask => {
  const { onDone } = props;

  const [id, setId] = useState(props.id);
  const [status, setStatus] = useState(props.status);

  const generating = (
    [
      GeneratingTaskStatusEnum.Pending,
      GeneratingTaskStatusEnum.Generating,
    ] as GeneratingTaskStatusEnum[]
  ).includes(status || ('' as GeneratingTaskStatusEnum));

  const generatingTaskResp = useRequest(
    () => API.generatingTask.getGeneratingTask(id!),
    {
      refreshDeps: [id],
      ready:
        (id != null && generating) ||
        status === GeneratingTaskStatusEnum.Failed,
      pollingInterval: generating ? 3000 : undefined,
      onSuccess: (resp) => {
        setStatus(resp.data.status);
        if (resp.data.status === GeneratingTaskStatusEnum.Done) {
          onDone?.(resp.data);
        }
      },
    },
  );

  return {
    generating,
    id,
    status,
    data: generatingTaskResp.data?.data,
    start: async (body: GeneratingTaskAddInput) => {
      const createGenerateTaskResp =
        await API.generatingTask.addGeneratingTask(body);
      setId(createGenerateTaskResp.data.id);
      setStatus(GeneratingTaskStatusEnum.Pending);
      return createGenerateTaskResp.data.id;
    },
    stop: async () => {
      if (id != null) {
        await API.generatingTask.stopGeneratingTask(id);
        generatingTaskResp.run();
      }
    },
  };
};

export default useGeneratingTask;
