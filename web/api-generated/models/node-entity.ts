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
import type { NodeData } from './node-data';
// May contain unused imports in some cases
// @ts-ignore
import type { NodeDataTypeEnum } from './node-data-type-enum';
// May contain unused imports in some cases
// @ts-ignore
import type { NodeLayout } from './node-layout';
// May contain unused imports in some cases
// @ts-ignore
import type { NodeState } from './node-state';

/**
 * 
 * @export
 * @interface NodeEntity
 */
export interface NodeEntity {
    /**
     * 
     * @type {NodeDataTypeEnum}
     * @memberof NodeEntity
     */
    'dataType'?: NodeDataTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof NodeEntity
     */
    'id': number;
    /**
     * 
     * @type {number}
     * @memberof NodeEntity
     */
    'flowId': number;
    /**
     * 
     * @type {NodeLayout}
     * @memberof NodeEntity
     */
    'layout': NodeLayout;
    /**
     * 
     * @type {NodeData}
     * @memberof NodeEntity
     */
    'data': NodeData;
    /**
     * 
     * @type {NodeState}
     * @memberof NodeEntity
     */
    'state': NodeState;
    /**
     * 
     * @type {string}
     * @memberof NodeEntity
     */
    'updatedAt': string;
}



