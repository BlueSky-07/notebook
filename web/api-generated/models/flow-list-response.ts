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
import type { FlowEntity } from './flow-entity';

/**
 * 
 * @export
 * @interface FlowListResponse
 */
export interface FlowListResponse {
    /**
     * 
     * @type {number}
     * @memberof FlowListResponse
     */
    'count': number;
    /**
     * 
     * @type {Array<FlowEntity>}
     * @memberof FlowListResponse
     */
    'items': Array<FlowEntity>;
}

