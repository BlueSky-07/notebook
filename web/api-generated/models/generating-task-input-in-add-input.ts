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



/**
 * 
 * @export
 * @interface GeneratingTaskInputInAddInput
 */
export interface GeneratingTaskInputInAddInput {
    /**
     * model id
     * @type {string}
     * @memberof GeneratingTaskInputInAddInput
     */
    'modelId': string;
    /**
     * generating from source nodes
     * @type {Array<number>}
     * @memberof GeneratingTaskInputInAddInput
     */
    'sourceNodeIds': Array<number>;
    /**
     * generating from source edges
     * @type {Array<number>}
     * @memberof GeneratingTaskInputInAddInput
     */
    'edgeIds': Array<number>;
}

