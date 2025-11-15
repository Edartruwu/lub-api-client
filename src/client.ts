/**
 * Main Relay API Client
 * @module client
 */

import { HTTPClient } from "./client/http-client";
import type { HTTPClientConfig } from "./client/http-client";
import { WorkflowService } from "./services/workflow.service";
import { ToolService } from "./services/tool.service";
import { CredentialService } from "./services/credential.service";
import { ChannelService } from "./services/channel.service";
import { APIKeyService } from "./services/api-key.service";
import { InvitationService } from "./services/invitation.service";
import { WebhookService } from "./services/webhook.service";
import type { TenantID } from "./types";

/**
 * Relay API client configuration
 */
export interface RelayClientConfig {
  /**
   * API key for authentication
   *
   * You can create API keys through the Relay dashboard or API.
   * The API key should have the necessary scopes for the operations you want to perform.
   *
   * Format: `relay_live_xxx...` or `relay_test_xxx...`
   */
  apiKey: string;

  /**
   * Tenant ID
   *
   * All API requests are scoped to a specific tenant.
   */
  tenantId: TenantID;

  /**
   * Base URL for the Relay API
   *
   * @default 'https://api.relay.com'
   */
  baseURL?: string;

  /**
   * Request timeout in milliseconds
   *
   * @default 30000
   */
  timeout?: number;

  /**
   * Custom headers to include in all requests
   */
  headers?: Record<string, string>;

  /**
   * Request interceptor
   *
   * Called before each request is sent
   */
  onRequest?: (url: string, options: RequestInit) => void | Promise<void>;

  /**
   * Response interceptor
   *
   * Called after each response is received (before error handling)
   */
  onResponse?: (response: Response) => void | Promise<void>;

  /**
   * Error interceptor
   *
   * Called when a request fails
   */
  onError?: (error: Error) => void | Promise<void>;
}

/**
 * Main Relay API Client
 *
 * Provides access to all Relay API resources through specialized service classes.
 *
 * @example
 * ```ts
 * import { RelayClient } from '@relay/api-client';
 *
 * const client = new RelayClient({
 *   apiKey: process.env.RELAY_API_KEY!,
 *   tenantId: process.env.RELAY_TENANT_ID!
 * });
 *
 * // Use the client
 * const workflows = await client.workflows.list();
 * const tools = await client.tools.list();
 * ```
 *
 * @example
 * ```ts
 * // With custom configuration
 * const client = new RelayClient({
 *   apiKey: 'relay_live_xxx...',
 *   tenantId: 'tenant-123',
 *   baseURL: 'https://api.relay.com',
 *   timeout: 60000,
 *   onRequest: (url, options) => {
 *     console.log('Making request to:', url);
 *   },
 *   onError: (error) => {
 *     console.error('Request failed:', error.message);
 *   }
 * });
 * ```
 */
export class RelayClient {
  /**
   * HTTP client instance
   */
  private readonly httpClient: HTTPClient;

  /**
   * Tenant ID
   */
  public readonly tenantId: TenantID;

  /**
   * Workflow service for managing workflows
   *
   * @example
   * ```ts
   * const workflow = await client.workflows.create({
   *   name: 'My Workflow',
   *   trigger: { type: 'WEBHOOK' },
   *   nodes: [...]
   * });
   * ```
   */
  public readonly workflows: WorkflowService;

  /**
   * Tool service for managing tools
   *
   * @example
   * ```ts
   * const tool = await client.tools.create({
   *   name: 'My Tool',
   *   type: 'HTTP',
   *   config: {...},
   *   parameters: [...]
   * });
   * ```
   */
  public readonly tools: ToolService;

  /**
   * Credential service for managing credentials
   *
   * @example
   * ```ts
   * const credential = await client.credentials.create({
   *   name: 'API Key',
   *   type: 'API_KEY',
   *   data: { api_key: 'xxx' }
   * });
   * ```
   */
  public readonly credentials: CredentialService;

  /**
   * Channel service for managing communication channels
   *
   * @example
   * ```ts
   * const channel = await client.channels.create({
   *   type: 'WHATSAPP',
   *   name: 'Support',
   *   config: {...}
   * });
   * ```
   */
  public readonly channels: ChannelService;

  /**
   * API Key service for managing API keys
   *
   * @example
   * ```ts
   * const { api_key, secret_key } = await client.apiKeys.create({
   *   name: 'Production Key',
   *   scopes: ['workflows:*'],
   *   environment: 'live'
   * });
   * ```
   */
  public readonly apiKeys: APIKeyService;

  /**
   * Invitation service for managing user invitations
   *
   * @example
   * ```ts
   * const invitation = await client.invitations.create({
   *   email: 'user@example.com',
   *   role_id: 'admin'
   * });
   * ```
   */
  public readonly invitations: InvitationService;

  /**
   * Webhook service for webhook-related operations
   *
   * @example
   * ```ts
   * const { instances } = await client.webhooks.listWaitInstances();
   * ```
   */
  public readonly webhooks: WebhookService;

  /**
   * Create a new Relay API client
   *
   * @param config - Client configuration
   *
   * @example
   * ```ts
   * const client = new RelayClient({
   *   apiKey: process.env.RELAY_API_KEY!,
   *   tenantId: process.env.RELAY_TENANT_ID!
   * });
   * ```
   */
  constructor(config: RelayClientConfig) {
    // Validate required config
    if (!config.apiKey) {
      throw new Error("API key is required");
    }
    if (!config.tenantId) {
      throw new Error("Tenant ID is required");
    }

    // Store tenant ID
    this.tenantId = config.tenantId;

    // Create HTTP client
    const httpClientConfig: HTTPClientConfig = {
      baseURL: config.baseURL ?? "https://api.relay.com",
      apiKey: config.apiKey,
      timeout: config.timeout,
      headers: config.headers,
      onRequest: config.onRequest,
      onResponse: config.onResponse,
      onError: config.onError,
    };

    this.httpClient = new HTTPClient(httpClientConfig);

    // Initialize services
    const serviceConfig = {
      client: this.httpClient,
      tenantId: this.tenantId,
    };

    this.workflows = new WorkflowService(serviceConfig);
    this.tools = new ToolService(serviceConfig);
    this.credentials = new CredentialService(serviceConfig);
    this.channels = new ChannelService(serviceConfig);
    this.apiKeys = new APIKeyService(serviceConfig);
    this.invitations = new InvitationService(serviceConfig);
    this.webhooks = new WebhookService(serviceConfig);
  }

  /**
   * Get the base URL being used
   */
  public getBaseURL(): string {
    return (this.httpClient as any).baseURL;
  }

  /**
   * Get the tenant ID being used
   */
  public getTenantId(): TenantID {
    return this.tenantId;
  }
}
