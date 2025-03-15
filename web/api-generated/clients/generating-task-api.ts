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
import type { GeneratingTaskAddInput } from '../models';
// @ts-ignore
import type { GeneratingTaskAddResponse } from '../models';
// @ts-ignore
import type { GeneratingTaskEntity } from '../models';
/**
 * GeneratingTaskApi - axios parameter creator
 * @export
 */
export const GeneratingTaskApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {GeneratingTaskAddInput} generatingTaskAddInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addGeneratingTask: async (generatingTaskAddInput: GeneratingTaskAddInput, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'generatingTaskAddInput' is not null or undefined
            assertParamExists('addGeneratingTask', 'generatingTaskAddInput', generatingTaskAddInput)
            const localVarPath = `/generating-task`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(generatingTaskAddInput, localVarRequestOptions, configuration)

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
        getGeneratingTask: async (id: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getGeneratingTask', 'id', id)
            const localVarPath = `/generating-task/{id}`
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
    }
};

/**
 * GeneratingTaskApi - functional programming interface
 * @export
 */
export const GeneratingTaskApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = GeneratingTaskApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {GeneratingTaskAddInput} generatingTaskAddInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addGeneratingTask(generatingTaskAddInput: GeneratingTaskAddInput, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GeneratingTaskAddResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.addGeneratingTask(generatingTaskAddInput, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['GeneratingTaskApi.addGeneratingTask']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getGeneratingTask(id: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GeneratingTaskEntity>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getGeneratingTask(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['GeneratingTaskApi.getGeneratingTask']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * GeneratingTaskApi - factory interface
 * @export
 */
export const GeneratingTaskApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = GeneratingTaskApiFp(configuration)
    return {
        /**
         * 
         * @param {GeneratingTaskAddInput} generatingTaskAddInput 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addGeneratingTask(generatingTaskAddInput: GeneratingTaskAddInput, options?: RawAxiosRequestConfig): AxiosPromise<GeneratingTaskAddResponse> {
            return localVarFp.addGeneratingTask(generatingTaskAddInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getGeneratingTask(id: number, options?: RawAxiosRequestConfig): AxiosPromise<GeneratingTaskEntity> {
            return localVarFp.getGeneratingTask(id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * GeneratingTaskApi - object-oriented interface
 * @export
 * @class GeneratingTaskApi
 * @extends {BaseAPI}
 */
export class GeneratingTaskApi extends BaseAPI {
    /**
     * 
     * @param {GeneratingTaskAddInput} generatingTaskAddInput 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GeneratingTaskApi
     */
    public addGeneratingTask(generatingTaskAddInput: GeneratingTaskAddInput, options?: RawAxiosRequestConfig) {
        return GeneratingTaskApiFp(this.configuration).addGeneratingTask(generatingTaskAddInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GeneratingTaskApi
     */
    public getGeneratingTask(id: number, options?: RawAxiosRequestConfig) {
        return GeneratingTaskApiFp(this.configuration).getGeneratingTask(id, options).then((request) => request(this.axios, this.basePath));
    }
}

