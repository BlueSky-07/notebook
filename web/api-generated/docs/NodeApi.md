# NodeApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addNode**](#addnode) | **POST** /node | |
|[**addNodes**](#addnodes) | **POST** /node/batch | |
|[**deleteNode**](#deletenode) | **DELETE** /node/{id} | |
|[**deleteNodes**](#deletenodes) | **DELETE** /node/batch | |
|[**getNode**](#getnode) | **GET** /node/{id} | |
|[**getNodes**](#getnodes) | **GET** /node/batch | |
|[**patchNode**](#patchnode) | **PATCH** /node/{id} | |
|[**patchNodes**](#patchnodes) | **PATCH** /node/batch | |

# **addNode**
> NodeAddResponse addNode(nodeAddInput)


### Example

```typescript
import {
    NodeApi,
    Configuration,
    NodeAddInput
} from './api';

const configuration = new Configuration();
const apiInstance = new NodeApi(configuration);

let nodeAddInput: NodeAddInput; //

const { status, data } = await apiInstance.addNode(
    nodeAddInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **nodeAddInput** | **NodeAddInput**|  | |


### Return type

**NodeAddResponse**

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

# **addNodes**
> BatchNodeAddResponse addNodes(batchNodeAddInput)


### Example

```typescript
import {
    NodeApi,
    Configuration,
    BatchNodeAddInput
} from './api';

const configuration = new Configuration();
const apiInstance = new NodeApi(configuration);

let batchNodeAddInput: BatchNodeAddInput; //

const { status, data } = await apiInstance.addNodes(
    batchNodeAddInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchNodeAddInput** | **BatchNodeAddInput**|  | |


### Return type

**BatchNodeAddResponse**

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

# **deleteNode**
> NodeDeleteResponse deleteNode()


### Example

```typescript
import {
    NodeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NodeApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteNode(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**NodeDeleteResponse**

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

# **deleteNodes**
> NodeDeleteResponse deleteNodes(batchNodeDeleteInput)


### Example

```typescript
import {
    NodeApi,
    Configuration,
    BatchNodeDeleteInput
} from './api';

const configuration = new Configuration();
const apiInstance = new NodeApi(configuration);

let batchNodeDeleteInput: BatchNodeDeleteInput; //

const { status, data } = await apiInstance.deleteNodes(
    batchNodeDeleteInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchNodeDeleteInput** | **BatchNodeDeleteInput**|  | |


### Return type

**NodeDeleteResponse**

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

# **getNode**
> NodeEntity getNode()


### Example

```typescript
import {
    NodeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NodeApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getNode(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**NodeEntity**

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

# **getNodes**
> Array<NodeEntity> getNodes()


### Example

```typescript
import {
    NodeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NodeApi(configuration);

let id: Array<string>; // (default to undefined)

const { status, data } = await apiInstance.getNodes(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | **Array&lt;string&gt;** |  | defaults to undefined|


### Return type

**Array<NodeEntity>**

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

# **patchNode**
> NodeEntity patchNode(nodePatchInput)


### Example

```typescript
import {
    NodeApi,
    Configuration,
    NodePatchInput
} from './api';

const configuration = new Configuration();
const apiInstance = new NodeApi(configuration);

let id: number; // (default to undefined)
let nodePatchInput: NodePatchInput; //

const { status, data } = await apiInstance.patchNode(
    id,
    nodePatchInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **nodePatchInput** | **NodePatchInput**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**NodeEntity**

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

# **patchNodes**
> Array<NodeEntity> patchNodes(batchNodePatchInput)


### Example

```typescript
import {
    NodeApi,
    Configuration,
    BatchNodePatchInput
} from './api';

const configuration = new Configuration();
const apiInstance = new NodeApi(configuration);

let batchNodePatchInput: BatchNodePatchInput; //

const { status, data } = await apiInstance.patchNodes(
    batchNodePatchInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchNodePatchInput** | **BatchNodePatchInput**|  | |


### Return type

**Array<NodeEntity>**

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

