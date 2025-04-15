# GeneratingTaskOutput


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**generatedText** | **string** | generated content | [optional] [default to undefined]
**generatedFile** | **number** | generated file | [optional] [default to undefined]
**generatedReasoning** | **string** | generated reasoning | [optional] [default to undefined]
**generatedUsage** | [**GeneratedUsage**](GeneratedUsage.md) | generated usage | [optional] [default to undefined]
**errorMessage** | **string** | error message | [optional] [default to undefined]

## Example

```typescript
import { GeneratingTaskOutput } from './api';

const instance: GeneratingTaskOutput = {
    generatedText,
    generatedFile,
    generatedReasoning,
    generatedUsage,
    errorMessage,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
