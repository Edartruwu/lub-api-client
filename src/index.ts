/**
 * Relay API Client
 *
 * A strongly-typed TypeScript client for the Relay API.
 *
 * @packageDocumentation
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
 * // Create a workflow
 * const workflow = await client.workflows.create({
 *   name: 'My Workflow',
 *   description: 'Handles incoming messages',
 *   trigger: { type: 'WEBHOOK' },
 *   nodes: [...]
 * });
 *
 * // Execute the workflow
 * const result = await client.workflows.execute(workflow.workflow.id, {
 *   input: { message: 'Hello' }
 * });
 * ```
 */

// Main client
export { RelayClient } from "./client";
export type { RelayClientConfig } from "./client";

// Services
export { WorkflowService } from "./services/workflow.service";
export { ToolService } from "./services/tool.service";
export { CredentialService } from "./services/credential.service";
export { ChannelService } from "./services/channel.service";
export { APIKeyService } from "./services/api-key.service";
export { InvitationService } from "./services/invitation.service";
export { WebhookService } from "./services/webhook.service";

// HTTP Client and errors
export { HTTPClient } from "./client/http-client";
export type { HTTPClientConfig, RequestOptions } from "./client/http-client";
export {
  RelayError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  NetworkError,
  ServerError,
  TimeoutError,
} from "./client/errors";

// All types
export * from "./types";

// Utility functions
export { buildQueryString, appendQueryParams } from "./utils/query-params";

// Note: The statement below exports all types from the types module
// TypeScript will automatically handle type-only exports appropriately
