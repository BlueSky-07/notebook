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
 * @interface BatchNodePatchInputItem
 */
export interface BatchNodePatchInputItem {
    /**
     * 
     * @type {NodeLayout}
     * @memberof BatchNodePatchInputItem
     */
    'layout'?: NodeLayout;
    /**
     * 
     * @type {NodeData}
     * @memberof BatchNodePatchInputItem
     */
    'data'?: NodeData;
    /**
     * 
     * @type {NodeDataTypeEnum}
     * @memberof BatchNodePatchInputItem
     */
    'dataType'?: NodeDataTypeEnum;
    /**
     * 
     * @type {NodeState}
     * @memberof BatchNodePatchInputItem
     */
    'state'?: NodeState;
    /**
     * 
     * @type {number}
     * @memberof BatchNodePatchInputItem
     */
    'id': number;
}



