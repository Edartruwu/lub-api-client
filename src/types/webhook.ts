/**
 * Webhook-related types and interfaces
 * @module types/webhook
 */

import { DateTime, TenantID } from "./common";
import { WorkflowID, ExecutionMode } from "./workflow";

/**
 * Unique identifier for a webhook
 */
export type WebhookID = string;

/**
 * Webhook authentication types
 */
export enum WebhookAuthType {
  NONE = "none",
  API_KEY = "api_key",
  PLATFORM_AUTH = "platform_auth",
}

/**
 * Webhook trigger request
 */
export interface WebhookTriggerRequest {
  /** Execution mode (sync or async) */
  mode?: ExecutionMode;
  /** Webhook payload */
  payload?: Record<string, any>;
  /** Custom headers */
  headers?: Record<string, string>;
  /** Query parameters */
  query?: Record<string, string>;
}

/**
 * Webhook wait instance
 */
export interface WebhookWaitInstance {
  /** Unique webhook wait instance ID */
  id: WebhookID;
  /** Associated tenant ID */
  tenant_id: TenantID;
  /** Associated workflow ID */
  workflow_id: WorkflowID;
  /** Execution ID */
  execution_id: string;
  /** Node ID that's waiting */
  node_id: string;
  /** Webhook URL */
  webhook_url: string;
  /** Whether the webhook has been triggered */
  triggered: boolean;
  /** Trigger payload (if triggered) */
  payload?: Record<string, any>;
  /** Expiration timestamp */
  expires_at: DateTime;
  /** Creation timestamp */
  created_at: DateTime;
  /** Trigger timestamp (if triggered) */
  triggered_at?: DateTime;
}

/**
 * Webhook wait list response
 */
export interface WebhookWaitListResponse {
  /** Array of webhook wait instances */
  instances: WebhookWaitInstance[];
  /** Total number of instances */
  total: number;
}
