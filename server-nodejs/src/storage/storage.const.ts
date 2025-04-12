export enum STORAGE_BUCKET_NAME {
  UPLOADED = 'uploaded', // user upload files
  GENERATED = 'generated', // ai generated files
  TEMP = 'temp', // temp files
}

export type StorageBucketName = STORAGE_BUCKET_NAME;
