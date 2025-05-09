/* tslint:disable */
/* eslint-disable */
/**
 * Notebook Server
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, type RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import type { AdminDeleteEdgeByNodeIdInput } from '../models';
// @ts-ignore
import type { AdminDeleteEdgeByNodeIdResponse } from '../models';
// @ts-ignore
import type { BatchEdgeAddInput } from '../models';
// @ts-ignore
import type { BatchEdgeAddResponse } from '../models';
// @ts-ignore
import type { BatchEdgeDeleteInput } from '../models';
// @ts-ignore
import type { BatchEdgePatchInput } from '../models';
// @ts-ignore
import type { EdgeAddInput } from '../models';
// @ts-ignore
import type { EdgeAddResponse } from '../models';
// @ts-ignore
import type { EdgeDeleteResponse } from '../models';
// @ts-ignore
import type { EdgeEntity } from '../models';
// @ts-ignore
import type { EdgePatchInput } from '../models';
/**
 * EdgeApi - axios parameter creator
 * @export
 */
export const EdgeApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {EdgeAddInput} edgeAddInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addEdge: async (edgeAddInput: EdgeAddInput, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'edgeAddInput' is not null or undefined
            assertParamExists('addEdge', 'edgeAddInput', edgeAddInput)
            const localVarPath = `/edge`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(edgeAddInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {BatchEdgeAddInput} batchEdgeAddInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addEdges: async (batchEdgeAddInput: BatchEdgeAddInput, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'batchEdgeAddInput' is not null or undefined
            assertParamExists('addEdges', 'batchEdgeAddInput', batchEdgeAddInput)
            const localVarPath = `/edge/batch`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(batchEdgeAddInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteEdge: async (id: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteEdge', 'id', id)
            const localVarPath = `/edge/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {BatchEdgeDeleteInput} batchEdgeDeleteInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteEdges: async (batchEdgeDeleteInput: BatchEdgeDeleteInput, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'batchEdgeDeleteInput' is not null or undefined
            assertParamExists('deleteEdges', 'batchEdgeDeleteInput', batchEdgeDeleteInput)
            const localVarPath = `/edge/batch`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(batchEdgeDeleteInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {AdminDeleteEdgeByNodeIdInput} adminDeleteEdgeByNodeIdInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteEdgesByNodeId: async (adminDeleteEdgeByNodeIdInput: AdminDeleteEdgeByNodeIdInput, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'adminDeleteEdgeByNodeIdInput' is not null or undefined
            assertParamExists('deleteEdgesByNodeId', 'adminDeleteEdgeByNodeIdInput', adminDeleteEdgeByNodeIdInput)
            const localVarPath = `/edge/admin/delete-by-node-id`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(adminDeleteEdgeByNodeIdInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEdge: async (id: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getEdge', 'id', id)
            const localVarPath = `/edge/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {Array<string>} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEdges: async (id: Array<string>, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getEdges', 'id', id)
            const localVarPath = `/edge/batch`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} id 
         * @param {EdgePatchInput} edgePatchInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patchEdge: async (id: number, edgePatchInput: EdgePatchInput, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('patchEdge', 'id', id)
            // verify required parameter 'edgePatchInput' is not null or undefined
            assertParamExists('patchEdge', 'edgePatchInput', edgePatchInput)
            const localVarPath = `/edge/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PATCH', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(edgePatchInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {BatchEdgePatchInput} batchEdgePatchInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patchEdges: async (batchEdgePatchInput: BatchEdgePatchInput, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'batchEdgePatchInput' is not null or undefined
            assertParamExists('patchEdges', 'batchEdgePatchInput', batchEdgePatchInput)
            const localVarPath = `/edge/batch`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PATCH', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(batchEdgePatchInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * EdgeApi - functional programming interface
 * @export
 */
export const EdgeApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = EdgeApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {EdgeAddInput} edgeAddInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addEdge(edgeAddInput: EdgeAddInput, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<EdgeAddResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.addEdge(edgeAddInput, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['EdgeApi.addEdge']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {BatchEdgeAddInput} batchEdgeAddInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addEdges(batchEdgeAddInput: BatchEdgeAddInput, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BatchEdgeAddResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.addEdges(batchEdgeAddInput, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['EdgeApi.addEdges']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteEdge(id: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<EdgeDeleteResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteEdge(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['EdgeApi.deleteEdge']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {BatchEdgeDeleteInput} batchEdgeDeleteInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteEdges(batchEdgeDeleteInput: BatchEdgeDeleteInput, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<EdgeDeleteResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteEdges(batchEdgeDeleteInput, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['EdgeApi.deleteEdges']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {AdminDeleteEdgeByNodeIdInput} adminDeleteEdgeByNodeIdInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteEdgesByNodeId(adminDeleteEdgeByNodeIdInput: AdminDeleteEdgeByNodeIdInput, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AdminDeleteEdgeByNodeIdResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteEdgesByNodeId(adminDeleteEdgeByNodeIdInput, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['EdgeApi.deleteEdgesByNodeId']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getEdge(id: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<EdgeEntity>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getEdge(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['EdgeApi.getEdge']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {Array<string>} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getEdges(id: Array<string>, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<EdgeEntity>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getEdges(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['EdgeApi.getEdges']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {number} id 
         * @param {EdgePatchInput} edgePatchInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async patchEdge(id: number, edgePatchInput: EdgePatchInput, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<EdgeEntity>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.patchEdge(id, edgePatchInput, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['EdgeApi.patchEdge']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {BatchEdgePatchInput} batchEdgePatchInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async patchEdges(batchEdgePatchInput: BatchEdgePatchInput, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<EdgeEntity>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.patchEdges(batchEdgePatchInput, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['EdgeApi.patchEdges']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * EdgeApi - factory interface
 * @export
 */
export const EdgeApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = EdgeApiFp(configuration)
    return {
        /**
         * 
         * @param {EdgeAddInput} edgeAddInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addEdge(edgeAddInput: EdgeAddInput, options?: RawAxiosRequestConfig): AxiosPromise<EdgeAddResponse> {
            return localVarFp.addEdge(edgeAddInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {BatchEdgeAddInput} batchEdgeAddInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addEdges(batchEdgeAddInput: BatchEdgeAddInput, options?: RawAxiosRequestConfig): AxiosPromise<BatchEdgeAddResponse> {
            return localVarFp.addEdges(batchEdgeAddInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteEdge(id: number, options?: RawAxiosRequestConfig): AxiosPromise<EdgeDeleteResponse> {
            return localVarFp.deleteEdge(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {BatchEdgeDeleteInput} batchEdgeDeleteInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteEdges(batchEdgeDeleteInput: BatchEdgeDeleteInput, options?: RawAxiosRequestConfig): AxiosPromise<EdgeDeleteResponse> {
            return localVarFp.deleteEdges(batchEdgeDeleteInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {AdminDeleteEdgeByNodeIdInput} adminDeleteEdgeByNodeIdInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteEdgesByNodeId(adminDeleteEdgeByNodeIdInput: AdminDeleteEdgeByNodeIdInput, options?: RawAxiosRequestConfig): AxiosPromise<AdminDeleteEdgeByNodeIdResponse> {
            return localVarFp.deleteEdgesByNodeId(adminDeleteEdgeByNodeIdInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEdge(id: number, options?: RawAxiosRequestConfig): AxiosPromise<EdgeEntity> {
            return localVarFp.getEdge(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {Array<string>} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEdges(id: Array<string>, options?: RawAxiosRequestConfig): AxiosPromise<Array<EdgeEntity>> {
            return localVarFp.getEdges(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id 
         * @param {EdgePatchInput} edgePatchInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patchEdge(id: number, edgePatchInput: EdgePatchInput, options?: RawAxiosRequestConfig): AxiosPromise<EdgeEntity> {
            return localVarFp.patchEdge(id, edgePatchInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {BatchEdgePatchInput} batchEdgePatchInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patchEdges(batchEdgePatchInput: BatchEdgePatchInput, options?: RawAxiosRequestConfig): AxiosPromise<Array<EdgeEntity>> {
            return localVarFp.patchEdges(batchEdgePatchInput, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * EdgeApi - object-oriented interface
 * @export
 * @class EdgeApi
 * @extends {BaseAPI}
 */
export class EdgeApi extends BaseAPI {
    /**
     * 
     * @param {EdgeAddInput} edgeAddInput 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EdgeApi
     */
    public addEdge(edgeAddInput: EdgeAddInput, options?: RawAxiosRequestConfig) {
        return EdgeApiFp(this.configuration).addEdge(edgeAddInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {BatchEdgeAddInput} batchEdgeAddInput 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EdgeApi
     */
    public addEdges(batchEdgeAddInput: BatchEdgeAddInput, options?: RawAxiosRequestConfig) {
        return EdgeApiFp(this.configuration).addEdges(batchEdgeAddInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EdgeApi
     */
    public deleteEdge(id: number, options?: RawAxiosRequestConfig) {
        return EdgeApiFp(this.configuration).deleteEdge(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {BatchEdgeDeleteInput} batchEdgeDeleteInput 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EdgeApi
     */
    public deleteEdges(batchEdgeDeleteInput: BatchEdgeDeleteInput, options?: RawAxiosRequestConfig) {
        return EdgeApiFp(this.configuration).deleteEdges(batchEdgeDeleteInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {AdminDeleteEdgeByNodeIdInput} adminDeleteEdgeByNodeIdInput 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EdgeApi
     */
    public deleteEdgesByNodeId(adminDeleteEdgeByNodeIdInput: AdminDeleteEdgeByNodeIdInput, options?: RawAxiosRequestConfig) {
        return EdgeApiFp(this.configuration).deleteEdgesByNodeId(adminDeleteEdgeByNodeIdInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EdgeApi
     */
    public getEdge(id: number, options?: RawAxiosRequestConfig) {
        return EdgeApiFp(this.configuration).getEdge(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {Array<string>} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EdgeApi
     */
    public getEdges(id: Array<string>, options?: RawAxiosRequestConfig) {
        return EdgeApiFp(this.configuration).getEdges(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} id 
     * @param {EdgePatchInput} edgePatchInput 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EdgeApi
     */
    public patchEdge(id: number, edgePatchInput: EdgePatchInput, options?: RawAxiosRequestConfig) {
        return EdgeApiFp(this.configuration).patchEdge(id, edgePatchInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {BatchEdgePatchInput} batchEdgePatchInput 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EdgeApi
     */
    public patchEdges(batchEdgePatchInput: BatchEdgePatchInput, options?: RawAxiosRequestConfig) {
        return EdgeApiFp(this.configuration).patchEdges(batchEdgePatchInput, options).then((request) => request(this.axios, this.basePath));
    }
}

