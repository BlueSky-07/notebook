# FileApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**clearNoReferencesFiles**](#clearnoreferencesfiles) | **DELETE** /file/admin/clear-no-references | |
|[**deleteFile**](#deletefile) | **DELETE** /file | |
|[**getFileInfo**](#getfileinfo) | **GET** /file/info | |
|[**getFileObject**](#getfileobject) | **GET** /file/object | |
|[**uploadFileObject**](#uploadfileobject) | **POST** /file | |

# **clearNoReferencesFiles**
> FileAdminClearNoReferencesResponse clearNoReferencesFiles(fileAdminClearNoReferencesInput)


### Example

```typescript
import {
    FileApi,
    Configuration,
    FileAdminClearNoReferencesInput
} from './api';

const configuration = new Configuration();
const apiInstance = new FileApi(configuration);

let fileAdminClearNoReferencesInput: FileAdminClearNoReferencesInput; //

const { status, data } = await apiInstance.clearNoReferencesFiles(
    fileAdminClearNoReferencesInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fileAdminClearNoReferencesInput** | **FileAdminClearNoReferencesInput**|  | |


### Return type

**FileAdminClearNoReferencesResponse**

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

# **deleteFile**
> FileDeleteResponse deleteFile(fileQueryInput)


### Example

```typescript
import {
    FileApi,
    Configuration,
    FileQueryInput
} from './api';

const configuration = new Configuration();
const apiInstance = new FileApi(configuration);

let fileQueryInput: FileQueryInput; //

const { status, data } = await apiInstance.deleteFile(
    fileQueryInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fileQueryInput** | **FileQueryInput**|  | |


### Return type

**FileDeleteResponse**

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

# **getFileInfo**
> FileEntity getFileInfo()


### Example

```typescript
import {
    FileApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileApi(configuration);

let id: number; // (optional) (default to undefined)
let path: string; // (optional) (default to '')

const { status, data } = await apiInstance.getFileInfo(
    id,
    path
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | (optional) defaults to undefined|
| **path** | [**string**] |  | (optional) defaults to ''|


### Return type

**FileEntity**

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

# **getFileObject**
> getFileObject()


### Example

```typescript
import {
    FileApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileApi(configuration);

let id: number; // (optional) (default to undefined)
let path: string; // (optional) (default to '')

const { status, data } = await apiInstance.getFileObject(
    id,
    path
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | (optional) defaults to undefined|
| **path** | [**string**] |  | (optional) defaults to ''|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadFileObject**
> FileEntity uploadFileObject()


### Example

```typescript
import {
    FileApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileApi(configuration);

let file: File; // (default to undefined)
let name: string; //filename (optional) (default to '')
let description: string; // (optional) (default to '')

const { status, data } = await apiInstance.uploadFileObject(
    file,
    name,
    description
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **file** | [**File**] |  | defaults to undefined|
| **name** | [**string**] | filename | (optional) defaults to ''|
| **description** | [**string**] |  | (optional) defaults to ''|


### Return type

**FileEntity**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

