/**
 * Credential-related types and interfaces
 * @module types/credential
 */

import type { DateTime, TenantID, UserID, PaginatedResponse } from "./common";

/**
 * Unique identifier for a credential
 */
export type CredentialID = string;

/**
 * Credential types
 */
export enum CredentialType {
  API_KEY = "API_KEY",
  OAUTH2 = "OAUTH2",
  BASIC_AUTH = "BASIC_AUTH",
  BEARER_TOKEN = "BEARER_TOKEN",
  DATABASE = "DATABASE",
  SMTP = "SMTP",
  AWS = "AWS",
  CUSTOM = "CUSTOM",
}

/**
 * Credential (without decrypted data)
 */
export interface Credential {
  /** Unique credential identifier */
  id: CredentialID;
  /** Associated tenant ID */
  tenant_id: TenantID;
  /** User who created the credential */
  created_by: UserID;
  /** Credential name */
  name: string;
  /** Credential description */
  description: string;
  /** Type of credential */
  type: CredentialType;
  /** Encryption version used */
  encryption_version: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
  /** Associated tags */
  tags?: string[];
  /** Whether the credential is shared */
  is_shared: boolean;
  /** User IDs with access (if shared) */
  shared_with_users?: UserID[];
  /** Role IDs with access (if shared) */
  shared_with_roles?: string[];
  /** Whether the credential is active */
  is_active: boolean;
  /** Last usage timestamp */
  last_used_at?: DateTime;
  /** Number of times the credential has been used */
  usage_count: number;
  /** Creation timestamp */
  created_at: DateTime;
  /** Last update timestamp */
  updated_at: DateTime;
}

/**
 * Credential summary (without sensitive data)
 */
export interface CredentialSummary extends Credential {}

/**
 * API Key credential data
 */
export interface APIKeyData {
  /** API key value */
  api_key: string;
  /** Header name for the API key (e.g., "X-API-Key") */
  header_name?: string;
  /** Additional headers or configuration */
  extra?: Record<string, string>;
}

/**
 * OAuth2 credential data
 */
export interface OAuth2Data {
  /** OAuth2 client ID */
  client_id: string;
  /** OAuth2 client secret */
  client_secret: string;
  /** Access token */
  access_token?: string;
  /** Refresh token */
  refresh_token?: string;
  /** Token type (e.g., "Bearer") */
  token_type?: string;
  /** Token expiration timestamp */
  expires_at?: DateTime;
  /** OAuth2 scopes */
  scopes?: string[];
  /** Authorization URL */
  auth_url?: string;
  /** Token URL */
  token_url?: string;
  /** Additional OAuth2 parameters */
  extra?: Record<string, string>;
}

/**
 * Basic authentication credential data
 */
export interface BasicAuthData {
  /** Username */
  username: string;
  /** Password */
  password: string;
  /** Additional configuration */
  extra?: Record<string, string>;
}

/**
 * Bearer token credential data
 */
export interface BearerTokenData {
  /** Bearer token value */
  token: string;
  /** Token expiration timestamp */
  expires_at?: DateTime;
  /** Additional configuration */
  extra?: Record<string, string>;
}

/**
 * Database credential data
 */
export interface DatabaseData {
  /** Database type (e.g., "postgres", "mysql", "mongodb", "redis") */
  type: string;
  /** Database host */
  host: string;
  /** Database port */
  port: number;
  /** Database username */
  username: string;
  /** Database password */
  password: string;
  /** Database name */
  database: string;
  /** Whether to use SSL */
  ssl?: boolean;
  /** Additional connection parameters */
  extra?: Record<string, string>;
}

/**
 * SMTP credential data
 */
export interface SMTPData {
  /** SMTP host */
  host: string;
  /** SMTP port */
  port: number;
  /** SMTP username */
  username: string;
  /** SMTP password */
  password: string;
  /** Whether to use TLS */
  use_tls?: boolean;
  /** Sender email address */
  from_email?: string;
  /** Additional configuration */
  extra?: Record<string, string>;
}

/**
 * AWS credential data
 */
export interface AWSData {
  /** AWS access key ID */
  access_key_id: string;
  /** AWS secret access key */
  secret_access_key: string;
  /** AWS region */
  region: string;
  /** AWS session token (for temporary credentials) */
  session_token?: string;
}

/**
 * Union type for all credential data types
 */
export type CredentialData =
  | APIKeyData
  | OAuth2Data
  | BasicAuthData
  | BearerTokenData
  | DatabaseData
  | SMTPData
  | AWSData
  | Record<string, any>;

/**
 * Credential with decrypted data
 */
export interface CredentialWithData extends Credential {
  /** Decrypted credential data */
  data: CredentialData;
}

/**
 * Credential with decrypted data response
 */
export interface CredentialWithDataResponse {
  /** Credential with decrypted data */
  credential: CredentialWithData;
}

/**
 * Request to create a new credential
 */
export interface CreateCredentialRequest {
  /** Credential name */
  name: string;
  /** Credential description */
  description: string;
  /** Type of credential */
  type: CredentialType;
  /** Credential data (will be encrypted) */
  data: CredentialData;
  /** Additional metadata */
  metadata?: Record<string, any>;
  /** Associated tags */
  tags?: string[];
  /** Whether the credential should be shared */
  is_shared?: boolean;
}

/**
 * Request to update an existing credential
 */
export interface UpdateCredentialRequest {
  /** Updated credential name */
  name?: string;
  /** Updated credential description */
  description?: string;
  /** Updated credential data (will be encrypted) */
  data?: CredentialData;
  /** Updated metadata */
  metadata?: Record<string, any>;
  /** Updated tags */
  tags?: string[];
}

/**
 * Credential test response
 */
export interface CredentialTestResponse {
  /** Whether the test was successful */
  success: boolean;
  /** Test message */
  message: string;
  /** Additional test details */
  details?: Record<string, any>;
}

/**
 * Credential list response
 */
export interface CredentialListResponse
  extends PaginatedResponse<CredentialSummary> {}

/**
 * Query parameters for listing credentials
 */
export interface ListCredentialsParams {
  /** Page number */
  page?: number;
  /** Number of items per page */
  page_size?: number;
  /** Filter by credential type */
  type?: CredentialType;
  /** Filter by active status */
  is_active?: boolean;
  /** Search query */
  search?: string;
  /** Filter by tags */
  tags?: string[];
}

/**
 * Credential share request
 */
export interface ShareCredentialRequest {
  /** Whether the credential should be shared */
  is_shared: boolean;
  /** User IDs to share with (optional) */
  user_ids?: UserID[];
  /** Role IDs to share with (optional) */
  role_ids?: string[];
}

/**
 * Credential share response
 */
export interface ShareCredentialResponse {
  /** Success message */
  message: string;
  /** Whether the credential is now shared */
  shared: boolean;
}

/**
 * Credential type metadata
 */
export interface CredentialTypeMetadata {
  /** Credential type identifier */
  type: CredentialType;
  /** Display name */
  name: string;
  /** Credential type description */
  description: string;
  /** Data schema */
  schema: Record<string, any>;
  /** Example data */
  example?: Record<string, any>;
}
