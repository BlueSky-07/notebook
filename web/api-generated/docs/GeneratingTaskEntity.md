# GeneratingTaskEntity


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | [**GeneratingTaskStatusEnum**](GeneratingTaskStatusEnum.md) |  | [default to undefined]
**id** | **number** |  | [default to undefined]
**flowId** | **number** |  | [default to undefined]
**targetNodeId** | **number** |  | [default to undefined]
**input** | [**GeneratingTaskInput**](GeneratingTaskInput.md) |  | [default to undefined]
**output** | [**GeneratingTaskOutput**](GeneratingTaskOutput.md) |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]

## Example

```typescript
import { GeneratingTaskEntity } from './api';

const instance: GeneratingTaskEntity = {
    status,
    id,
    flowId,
    targetNodeId,
    input,
    output,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
