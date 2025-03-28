import { Inngest } from 'inngest';
import {
  createUpdateFlowUpdatedAtFunction,
  FlowUpdatedFunctionDependencies,
} from './update-flow-updated-at';
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
    createUpdateFlowUpdatedAtFunction(inngest, dependencies),
    GeneratingTaskCreatedFunction.create(inngest, dependencies),
    GeneratingTaskStatusChangedFunction.create(inngest, dependencies),
  ];
};
