/**
 * Credential service for managing credentials
 * @module services/credential
 */

import { BaseService } from "./base.service";
import type {
  CredentialID,
  CredentialSummary,
  CredentialWithDataResponse,
  CreateCredentialRequest,
  UpdateCredentialRequest,
  CredentialTestResponse,
  CredentialListResponse,
  ListCredentialsParams,
  ShareCredentialRequest,
  ShareCredentialResponse,
  SuccessResponse,
  CredentialTypeMetadata,
} from "../types";

/**
 * Service for managing credentials
 *
 * Provides methods for creating, updating, testing, and managing credentials
 *
 * **IMPORTANT:** Credentials are encrypted at rest. Use `getDecrypted()` to access
 * sensitive credential data. Requires `credentials:decrypt` scope.
 *
 * @example
 * ```ts
 * const credential = await client.credentials.create({
 *   name: 'Stripe API Key',
 *   description: 'Production Stripe key',
 *   type: 'API_KEY',
 *   data: {
 *     api_key: 'sk_live_...',
 *     header_name: 'Authorization'
 *   }
 * });
 * ```
 */
export class CredentialService extends BaseService {
  protected readonly basePath = "/credentials";

  /**
   * Create a new credential
   *
   * The credential data will be encrypted before storage.
   *
   * @param request - Credential creation request
   * @returns Promise resolving to the created credential (without decrypted data)
   *
   * @throws {ValidationError} When the credential data is invalid
   * @throws {AuthorizationError} When the user lacks `credentials:write` scope
   *
   * @example
   * ```ts
   * // Create an API key credential
   * const credential = await client.credentials.create({
   *   name: 'My API Key',
   *   description: 'Third-party API key',
   *   type: 'API_KEY',
   *   data: {
   *     api_key: 'abc123...',
   *     header_name: 'X-API-Key'
   *   },
   *   tags: ['production', 'api']
   * });
   *
   * // Create an OAuth2 credential
   * const oauth = await client.credentials.create({
   *   name: 'Google OAuth',
   *   type: 'OAUTH2',
   *   data: {
   *     client_id: 'client-id',
   *     client_secret: 'client-secret',
   *     access_token: 'access-token',
   *     refresh_token: 'refresh-token'
   *   }
   * });
   * ```
   */
  async create(request: CreateCredentialRequest): Promise<CredentialSummary> {
    return this.client.post<CredentialSummary>(this.buildPath(""), request);
  }

  /**
   * List credentials with optional filtering and pagination
   *
   * Returns credentials without decrypted data. Use `getDecrypted()` for sensitive data.
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated list of credentials
   *
   * @throws {AuthorizationError} When the user lacks `credentials:read` scope
   *
   * @example
   * ```ts
   * const credentials = await client.credentials.list({
   *   page: 1,
   *   page_size: 20,
   *   type: 'API_KEY',
   *   is_active: true,
   *   tags: ['production']
   * });
   * ```
   */
  async list(params?: ListCredentialsParams): Promise<CredentialListResponse> {
    return this.client.get<CredentialListResponse>(this.buildPath(""), params);
  }

  /**
   * Get a credential by ID (encrypted)
   *
   * Returns the credential without decrypted data. Use `getDecrypted()` for sensitive data.
   *
   * @param id - Credential ID
   * @returns Promise resolving to the credential
   *
   * @throws {NotFoundError} When the credential doesn't exist
   * @throws {AuthorizationError} When the user lacks `credentials:read` scope
   *
   * @example
   * ```ts
   * const credential = await client.credentials.get('cred-123');
   * console.log(credential.name, credential.type);
   * // Sensitive data is NOT included
   * ```
   */
  async get(id: CredentialID): Promise<CredentialSummary> {
    return this.client.get<CredentialSummary>(this.buildPath(`/${id}`));
  }

  /**
   * Get a credential by ID with decrypted data
   *
   * **WARNING:** This endpoint returns sensitive credential data in plain text.
   * Requires `credentials:decrypt` scope.
   *
   * @param id - Credential ID
   * @param autoRefresh - Whether to auto-refresh OAuth tokens if expired
   * @returns Promise resolving to the credential with decrypted data
   *
   * @throws {NotFoundError} When the credential doesn't exist
   * @throws {AuthorizationError} When the user lacks `credentials:decrypt` scope
   *
   * @example
   * ```ts
   * const { credential } = await client.credentials.getDecrypted('cred-123');
   * console.log('API Key:', credential.data.api_key);
   *
   * // Auto-refresh OAuth token if expired
   * const { credential: oauth } = await client.credentials.getDecrypted(
   *   'oauth-cred-123',
   *   true
   * );
   * ```
   */
  async getDecrypted(
    id: CredentialID,
    autoRefresh?: boolean,
  ): Promise<CredentialWithDataResponse> {
    return this.client.get<CredentialWithDataResponse>(
      this.buildPath(`/${id}/decrypted`),
      autoRefresh !== undefined ? { auto_refresh: autoRefresh } : undefined,
    );
  }

  /**
   * Update a credential
   *
   * @param id - Credential ID
   * @param request - Credential update request
   * @returns Promise resolving to the updated credential
   *
   * @throws {NotFoundError} When the credential doesn't exist
   * @throws {ValidationError} When the update data is invalid
   * @throws {AuthorizationError} When the user lacks `credentials:write` scope
   *
   * @example
   * ```ts
   * const updated = await client.credentials.update('cred-123', {
   *   description: 'Updated description',
   *   tags: ['production', 'updated']
   * });
   *
   * // Update credential data (will be re-encrypted)
   * await client.credentials.update('cred-123', {
   *   data: {
   *     api_key: 'new-key-value'
   *   }
   * });
   * ```
   */
  async update(
    id: CredentialID,
    request: UpdateCredentialRequest,
  ): Promise<CredentialSummary> {
    return this.client.put<CredentialSummary>(
      this.buildPath(`/${id}`),
      request,
    );
  }

  /**
   * Delete a credential
   *
   * @param id - Credential ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the credential doesn't exist
   * @throws {AuthorizationError} When the user lacks `credentials:delete` scope
   *
   * @example
   * ```ts
   * await client.credentials.delete('cred-123');
   * ```
   */
  async delete(id: CredentialID): Promise<SuccessResponse> {
    return this.client.delete<SuccessResponse>(this.buildPath(`/${id}`));
  }

  /**
   * Activate a credential
   *
   * @param id - Credential ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the credential doesn't exist
   * @throws {AuthorizationError} When the user lacks `credentials:write` scope
   *
   * @example
   * ```ts
   * await client.credentials.activate('cred-123');
   * ```
   */
  async activate(id: CredentialID): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(this.buildPath(`/${id}/activate`));
  }

  /**
   * Deactivate a credential
   *
   * @param id - Credential ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the credential doesn't exist
   * @throws {AuthorizationError} When the user lacks `credentials:write` scope
   *
   * @example
   * ```ts
   * await client.credentials.deactivate('cred-123');
   * ```
   */
  async deactivate(id: CredentialID): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(
      this.buildPath(`/${id}/deactivate`),
    );
  }

  /**
   * Share or unshare a credential
   *
   * @param id - Credential ID
   * @param request - Share configuration
   * @returns Promise resolving to share response
   *
   * @throws {NotFoundError} When the credential doesn't exist
   * @throws {AuthorizationError} When the user lacks `credentials:share` scope
   *
   * @example
   * ```ts
   * // Share credential with specific users
   * await client.credentials.share('cred-123', {
   *   is_shared: true,
   *   user_ids: ['user-1', 'user-2']
   * });
   *
   * // Unshare credential
   * await client.credentials.share('cred-123', {
   *   is_shared: false
   * });
   * ```
   */
  async share(
    id: CredentialID,
    request: ShareCredentialRequest,
  ): Promise<ShareCredentialResponse> {
    return this.client.put<ShareCredentialResponse>(
      this.buildPath(`/${id}/share`),
      request,
    );
  }

  /**
   * Test a credential
   *
   * Attempts to use the credential to verify it's valid and working.
   *
   * @param id - Credential ID
   * @param testType - Type of test to perform (optional)
   * @returns Promise resolving to test response
   *
   * @throws {NotFoundError} When the credential doesn't exist
   * @throws {AuthorizationError} When the user lacks `credentials:test` scope
   *
   * @example
   * ```ts
   * const result = await client.credentials.test('cred-123');
   * if (result.success) {
   *   console.log('Credential is valid');
   * } else {
   *   console.error('Test failed:', result.message);
   * }
   * ```
   */
  async test(
    id: CredentialID,
    testType?: string,
  ): Promise<CredentialTestResponse> {
    return this.client.post<CredentialTestResponse>(
      this.buildPath(`/${id}/test`),
      undefined,
      { query: testType ? { test_type: testType } : undefined },
    );
  }

  /**
   * Refresh an OAuth2 credential token
   *
   * Uses the refresh token to obtain a new access token.
   *
   * @param id - Credential ID
   * @returns Promise resolving to success response with new token data
   *
   * @throws {NotFoundError} When the credential doesn't exist
   * @throws {ValidationError} When the credential is not OAuth2 or lacks refresh token
   * @throws {AuthorizationError} When the user lacks `credentials:write` scope
   *
   * @example
   * ```ts
   * const result = await client.credentials.refresh('oauth-cred-123');
   * console.log('Token refreshed:', result.message);
   * ```
   */
  async refresh(id: CredentialID): Promise<{ message: string; data: object }> {
    return this.client.post<{ message: string; data: object }>(
      this.buildPath(`/${id}/refresh`),
    );
  }

  /**
   * Get available credential types and their schemas
   *
   * @returns Promise resolving to array of credential type metadata
   *
   * @example
   * ```ts
   * const credentialTypes = await client.credentials.getCredentialTypes();
   * credentialTypes.forEach(type => {
   *   console.log(`${type.name}: ${type.description}`);
   * });
   * ```
   */
  async getCredentialTypes(): Promise<CredentialTypeMetadata[]> {
    return this.client.get<CredentialTypeMetadata[]>(
      this.buildAbsolutePath("/api/credentials/types"),
    );
  }
}
