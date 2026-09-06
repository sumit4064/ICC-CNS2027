/**
 * @file b2StorageService.js
 * @description Reusable Backblaze B2 cloud storage abstraction service using the AWS S3-compatible SDK.
 * This service provides storage primitives (upload, metadata lookup, delete) for persistent cloud object management.
 *
 * Note: This module is the storage abstraction layer.
 * Production upload handlers can consume these methods to persist files to Backblaze B2.
 */

import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Helper to clean environment variable strings (trims whitespace and removes wrapping quotes).
 *
 * @param {string|undefined} val
 * @returns {string}
 */
const cleanEnv = (val) => (val || '').trim().replace(/^["']|["']$/g, '');

const getB2Config = () => ({
  endpoint: cleanEnv(process.env.B2_ENDPOINT),
  region: cleanEnv(process.env.B2_REGION) || 'us-east-005',
  bucketName: cleanEnv(process.env.B2_BUCKET_NAME),
  keyId: cleanEnv(process.env.B2_KEY_ID),
  applicationKey: cleanEnv(process.env.B2_APPLICATION_KEY)
});

/**
 * Checks whether all required Backblaze B2 environment variables are configured.
 * Does not expose or print any credential values.
 *
 * @returns {boolean} True if all necessary credentials and endpoint variables are present.
 */
export const isB2Configured = () => {
  const config = getB2Config();
  return Boolean(
    config.endpoint &&
    config.region &&
    config.bucketName &&
    config.keyId &&
    config.applicationKey
  );
};

// Singleton S3 client instance
let s3ClientInstance = null;

/**
 * Initializes or retrieves the singleton S3Client instance for Backblaze B2.
 *
 * @returns {S3Client} An active AWS S3Client instance pointing to Backblaze B2.
 * @throws {Error} If required environment configuration is missing.
 */
export const getB2Client = () => {
  if (s3ClientInstance) {
    return s3ClientInstance;
  }

  const config = getB2Config();
  if (!isB2Configured()) {
    throw new Error(
      '[B2StorageService] Missing required Backblaze B2 environment configuration (B2_ENDPOINT, B2_REGION, B2_BUCKET_NAME, B2_KEY_ID, B2_APPLICATION_KEY).'
    );
  }

  let formattedEndpoint = config.endpoint;
  if (!formattedEndpoint.startsWith('http://') && !formattedEndpoint.startsWith('https://')) {
    formattedEndpoint = `https://${formattedEndpoint}`;
  }

  s3ClientInstance = new S3Client({
    endpoint: formattedEndpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.keyId,
      secretAccessKey: config.applicationKey
    }
  });

  return s3ClientInstance;
};

/**
 * Uploads a file buffer directly to Backblaze B2 storage.
 *
 * @param {Object} params
 * @param {string} params.key - Unique destination object key (e.g. 'speakers/sp-101-avatar.webp')
 * @param {Buffer|Uint8Array|Blob|string} params.buffer - Raw binary data buffer of the file
 * @param {string} [params.contentType='application/octet-stream'] - MIME type of the uploaded file
 * @param {Object} [params.metadata={}] - Optional key-value user metadata
 * @param {string} [params.bucket=B2_BUCKET_NAME] - Optional bucket override
 * @returns {Promise<{ key: string, bucket: string, eTag?: string, contentLength?: number }>}
 */
export const uploadObject = async ({
  key,
  buffer,
  contentType = 'application/octet-stream',
  metadata = {},
  bucket
}) => {
  if (!key) {
    throw new Error('[B2StorageService] Object key is required for upload.');
  }
  if (!buffer) {
    throw new Error('[B2StorageService] File buffer is required for upload.');
  }

  const client = getB2Client();
  const targetBucket = bucket || getB2Config().bucketName;

  const command = new PutObjectCommand({
    Bucket: targetBucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    Metadata: metadata
  });

  const response = await client.send(command);

  return {
    key,
    bucket: targetBucket,
    eTag: response.ETag,
    contentLength: Buffer.isBuffer(buffer) ? buffer.length : undefined
  };
};

/**
 * Retrieves metadata for an object in Backblaze B2 without downloading its content.
 *
 * @param {Object} params
 * @param {string} params.key - S3 object key to inspect
 * @param {string} [params.bucket] - Optional bucket override
 * @returns {Promise<{ key: string, bucket: string, contentLength: number, contentType: string, lastModified: Date, metadata: Object }>}
 */
export const getObjectMetadata = async ({ key, bucket }) => {
  if (!key) {
    throw new Error('[B2StorageService] Object key is required to fetch metadata.');
  }

  const client = getB2Client();
  const targetBucket = bucket || getB2Config().bucketName;

  const command = new HeadObjectCommand({
    Bucket: targetBucket,
    Key: key
  });

  const response = await client.send(command);

  return {
    key,
    bucket: targetBucket,
    contentLength: response.ContentLength,
    contentType: response.ContentType,
    lastModified: response.LastModified,
    metadata: response.Metadata || {}
  };
};

/**
 * Deletes a specific object from Backblaze B2 storage.
 *
 * @param {Object} params
 * @param {string} params.key - S3 object key to delete
 * @param {string} [params.bucket] - Optional bucket override
 * @returns {Promise<{ success: boolean, key: string, bucket: string }>}
 */
export const deleteObject = async ({ key, bucket }) => {
  if (!key) {
    throw new Error('[B2StorageService] Object key is required for deletion.');
  }

  const client = getB2Client();
  const targetBucket = bucket || getB2Config().bucketName;

  const command = new DeleteObjectCommand({
    Bucket: targetBucket,
    Key: key
  });

  await client.send(command);

  return {
    success: true,
    key,
    bucket: targetBucket
  };
};

/**
 * Generates a short-lived presigned GET URL for secure, temporary file download.
 *
 * @param {Object} params
 * @param {string} params.key - S3 object key
 * @param {number} [params.expiresIn=300] - Validity in seconds (default: 300 = 5 minutes)
 * @param {string} [params.bucket] - Optional bucket override
 * @returns {Promise<string>} Short-lived presigned download URL
 */
export const getPresignedDownloadUrl = async ({
  key,
  expiresIn = 300,
  bucket
}) => {
  if (!key) {
    throw new Error('[B2StorageService] Object key is required to generate presigned download URL.');
  }

  const client = getB2Client();
  const targetBucket = bucket || getB2Config().bucketName;

  const command = new GetObjectCommand({
    Bucket: targetBucket,
    Key: key
  });

  return await getSignedUrl(client, command, { expiresIn });
};

export default {
  isB2Configured,
  getB2Client,
  uploadObject,
  getObjectMetadata,
  deleteObject,
  getPresignedDownloadUrl
};

