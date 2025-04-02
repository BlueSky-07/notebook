# EdgeApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addEdge**](#addedge) | **POST** /edge | |
|[**addEdges**](#addedges) | **POST** /edge/batch | |
|[**deleteEdge**](#deleteedge) | **DELETE** /edge/{id} | |
|[**deleteEdges**](#deleteedges) | **DELETE** /edge/batch | |
|[**getEdge**](#getedge) | **GET** /edge/{id} | |
|[**getEdges**](#getedges) | **GET** /edge/batch | |
|[**patchEdge**](#patchedge) | **PATCH** /edge/{id} | |
|[**patchEdges**](#patchedges) | **PATCH** /edge/batch | |

# **addEdge**
> EdgeAddResponse addEdge(edgeAddInput)


### Example

```typescript
import {
    EdgeApi,
    Configuration,
    EdgeAddInput
} from './api';

const configuration = new Configuration();
const apiInstance = new EdgeApi(configuration);

let edgeAddInput: EdgeAddInput; //

const { status, data } = await apiInstance.addEdge(
    edgeAddInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **edgeAddInput** | **EdgeAddInput**|  | |


### Return type

**EdgeAddResponse**

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

# **addEdges**
> BatchEdgeAddResponse addEdges(batchEdgeAddInput)


### Example

```typescript
import {
    EdgeApi,
    Configuration,
    BatchEdgeAddInput
} from './api';

const configuration = new Configuration();
const apiInstance = new EdgeApi(configuration);

let batchEdgeAddInput: BatchEdgeAddInput; //

const { status, data } = await apiInstance.addEdges(
    batchEdgeAddInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchEdgeAddInput** | **BatchEdgeAddInput**|  | |


### Return type

**BatchEdgeAddResponse**

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

# **deleteEdge**
> EdgeDeleteResponse deleteEdge()


### Example

```typescript
import {
    EdgeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EdgeApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteEdge(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**EdgeDeleteResponse**

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

# **deleteEdges**
> EdgeDeleteResponse deleteEdges(batchEdgeDeleteInput)


### Example

```typescript
import {
    EdgeApi,
    Configuration,
    BatchEdgeDeleteInput
} from './api';

const configuration = new Configuration();
const apiInstance = new EdgeApi(configuration);

let batchEdgeDeleteInput: BatchEdgeDeleteInput; //

const { status, data } = await apiInstance.deleteEdges(
    batchEdgeDeleteInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchEdgeDeleteInput** | **BatchEdgeDeleteInput**|  | |


### Return type

**EdgeDeleteResponse**

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

# **getEdge**
> EdgeEntity getEdge()


### Example

```typescript
import {
    EdgeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EdgeApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getEdge(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**EdgeEntity**

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

# **getEdges**
> Array<EdgeEntity> getEdges()


### Example

```typescript
import {
    EdgeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EdgeApi(configuration);

let id: Array<string>; // (default to undefined)

const { status, data } = await apiInstance.getEdges(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | **Array&lt;string&gt;** |  | defaults to undefined|


### Return type

**Array<EdgeEntity>**

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

# **patchEdge**
> EdgeEntity patchEdge(edgePatchInput)


### Example

```typescript
import {
    EdgeApi,
    Configuration,
    EdgePatchInput
} from './api';

const configuration = new Configuration();
const apiInstance = new EdgeApi(configuration);

let id: number; // (default to undefined)
let edgePatchInput: EdgePatchInput; //

const { status, data } = await apiInstance.patchEdge(
    id,
    edgePatchInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **edgePatchInput** | **EdgePatchInput**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**EdgeEntity**

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

# **patchEdges**
> Array<EdgeEntity> patchEdges(batchEdgePatchInput)


### Example

```typescript
import {
    EdgeApi,
    Configuration,
    BatchEdgePatchInput
} from './api';

const configuration = new Configuration();
const apiInstance = new EdgeApi(configuration);

let batchEdgePatchInput: BatchEdgePatchInput; //

const { status, data } = await apiInstance.patchEdges(
    batchEdgePatchInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchEdgePatchInput** | **BatchEdgePatchInput**|  | |


### Return type

**Array<EdgeEntity>**

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

