/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export function convertTTFToWOFF2(input: Buffer, params?: Woff2Params | undefined | null): Buffer
export interface Woff2Params {
  extendedMetadata?: string
  brotliQuality?: number
  allowTransforms?: boolean
}
export function convertTTFToWOFF2Async(input: Buffer, params?: Woff2Params | undefined | null, signal?: AbortSignal | undefined | null): Promise<Buffer>
export function convertWOFF2ToTTF(input: Buffer): Buffer
export function convertWOFF2ToTTFAsync(input: Buffer, signal?: AbortSignal | undefined | null): Promise<Buffer>
