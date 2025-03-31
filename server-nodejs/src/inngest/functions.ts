import { Inngest } from 'inngest';
import {
  createUpdateFlowUpdatedAtFunction,
  FlowUpdatedFunctionDependencies,
} from '../flow/functions/update-flow-updated-at';
import {
  createGenerateTextNodeContentFunction,
  GenerateTextNodeContentFunctionDependencies,
} from '../generating-task/functions/generate-text-node-content';
import {
  createUpdateNodeByGeneratingTaskFunction,
  UpdateNodeByGeneratingTaskFunctionDependencies,
} from '../generating-task/functions/update-node-by-generating-task';

type AllFunctionDependencies = FlowUpdatedFunctionDependencies &
  GenerateTextNodeContentFunctionDependencies &
  UpdateNodeByGeneratingTaskFunctionDependencies;

export const createInngestFunctions = (
  inngest: Inngest,
  dependencies: AllFunctionDependencies,
) => {
  return [
    createUpdateFlowUpdatedAtFunction(inngest, dependencies),
    createGenerateTextNodeContentFunction(inngest, dependencies),
    createUpdateNodeByGeneratingTaskFunction(inngest, dependencies),
  ];
};
