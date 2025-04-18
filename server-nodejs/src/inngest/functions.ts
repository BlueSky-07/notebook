import { Inngest } from 'inngest';
import {
  createUpdateFlowUpdatedAtFunction,
  FlowUpdatedFunctionDependencies,
} from '../flow/functions/update-flow-updated-at';
import {
  createDeleteEdgesAfterNodeDeletedFunction,
  DeleteEdgesAfterNodeDeletedDependencies,
} from '../edge/functions/delete-edges-after-node-deleted';
import {
  createGenerateTextNodeContentFunction,
  GenerateTextNodeContentFunctionDependencies,
} from '../generating-task/functions/generate-text-node-content';
import {
  createGenerateImageNodeSrcFunction,
  GenerateImageNodeSrcFunctionDependencies,
} from '../generating-task/functions/generate-image-node-src';
import {
  createUpdateNodeByGeneratingTaskFunction,
  UpdateNodeByGeneratingTaskFunctionDependencies,
} from '../generating-task/functions/update-node-by-generating-task';
import {
  createUpdateFileReferencesForNodeFunction,
  UpdateFileReferencesForNodeDependencies,
} from '../file/functions/update-file-references-for-node';
import {
  createProcessAIModelAdapterFunction,
  ProcessAIModelAdapterDependencies,
} from '../ai/functions/process-ai-model-adapter';

type AllFunctionDependencies = // all dependencies
  FlowUpdatedFunctionDependencies &
    DeleteEdgesAfterNodeDeletedDependencies &
    GenerateTextNodeContentFunctionDependencies &
    GenerateImageNodeSrcFunctionDependencies &
    UpdateNodeByGeneratingTaskFunctionDependencies &
    UpdateFileReferencesForNodeDependencies &
    ProcessAIModelAdapterDependencies;

export const createInngestFunctions = (
  inngest: Inngest,
  dependencies: AllFunctionDependencies,
) => {
  return [
    createUpdateFlowUpdatedAtFunction(inngest, dependencies),
    createDeleteEdgesAfterNodeDeletedFunction(inngest, dependencies),
    createProcessAIModelAdapterFunction(inngest, dependencies),
    createGenerateTextNodeContentFunction(inngest, dependencies),
    createGenerateImageNodeSrcFunction(inngest, dependencies),
    createUpdateNodeByGeneratingTaskFunction(inngest, dependencies),
    createUpdateFileReferencesForNodeFunction(inngest, dependencies),
  ];
};
