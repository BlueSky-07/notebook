# EdgeEntity


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**dataType** | [**EdgeDataTypeEnum**](EdgeDataTypeEnum.md) |  | [optional] [default to undefined]
**id** | **number** |  | [default to undefined]
**flowId** | **number** |  | [default to undefined]
**sourceNodeId** | **number** |  | [optional] [default to undefined]
**targetNodeId** | **number** |  | [optional] [default to undefined]
**layout** | [**EdgeLayout**](EdgeLayout.md) |  | [default to undefined]
**data** | [**EdgeData**](EdgeData.md) |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]

## Example

```typescript
import { EdgeEntity } from './api';

const instance: EdgeEntity = {
    dataType,
    id,
    flowId,
    sourceNodeId,
    targetNodeId,
    layout,
    data,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
