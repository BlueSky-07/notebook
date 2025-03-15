import { Inngest } from 'inngest'
import FlowUpdatedFunction, { FlowUpdatedFunctionDependencies } from './flow-updated';

type AllFunctionDependencies = FlowUpdatedFunctionDependencies;

export const createInngestFunctions = (
  inngest: Inngest,
  dependencies: AllFunctionDependencies
) => {
  return [
    FlowUpdatedFunction.create(inngest, dependencies)
  ];
};
