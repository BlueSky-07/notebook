import { ReactFlowInstance, useReactFlow } from '@xyflow/react';
import { Ref, useImperativeHandle } from 'react';

export interface ReactFlowRef {
  get: () => ReactFlowInstance;
}

interface ReactFlowRefForwarder {
  ref?: Ref<ReactFlowRef>;
}

export const ReactFlowRefForwarder = (props: ReactFlowRefForwarder) => {
  const { ref } = props;
  const reactFlow = useReactFlow();

  useImperativeHandle(ref, () => {
    return {
      get: () => reactFlow,
    };
  }, [reactFlow]);

  return null;
};

export default ReactFlowRefForwarder;
