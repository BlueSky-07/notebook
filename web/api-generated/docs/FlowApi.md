# FlowApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addFlow**](#addflow) | **POST** /flow | |
|[**deleteFlow**](#deleteflow) | **DELETE** /flow/{id} | |
|[**getAllFlows**](#getallflows) | **GET** /flow | |
|[**getFlow**](#getflow) | **GET** /flow/{id} | |
|[**getFlowFull**](#getflowfull) | **GET** /flow/full/{id} | |
|[**patchFlow**](#patchflow) | **PATCH** /flow/{id} | |

# **addFlow**
> FlowAddResponse addFlow(flowAddInput)


### Example

```typescript
import {
    FlowApi,
    Configuration,
    FlowAddInput
} from './api';

const configuration = new Configuration();
const apiInstance = new FlowApi(configuration);

let flowAddInput: FlowAddInput; //

const { status, data } = await apiInstance.addFlow(
    flowAddInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **flowAddInput** | **FlowAddInput**|  | |


### Return type

**FlowAddResponse**

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

# **deleteFlow**
> FlowDeleteResponse deleteFlow()


### Example

```typescript
import {
    FlowApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FlowApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteFlow(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**FlowDeleteResponse**

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

# **getAllFlows**
> FlowListResponse getAllFlows()


### Example

```typescript
import {
    FlowApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FlowApi(configuration);

let pageSize: number; // (optional) (default to 10)
let pageNumber: number; // (optional) (default to 0)
let keyword: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getAllFlows(
    pageSize,
    pageNumber,
    keyword
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageSize** | [**number**] |  | (optional) defaults to 10|
| **pageNumber** | [**number**] |  | (optional) defaults to 0|
| **keyword** | [**string**] |  | (optional) defaults to undefined|


### Return type

**FlowListResponse**

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

# **getFlow**
> FlowEntity getFlow()


### Example

```typescript
import {
    FlowApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FlowApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getFlow(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**FlowEntity**

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

# **getFlowFull**
> FlowFull getFlowFull()


### Example

```typescript
import {
    FlowApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FlowApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getFlowFull(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**FlowFull**

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

# **patchFlow**
> FlowEntity patchFlow(flowPatchInput)


### Example

```typescript
import {
    FlowApi,
    Configuration,
    FlowPatchInput
} from './api';

const configuration = new Configuration();
const apiInstance = new FlowApi(configuration);

let id: number; // (default to undefined)
let flowPatchInput: FlowPatchInput; //

const { status, data } = await apiInstance.patchFlow(
    id,
    flowPatchInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **flowPatchInput** | **FlowPatchInput**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**FlowEntity**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

