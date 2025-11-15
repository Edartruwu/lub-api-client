/**
 * Workflow-related types and interfaces
 * @module types/workflow
 */

import { DateTime, TenantID, PaginatedResponse } from "./common";

/**
 * Unique identifier for a workflow
 */
export type WorkflowID = string;

/**
 * Workflow trigger types
 */
export enum TriggerType {
  WEBHOOK = "WEBHOOK",
  SCHEDULE = "SCHEDULE",
  MANUAL = "MANUAL",
  CHANNEL_WEBHOOK = "CHANNEL_WEBHOOK",
  TOOL_CALL = "TOOL_CALL",
}

/**
 * Workflow node types
 */
export enum NodeType {
  // Control Flow
  CONDITION = "CONDITION",
  SWITCH = "SWITCH",
  LOOP = "LOOP",
  MERGE = "MERGE",

  // Actions
  ACTION = "ACTION",
  TRANSFORM = "TRANSFORM",
  HTTP = "HTTP",
  HTTP_RESPONSE = "HTTP_RESPONSE",

  // Data
  FILTER = "FILTER",
  VALIDATE = "VALIDATE",
  SET_CONTEXT = "SET_CONTEXT",
  BUFFER = "BUFFER",

  // Timing
  DELAY = "DELAY",
  WEBHOOK_WAIT = "WEBHOOK_WAIT",

  // Integrations
  AI_AGENT = "AI_AGENT",
  SEND_MESSAGE = "SEND_MESSAGE",
  EMAIL = "EMAIL",
  SQL = "SQL",
  CLOUD_STORAGE = "CLOUD_STORAGE",
  HUBSPOT = "HUBSPOT",

  // Media
  VIDEO_GENERATION = "VIDEO_GENERATION",
  SPEECH_TO_TEXT = "SPEECH_TO_TEXT",
  TEXT_TO_SPEECH = "TEXT_TO_SPEECH",

  // Error Handling
  ERROR_HANDLER = "ERROR_HANDLER",

  // Orchestration
  SUB_WORKFLOW = "SUB_WORKFLOW",
}

/**
 * Workflow execution mode
 */
export enum ExecutionMode {
  SYNC = "SYNC",
  ASYNC = "ASYNC",
}

/**
 * Workflow execution status
 */
export enum ExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  TIMEOUT = "TIMEOUT",
  CANCELED = "CANCELED",
}

/**
 * Workflow trigger configuration
 */
export interface WorkflowTrigger {
  /** Type of trigger */
  type: TriggerType;
  /** Trigger-specific configuration */
  config?: Record<string, any>;
  /** Filter conditions for the trigger */
  filters?: Record<string, any>;
}

/**
 * Workflow node definition
 */
export interface WorkflowNode {
  /** Unique node identifier within the workflow */
  id: string;
  /** Display name for the node */
  name: string;
  /** Optional alias for referencing in expressions */
  alias?: string;
  /** Type of node */
  type: NodeType;
  /** Node-specific configuration */
  config: Record<string, any>;
  /** Node IDs to execute on success */
  on_success?: string[];
  /** Node IDs to execute on failure */
  on_failure?: string[];
  /** Execution timeout in milliseconds */
  timeout?: number;
}

/**
 * Complete workflow definition
 */
export interface Workflow {
  /** Unique workflow identifier */
  id: WorkflowID;
  /** Associated tenant ID */
  tenant_id: TenantID;
  /** Workflow name */
  name: string;
  /** Workflow description */
  description: string;
  /** Trigger configuration */
  trigger: WorkflowTrigger;
  /** Array of workflow nodes */
  nodes: WorkflowNode[];
  /** Whether the workflow is active */
  is_active: boolean;
  /** Creation timestamp */
  created_at: DateTime;
  /** Last update timestamp */
  updated_at: DateTime;
}

/**
 * Request to create a new workflow
 */
export interface CreateWorkflowRequest {
  /** Workflow name */
  name: string;
  /** Workflow description */
  description: string;
  /** Trigger configuration */
  trigger: WorkflowTrigger;
  /** Array of workflow nodes */
  nodes: WorkflowNode[];
}

/**
 * Request to update an existing workflow
 */
export interface UpdateWorkflowRequest {
  /** Updated workflow name */
  name?: string;
  /** Updated workflow description */
  description?: string;
  /** Updated trigger configuration */
  trigger?: WorkflowTrigger;
  /** Updated array of workflow nodes */
  nodes?: WorkflowNode[];
}

/**
 * Workflow execution request
 */
export interface ExecuteWorkflowRequest {
  /** Execution mode (sync or async) */
  mode?: ExecutionMode;
  /** Input data for the workflow */
  input?: Record<string, any>;
  /** Custom context variables */
  context?: Record<string, any>;
  /** Whether to wait for completion (sync mode) */
  wait?: boolean;
}

/**
 * Workflow execution result
 */
export interface WorkflowExecutionResponse {
  /** Unique execution identifier */
  execution_id: string;
  /** Associated workflow ID */
  workflow_id: WorkflowID;
  /** Execution status */
  status: ExecutionStatus;
  /** Execution output (if completed) */
  output?: Record<string, any>;
  /** Error details (if failed) */
  error?: string;
  /** Execution start time */
  started_at: DateTime;
  /** Execution end time (if completed) */
  completed_at?: DateTime;
  /** Execution duration in milliseconds */
  duration_ms?: number;
}

/**
 * Workflow validation request
 */
export interface ValidateWorkflowRequest {
  /** Trigger configuration to validate */
  trigger: WorkflowTrigger;
  /** Nodes to validate */
  nodes: WorkflowNode[];
}

/**
 * Workflow validation result
 */
export interface ValidateWorkflowResponse {
  /** Whether the workflow is valid */
  is_valid: boolean;
  /** Validation errors (if any) */
  errors?: ValidationError[];
  /** Validation warnings (if any) */
  warnings?: ValidationWarning[];
}

/**
 * Validation error details
 */
export interface ValidationError {
  /** Node ID where error occurred (if applicable) */
  node_id?: string;
  /** Error message */
  message: string;
  /** Error code */
  code: string;
  /** Path to the problematic field */
  path?: string;
}

/**
 * Validation warning details
 */
export interface ValidationWarning {
  /** Node ID where warning occurred (if applicable) */
  node_id?: string;
  /** Warning message */
  message: string;
  /** Warning code */
  code: string;
}

/**
 * Workflow list response
 */
export interface WorkflowListResponse extends PaginatedResponse<Workflow> {}

/**
 * Workflow response (single workflow)
 */
export interface WorkflowResponse {
  /** Workflow data */
  workflow: Workflow;
}

/**
 * Query parameters for listing workflows
 */
export interface ListWorkflowsParams {
  /** Page number */
  page?: number;
  /** Number of items per page */
  page_size?: number;
  /** Filter by active status */
  is_active?: boolean;
  /** Search query */
  search?: string;
}

/**
 * Bulk workflow operation request
 */
export interface BulkWorkflowRequest {
  /** Array of workflow IDs to operate on */
  workflow_ids: string[];
}

/**
 * Node type metadata
 */
export interface NodeTypeMetadata {
  /** Node type identifier */
  type: NodeType;
  /** Display name */
  name: string;
  /** Node description */
  description: string;
  /** Category */
  category: string;
  /** Configuration schema */
  schema: Record<string, any>;
  /** Example configuration */
  example?: Record<string, any>;
}

/**
 * Trigger type metadata
 */
export interface TriggerTypeMetadata {
  /** Trigger type identifier */
  type: TriggerType;
  /** Display name */
  name: string;
  /** Trigger description */
  description: string;
  /** Configuration schema */
  schema: Record<string, any>;
  /** Example configuration */
  example?: Record<string, any>;
}
