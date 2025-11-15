/**
 * API Key-related types and interfaces
 * @module types/api-key
 */

import type {
  DateTime,
  TenantID,
  UserID,
  PaginatedResponse,
} from "./common";
import { Environment } from "./common";

/**
 * Unique identifier for an API key
 */
export type APIKeyID = string;

/**
 * API Key (without secret)
 */
export interface APIKey {
  /** Unique API key identifier */
  id: APIKeyID;
  /** Key prefix (e.g., "relay_live_abc123...") */
  key_prefix: string;
  /** Associated tenant ID */
  tenant_id: TenantID;
  /** Associated user ID (optional) */
  user_id?: UserID;
  /** API key name */
  name: string;
  /** API key description */
  description?: string;
  /** Allowed scopes for this API key */
  scopes: string[];
  /** Whether the API key is active */
  is_active: boolean;
  /** Expiration timestamp */
  expires_at?: DateTime;
  /** Last usage timestamp */
  last_used_at?: DateTime;
  /** Creation timestamp */
  created_at: DateTime;
  /** Environment (live or test) */
  environment: Environment;
}

/**
 * API Key DTO (Data Transfer Object)
 */
export interface APIKeyDTO extends APIKey {}

/**
 * Request to create a new API key
 */
export interface CreateAPIKeyRequest {
  /** API key name */
  name: string;
  /** API key description */
  description?: string;
  /** Allowed scopes for this API key */
  scopes: string[];
  /** Days until expiration (optional) */
  expires_in?: number;
  /** Environment (live or test) */
  environment: Environment;
  /** Associated user ID (optional) */
  user_id?: UserID;
}

/**
 * Response when creating an API key (includes the secret)
 */
export interface CreateAPIKeyResponse {
  /** API key metadata */
  api_key: APIKeyDTO;
  /** Full secret key (only shown once!) */
  secret_key: string;
  /** Success message */
  message: string;
}

/**
 * Request to update an existing API key
 */
export interface UpdateAPIKeyRequest {
  /** Updated API key name */
  name?: string;
  /** Updated API key description */
  description?: string;
  /** Updated scopes */
  scopes?: string[];
  /** Updated expiration timestamp */
  expires_at?: DateTime;
}

/**
 * API Key list response
 */
export interface APIKeyListResponse extends PaginatedResponse<APIKeyDTO> {}

/**
 * Available API scopes
 */
export const API_SCOPES = {
  /** Full access to everything */
  ALL: "*",

  /** Admin scopes */
  ADMIN_ALL: "admin:*",
  ADMIN_READ: "admin:read",
  ADMIN_WRITE: "admin:write",

  /** Workflow scopes */
  WORKFLOWS_ALL: "workflows:*",
  WORKFLOWS_READ: "workflows:read",
  WORKFLOWS_WRITE: "workflows:write",
  WORKFLOWS_EXECUTE: "workflows:execute",
  WORKFLOWS_TEST: "workflows:test",
  WORKFLOWS_DELETE: "workflows:delete",

  /** Tool scopes */
  TOOLS_ALL: "tools:*",
  TOOLS_READ: "tools:read",
  TOOLS_WRITE: "tools:write",
  TOOLS_EXECUTE: "tools:execute",
  TOOLS_TEST: "tools:test",
  TOOLS_DELETE: "tools:delete",

  /** Credential scopes */
  CREDENTIALS_ALL: "credentials:*",
  CREDENTIALS_READ: "credentials:read",
  CREDENTIALS_WRITE: "credentials:write",
  CREDENTIALS_DECRYPT: "credentials:decrypt",
  CREDENTIALS_TEST: "credentials:test",
  CREDENTIALS_SHARE: "credentials:share",
  CREDENTIALS_DELETE: "credentials:delete",

  /** Channel scopes */
  CHANNELS_ALL: "channels:*",
  CHANNELS_READ: "channels:read",
  CHANNELS_WRITE: "channels:write",
  CHANNELS_TEST: "channels:test",
  CHANNELS_DELETE: "channels:delete",

  /** Message scopes */
  MESSAGES_ALL: "messages:*",
  MESSAGES_SEND: "messages:send",
  MESSAGES_READ: "messages:read",
} as const;

/**
 * Type for API scope values
 */
export type APIScope = (typeof API_SCOPES)[keyof typeof API_SCOPES];
