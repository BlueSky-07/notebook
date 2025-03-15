import { Inngest } from 'inngest';
import FlowUpdatedFunction, {
  FlowUpdatedFunctionDependencies,
} from './flow-updated';
import GeneratingTaskCreatedFunction, {
  GeneratingTaskCreatedFunctionDependencies,
} from './generating-task-created';

import GeneratingTaskStatusChangedFunction, {
  GeneratingTaskStatusChangedFunctionDependencies,
} from './generating-task-status-changed';

type AllFunctionDependencies = FlowUpdatedFunctionDependencies &
  GeneratingTaskCreatedFunctionDependencies &
  GeneratingTaskStatusChangedFunctionDependencies;

export const createInngestFunctions = (
  inngest: Inngest,
  dependencies: AllFunctionDependencies,
) => {
  return [
    FlowUpdatedFunction.create(inngest, dependencies),
    GeneratingTaskCreatedFunction.create(inngest, dependencies),
    GeneratingTaskStatusChangedFunction.create(inngest, dependencies),
  ];
};
