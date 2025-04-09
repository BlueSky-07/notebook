# GeneratingTaskApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addGeneratingTask**](#addgeneratingtask) | **POST** /generating-task | |
|[**getGeneratingTask**](#getgeneratingtask) | **GET** /generating-task/{id} | |
|[**stopGeneratingTask**](#stopgeneratingtask) | **POST** /generating-task/{id}/stop | |

# **addGeneratingTask**
> GeneratingTaskAddResponse addGeneratingTask(generatingTaskAddInput)


### Example

```typescript
import {
    GeneratingTaskApi,
    Configuration,
    GeneratingTaskAddInput
} from './api';

const configuration = new Configuration();
const apiInstance = new GeneratingTaskApi(configuration);

let generatingTaskAddInput: GeneratingTaskAddInput; //

const { status, data } = await apiInstance.addGeneratingTask(
    generatingTaskAddInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **generatingTaskAddInput** | **GeneratingTaskAddInput**|  | |


### Return type

**GeneratingTaskAddResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getGeneratingTask**
> GeneratingTaskEntity getGeneratingTask()


### Example

```typescript
import {
    GeneratingTaskApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GeneratingTaskApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getGeneratingTask(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**GeneratingTaskEntity**

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

# **stopGeneratingTask**
> GeneratingTaskStopResponse stopGeneratingTask()


### Example

```typescript
import {
    GeneratingTaskApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GeneratingTaskApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.stopGeneratingTask(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**GeneratingTaskStopResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

