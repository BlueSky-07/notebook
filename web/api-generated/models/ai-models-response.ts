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


// May contain unused imports in some cases
// @ts-ignore
import type { AiModelInfo } from './ai-model-info';

/**
 * 
 * @export
 * @interface AiModelsResponse
 */
export interface AiModelsResponse {
    /**
     * 
     * @type {boolean}
     * @memberof AiModelsResponse
     */
    'enabled': boolean;
    /**
     * 
     * @type {Array<AiModelInfo>}
     * @memberof AiModelsResponse
     */
    'models': Array<AiModelInfo>;
}

