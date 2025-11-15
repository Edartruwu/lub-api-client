/**
 * API Key service for managing API keys
 * @module services/api-key
 */

import { BaseService } from "./base.service";
import type {
  APIKeyID,
  APIKeyDTO,
  CreateAPIKeyRequest,
  CreateAPIKeyResponse,
  UpdateAPIKeyRequest,
  APIKeyListResponse,
  SuccessResponse,
} from "../types";

/**
 * Service for managing API keys
 *
 * API keys are used to authenticate requests to the Relay API. Each key has
 * specific scopes that determine what operations it can perform.
 *
 * **IMPORTANT:** The secret key is only shown once when creating a new API key.
 * Store it securely as it cannot be retrieved later.
 *
 * @example
 * ```ts
 * const { api_key, secret_key } = await client.apiKeys.create({
 *   name: 'Production Key',
 *   scopes: ['workflows:execute', 'tools:read'],
 *   environment: 'live'
 * });
 *
 * // Store secret_key securely - it won't be shown again!
 * console.log('Secret key:', secret_key);
 * ```
 */
export class APIKeyService extends BaseService {
  protected readonly basePath = "";

  /**
   * Build path for API key endpoints (not tenant-scoped)
   */
  protected buildKeyPath(path: string): string {
    return this.buildAbsolutePath(`/api-keys${path}`);
  }

  /**
   * Create a new API key
   *
   * **IMPORTANT:** The secret key is only returned once. Store it securely!
   *
   * @param request - API key creation request
   * @returns Promise resolving to the created API key with secret
   *
   * @throws {ValidationError} When the request data is invalid
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * // Create a production API key with specific scopes
   * const { api_key, secret_key, message } = await client.apiKeys.create({
   *   name: 'Production Workflows',
   *   description: 'For executing production workflows',
   *   scopes: [
   *     'workflows:execute',
   *     'workflows:read',
   *     'tools:read',
   *     'credentials:read'
   *   ],
   *   environment: 'live',
   *   expires_in: 365 // Days
   * });
   *
   * console.log(message); // "API key created successfully..."
   * // IMPORTANT: Store secret_key securely!
   * process.env.RELAY_API_KEY = secret_key;
   *
   * // Create a test API key with full access
   * const testKey = await client.apiKeys.create({
   *   name: 'Test Key',
   *   scopes: ['*'],
   *   environment: 'test'
   * });
   * ```
   */
  async create(request: CreateAPIKeyRequest): Promise<CreateAPIKeyResponse> {
    return this.client.post<CreateAPIKeyResponse>(
      this.buildKeyPath(""),
      request,
    );
  }

  /**
   * List all API keys for the tenant
   *
   * Returns API keys without secret values. Secret keys are only shown once when created.
   *
   * @returns Promise resolving to paginated list of API keys
   *
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * const { data, total } = await client.apiKeys.list();
   * data.forEach(key => {
   *   console.log(`${key.name} (${key.key_prefix}...)`);
   *   console.log(`  Scopes: ${key.scopes.join(', ')}`);
   *   console.log(`  Active: ${key.is_active}`);
   * });
   * ```
   */
  async list(): Promise<APIKeyListResponse> {
    return this.client.get<APIKeyListResponse>(this.buildKeyPath(""));
  }

  /**
   * Get an API key by ID
   *
   * Returns the API key without the secret value.
   *
   * @param id - API key ID
   * @returns Promise resolving to the API key
   *
   * @throws {NotFoundError} When the API key doesn't exist
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * const apiKey = await client.apiKeys.get('key-123');
   * console.log('Key prefix:', apiKey.key_prefix);
   * console.log('Scopes:', apiKey.scopes);
   * ```
   */
  async get(id: APIKeyID): Promise<APIKeyDTO> {
    return this.client.get<APIKeyDTO>(this.buildKeyPath(`/${id}`));
  }

  /**
   * Update an API key
   *
   * You can update the name, description, scopes, and expiration.
   * You cannot update the secret key - create a new key instead.
   *
   * @param id - API key ID
   * @param request - API key update request
   * @returns Promise resolving to the updated API key
   *
   * @throws {NotFoundError} When the API key doesn't exist
   * @throws {ValidationError} When the update data is invalid
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * // Add more scopes to an existing key
   * const updated = await client.apiKeys.update('key-123', {
   *   scopes: [
   *     'workflows:execute',
   *     'workflows:read',
   *     'channels:read',
   *     'messages:send' // New scope
   *   ]
   * });
   *
   * // Update description
   * await client.apiKeys.update('key-123', {
   *   description: 'Updated description'
   * });
   * ```
   */
  async update(id: APIKeyID, request: UpdateAPIKeyRequest): Promise<APIKeyDTO> {
    return this.client.put<APIKeyDTO>(this.buildKeyPath(`/${id}`), request);
  }

  /**
   * Revoke an API key
   *
   * Revoked keys cannot be reactivated. Create a new key instead.
   *
   * @param id - API key ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the API key doesn't exist
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * await client.apiKeys.revoke('key-123');
   * console.log('API key revoked successfully');
   * ```
   */
  async revoke(id: APIKeyID): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(
      this.buildKeyPath(`/${id}/revoke`),
    );
  }

  /**
   * Delete an API key
   *
   * Permanently deletes the API key. This action cannot be undone.
   *
   * @param id - API key ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the API key doesn't exist
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * await client.apiKeys.delete('key-123');
   * ```
   */
  async delete(id: APIKeyID): Promise<SuccessResponse> {
    return this.client.delete<SuccessResponse>(this.buildKeyPath(`/${id}`));
  }
}
