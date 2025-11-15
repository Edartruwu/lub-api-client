/**
 * Tool-related types and interfaces
 * @module types/tool
 */

import { DateTime, TenantID, PaginatedResponse } from "./common";

/**
 * Unique identifier for a tool
 */
export type ToolID = string;

/**
 * Tool types
 */
export enum ToolType {
  HTTP = "HTTP",
  INTERNAL = "INTERNAL",
  GOOGLE_CALENDAR = "GOOGLE_CALENDAR",
  SLACK = "SLACK",
  DATABASE = "DATABASE",
  CALENDLY = "CALENDLY",
  WORKFLOW_TRIGGER = "WORKFLOW_TRIGGER",
}

/**
 * Parameter data types
 */
export enum ParameterType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  OBJECT = "object",
  ARRAY = "array",
}

/**
 * Parameter source (where the value comes from)
 */
export enum ParameterSource {
  AGENT = "agent",
  CONTEXT = "context",
}

/**
 * Tool parameter definition
 */
export interface ToolParameter {
  /** Parameter name */
  name: string;
  /** Parameter description */
  description: string;
  /** Parameter data type */
  type: ParameterType;
  /** Whether the parameter is required */
  required: boolean;
  /** Source of the parameter value */
  source: ParameterSource;
  /** Context path for context-sourced parameters (e.g., "{{trigger.body.sender_id}}") */
  context_path?: string;
  /** Allowed values (for enum parameters) */
  enum?: string[];
  /** Default value */
  default?: any;
  /** Minimum length (for string parameters) */
  min_length?: number;
  /** Maximum length (for string parameters) */
  max_length?: number;
  /** Regular expression pattern (for string parameters) */
  pattern?: string;
  /** Minimum value (for number parameters) */
  minimum?: number;
  /** Maximum value (for number parameters) */
  maximum?: number;
}

/**
 * Complete tool definition
 */
export interface Tool {
  /** Unique tool identifier */
  id: ToolID;
  /** Associated tenant ID */
  tenant_id: TenantID;
  /** Tool name */
  name: string;
  /** Tool description */
  description: string;
  /** Type of tool */
  type: ToolType;
  /** Tool-specific configuration */
  config: Record<string, any>;
  /** Tool parameters */
  parameters: ToolParameter[];
  /** Whether the tool is active */
  is_active: boolean;
  /** Creation timestamp */
  created_at: DateTime;
  /** Last update timestamp */
  updated_at: DateTime;
}

/**
 * Request to create a new tool
 */
export interface CreateToolRequest {
  /** Tool name */
  name: string;
  /** Tool description */
  description: string;
  /** Type of tool */
  type: ToolType;
  /** Tool-specific configuration */
  config: Record<string, any>;
  /** Tool parameters */
  parameters: ToolParameter[];
}

/**
 * Request to update an existing tool
 */
export interface UpdateToolRequest {
  /** Updated tool name */
  name?: string;
  /** Updated tool description */
  description?: string;
  /** Updated tool configuration */
  config?: Record<string, any>;
  /** Updated tool parameters */
  parameters?: ToolParameter[];
}

/**
 * Tool test request
 */
export interface TestToolRequest {
  /** Input parameters for testing */
  parameters: Record<string, any>;
  /** Context data for testing */
  context?: Record<string, any>;
}

/**
 * Tool test response
 */
export interface ToolTestResponse {
  /** Whether the test was successful */
  success: boolean;
  /** Test output (if successful) */
  output?: any;
  /** Error message (if failed) */
  error?: string;
  /** Execution duration in milliseconds */
  duration_ms: number;
}

/**
 * Tool parameters response (grouped by source)
 */
export interface ToolParametersResponse {
  /** All parameters */
  parameters: ToolParameter[];
  /** Agent-sourced parameters */
  agent_parameters: ToolParameter[];
  /** Context-sourced parameters */
  context_parameters: ToolParameter[];
}

/**
 * Tool list response
 */
export interface ToolListResponse extends PaginatedResponse<Tool> {}

/**
 * Query parameters for listing tools
 */
export interface ListToolsParams {
  /** Page number */
  page?: number;
  /** Number of items per page */
  page_size?: number;
  /** Filter by tool type */
  type?: ToolType;
  /** Filter by active status */
  is_active?: boolean;
  /** Search query */
  search?: string;
}

/**
 * Tool type metadata
 */
export interface ToolTypeMetadata {
  /** Tool type identifier */
  type: ToolType;
  /** Display name */
  name: string;
  /** Tool type description */
  description: string;
  /** Configuration schema */
  schema: Record<string, any>;
  /** Example configuration */
  example?: Record<string, any>;
}
