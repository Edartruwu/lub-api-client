/**
 * Webhook service for webhook-related operations
 * @module services/webhook
 */

import { BaseService } from "./base.service";
import type { WebhookWaitListResponse } from "../types";

/**
 * Service for webhook-related operations
 *
 * Provides methods for managing webhook wait instances created by workflows.
 *
 * @example
 * ```ts
 * const { instances } = await client.webhooks.listWaitInstances();
 * instances.forEach(instance => {
 *   console.log(`Webhook URL: ${instance.webhook_url}`);
 *   console.log(`Triggered: ${instance.triggered}`);
 * });
 * ```
 */
export class WebhookService extends BaseService {
  protected readonly basePath = "/webhooks/wait";

  /**
   * List webhook wait instances for the tenant
   *
   * Returns all webhook wait instances created by the webhook wait node in workflows.
   * These instances are waiting for external webhook calls to continue workflow execution.
   *
   * @returns Promise resolving to list of webhook wait instances
   *
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * const { instances, total } = await client.webhooks.listWaitInstances();
   *
   * instances.forEach(instance => {
   *   console.log(`Workflow: ${instance.workflow_id}`);
   *   console.log(`Node: ${instance.node_id}`);
   *   console.log(`Webhook URL: ${instance.webhook_url}`);
   *   console.log(`Triggered: ${instance.triggered}`);
   *   if (instance.triggered && instance.payload) {
   *     console.log('Payload:', instance.payload);
   *   }
   *   console.log(`Expires: ${instance.expires_at}`);
   * });
   *
   * // Filter active (non-triggered) webhooks
   * const activeWebhooks = instances.filter(w => !w.triggered);
   * console.log(`${activeWebhooks.length} webhooks waiting`);
   * ```
   */
  async listWaitInstances(): Promise<WebhookWaitListResponse> {
    return this.client.get<WebhookWaitListResponse>(this.buildPath(""));
  }
}
