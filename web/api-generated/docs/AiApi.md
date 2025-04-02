# AiApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getModels**](#getmodels) | **GET** /ai/models | |

# **getModels**
> AiModelsResponse getModels()


### Example

```typescript
import {
    AiApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AiApi(configuration);

const { status, data } = await apiInstance.getModels();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AiModelsResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

