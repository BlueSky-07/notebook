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
 * AI generating task status
 * @export
 * @enum {string}
 */

export const GeneratingTaskStatusEnum = {
    Pending: 'Pending',
    Generating: 'Generating',
    Done: 'Done',
    Failed: 'Failed',
    Stopped: 'Stopped'
} as const;

export type GeneratingTaskStatusEnum = typeof GeneratingTaskStatusEnum[keyof typeof GeneratingTaskStatusEnum];



