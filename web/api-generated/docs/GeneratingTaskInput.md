# GeneratingTaskInput


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**modelId** | **string** | model id | [optional] [default to undefined]
**prompt** | **string** | prompt to trigger generating task | [optional] [default to undefined]
**sourceNodeSnapshots** | **Array&lt;Array&lt;NodeEntity&gt;&gt;** |  | [default to undefined]
**edgeSnapshots** | [**Array&lt;EdgeEntity&gt;**](EdgeEntity.md) | generating from source edges | [optional] [default to undefined]

## Example

```typescript
import { GeneratingTaskInput } from './api';

const instance: GeneratingTaskInput = {
    modelId,
    prompt,
    sourceNodeSnapshots,
    edgeSnapshots,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
