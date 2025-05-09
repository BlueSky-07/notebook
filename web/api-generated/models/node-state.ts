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
import type { GeneratingTaskStatusEnum } from './generating-task-status-enum';

/**
 * 
 * @export
 * @interface NodeState
 */
export interface NodeState {
    /**
     * AI generating task id
     * @type {number}
     * @memberof NodeState
     */
    'generatingTaskId'?: number;
    /**
     * AI generating task status
     * @type {GeneratingTaskStatusEnum}
     * @memberof NodeState
     */
    'generatingTaskStatus'?: GeneratingTaskStatusEnum;
}



