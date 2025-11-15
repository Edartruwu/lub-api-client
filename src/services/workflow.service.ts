/**
 * Workflow service for managing workflows
 * @module services/workflow
 */

import { BaseService } from "./base.service";
import type {
  WorkflowID,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  ExecuteWorkflowRequest,
  WorkflowExecutionResponse,
  WorkflowListResponse,
  WorkflowResponse,
  ValidateWorkflowRequest,
  ValidateWorkflowResponse,
  ListWorkflowsParams,
  BulkOperationResponse,
  SuccessResponse,
  NodeTypeMetadata,
  TriggerTypeMetadata,
  NodeType,
} from "../types";

/**
 * Service for managing workflows
 *
 * Provides methods for creating, updating, executing, and managing workflows
 *
 * @example
 * ```ts
 * const workflow = await client.workflows.create({
 *   name: 'My Workflow',
 *   description: 'A sample workflow',
 *   trigger: { type: 'WEBHOOK' },
 *   nodes: [...]
 * });
 * ```
 */
export class WorkflowService extends BaseService {
  protected readonly basePath = "/workflows";

  /**
   * Create a new workflow
   *
   * @param request - Workflow creation request
   * @returns Promise resolving to the created workflow
   *
   * @throws {ValidationError} When the workflow data is invalid
   * @throws {AuthorizationError} When the user lacks `workflows:write` scope
   *
   * @example
   * ```ts
   * const workflow = await client.workflows.create({
   *   name: 'WhatsApp Handler',
   *   description: 'Handles WhatsApp messages',
   *   trigger: {
   *     type: 'CHANNEL_WEBHOOK',
   *     filters: { channel_ids: ['channel-123'] }
   *   },
   *   nodes: [{
   *     id: 'node-1',
   *     name: 'AI Agent',
   *     type: 'AI_AGENT',
   *     config: { model: 'gpt-4' }
   *   }]
   * });
   * ```
   */
  async create(request: CreateWorkflowRequest): Promise<WorkflowResponse> {
    return this.client.post<WorkflowResponse>(this.buildPath(""), request);
  }

  /**
   * List workflows with optional filtering and pagination
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated list of workflows
   *
   * @throws {AuthorizationError} When the user lacks `workflows:read` scope
   *
   * @example
   * ```ts
   * const workflows = await client.workflows.list({
   *   page: 1,
   *   page_size: 20,
   *   is_active: true,
   *   search: 'whatsapp'
   * });
   * ```
   */
  async list(params?: ListWorkflowsParams): Promise<WorkflowListResponse> {
    return this.client.get<WorkflowListResponse>(this.buildPath(""), params);
  }

  /**
   * Get a workflow by ID
   *
   * @param id - Workflow ID
   * @returns Promise resolving to the workflow
   *
   * @throws {NotFoundError} When the workflow doesn't exist
   * @throws {AuthorizationError} When the user lacks `workflows:read` scope
   *
   * @example
   * ```ts
   * const workflow = await client.workflows.get('workflow-123');
   * ```
   */
  async get(id: WorkflowID): Promise<WorkflowResponse> {
    return this.client.get<WorkflowResponse>(this.buildPath(`/${id}`));
  }

  /**
   * Get a workflow by name
   *
   * @param name - Workflow name
   * @returns Promise resolving to the workflow
   *
   * @throws {NotFoundError} When the workflow doesn't exist
   * @throws {AuthorizationError} When the user lacks `workflows:read` scope
   *
   * @example
   * ```ts
   * const workflow = await client.workflows.getByName('my-workflow');
   * ```
   */
  async getByName(name: string): Promise<WorkflowResponse> {
    return this.client.get<WorkflowResponse>(
      this.buildPath(`/name/${encodeURIComponent(name)}`),
    );
  }

  /**
   * Update a workflow
   *
   * @param id - Workflow ID
   * @param request - Workflow update request
   * @returns Promise resolving to the updated workflow
   *
   * @throws {NotFoundError} When the workflow doesn't exist
   * @throws {ValidationError} When the update data is invalid
   * @throws {AuthorizationError} When the user lacks `workflows:write` scope
   *
   * @example
   * ```ts
   * const updated = await client.workflows.update('workflow-123', {
   *   description: 'Updated description'
   * });
   * ```
   */
  async update(
    id: WorkflowID,
    request: UpdateWorkflowRequest,
  ): Promise<WorkflowResponse> {
    return this.client.put<WorkflowResponse>(this.buildPath(`/${id}`), request);
  }

  /**
   * Delete a workflow
   *
   * @param id - Workflow ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the workflow doesn't exist
   * @throws {AuthorizationError} When the user lacks `workflows:delete` scope
   *
   * @example
   * ```ts
   * await client.workflows.delete('workflow-123');
   * ```
   */
  async delete(id: WorkflowID): Promise<SuccessResponse> {
    return this.client.delete<SuccessResponse>(this.buildPath(`/${id}`));
  }

  /**
   * Activate a workflow
   *
   * @param id - Workflow ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the workflow doesn't exist
   * @throws {AuthorizationError} When the user lacks `workflows:write` scope
   *
   * @example
   * ```ts
   * await client.workflows.activate('workflow-123');
   * ```
   */
  async activate(id: WorkflowID): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(this.buildPath(`/${id}/activate`));
  }

  /**
   * Deactivate a workflow
   *
   * @param id - Workflow ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the workflow doesn't exist
   * @throws {AuthorizationError} When the user lacks `workflows:write` scope
   *
   * @example
   * ```ts
   * await client.workflows.deactivate('workflow-123');
   * ```
   */
  async deactivate(id: WorkflowID): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(
      this.buildPath(`/${id}/deactivate`),
    );
  }

  /**
   * Execute a workflow
   *
   * @param id - Workflow ID
   * @param request - Execution request with input data
   * @returns Promise resolving to execution response
   *
   * @throws {NotFoundError} When the workflow doesn't exist
   * @throws {AuthorizationError} When the user lacks `workflows:execute` scope
   *
   * @example
   * ```ts
   * const result = await client.workflows.execute('workflow-123', {
   *   mode: 'SYNC',
   *   input: { message: 'Hello' },
   *   wait: true
   * });
   * ```
   */
  async execute(
    id: WorkflowID,
    request?: ExecuteWorkflowRequest,
  ): Promise<WorkflowExecutionResponse> {
    return this.client.post<WorkflowExecutionResponse>(
      this.buildPath(`/${id}/execute`),
      request,
    );
  }

  /**
   * Test a workflow without saving it
   *
   * @param request - Workflow definition to test
   * @returns Promise resolving to execution response
   *
   * @throws {ValidationError} When the workflow definition is invalid
   * @throws {AuthorizationError} When the user lacks `workflows:test` scope
   *
   * @example
   * ```ts
   * const result = await client.workflows.test({
   *   name: 'Test Workflow',
   *   trigger: { type: 'MANUAL' },
   *   nodes: [...]
   * });
   * ```
   */
  async test(
    request: CreateWorkflowRequest,
  ): Promise<WorkflowExecutionResponse> {
    return this.client.post<WorkflowExecutionResponse>(
      this.buildPath("/test"),
      request,
    );
  }

  /**
   * Validate a workflow definition
   *
   * @param request - Workflow definition to validate
   * @returns Promise resolving to validation response
   *
   * @throws {AuthorizationError} When the user lacks `workflows:read` scope
   *
   * @example
   * ```ts
   * const validation = await client.workflows.validate({
   *   trigger: { type: 'WEBHOOK' },
   *   nodes: [{ id: 'node-1', type: 'AI_AGENT', config: {} }]
   * });
   *
   * if (!validation.is_valid) {
   *   console.error('Validation errors:', validation.errors);
   * }
   * ```
   */
  async validate(
    request: ValidateWorkflowRequest,
  ): Promise<ValidateWorkflowResponse> {
    return this.client.post<ValidateWorkflowResponse>(
      this.buildAbsolutePath("/api/workflows/validate"),
      request,
    );
  }

  /**
   * Bulk activate workflows
   *
   * @param workflowIds - Array of workflow IDs to activate
   * @returns Promise resolving to bulk operation response
   *
   * @throws {AuthorizationError} When the user lacks `workflows:*` scope
   *
   * @example
   * ```ts
   * const result = await client.workflows.bulkActivate([
   *   'workflow-1',
   *   'workflow-2',
   *   'workflow-3'
   * ]);
   * console.log(`Activated ${result.count} workflows`);
   * ```
   */
  async bulkActivate(
    workflowIds: WorkflowID[],
  ): Promise<BulkOperationResponse> {
    return this.client.put<BulkOperationResponse>(
      this.buildPath("/bulk/activate"),
      { workflow_ids: workflowIds },
    );
  }

  /**
   * Bulk deactivate workflows
   *
   * @param workflowIds - Array of workflow IDs to deactivate
   * @returns Promise resolving to bulk operation response
   *
   * @throws {AuthorizationError} When the user lacks `workflows:*` scope
   *
   * @example
   * ```ts
   * const result = await client.workflows.bulkDeactivate([
   *   'workflow-1',
   *   'workflow-2'
   * ]);
   * ```
   */
  async bulkDeactivate(
    workflowIds: WorkflowID[],
  ): Promise<BulkOperationResponse> {
    return this.client.put<BulkOperationResponse>(
      this.buildPath("/bulk/deactivate"),
      { workflow_ids: workflowIds },
    );
  }

  /**
   * Get available node types and their schemas
   *
   * @returns Promise resolving to array of node type metadata
   *
   * @example
   * ```ts
   * const nodeTypes = await client.workflows.getNodeTypes();
   * nodeTypes.forEach(type => {
   *   console.log(`${type.name}: ${type.description}`);
   * });
   * ```
   */
  async getNodeTypes(): Promise<NodeTypeMetadata[]> {
    return this.client.get<NodeTypeMetadata[]>(
      this.buildAbsolutePath("/api/nodes/types"),
    );
  }

  /**
   * Get schema for a specific node type
   *
   * @param type - Node type
   * @returns Promise resolving to node type schema
   *
   * @example
   * ```ts
   * const schema = await client.workflows.getNodeTypeSchema('AI_AGENT');
   * console.log('Required config:', schema);
   * ```
   */
  async getNodeTypeSchema(type: NodeType): Promise<Record<string, any>> {
    return this.client.get<Record<string, any>>(
      this.buildAbsolutePath(`/api/nodes/types/${type}/schema`),
    );
  }

  /**
   * Get available trigger types and their schemas
   *
   * @returns Promise resolving to array of trigger type metadata
   *
   * @example
   * ```ts
   * const triggerTypes = await client.workflows.getTriggerTypes();
   * ```
   */
  async getTriggerTypes(): Promise<TriggerTypeMetadata[]> {
    return this.client.get<TriggerTypeMetadata[]>(
      this.buildAbsolutePath("/api/triggers/types"),
    );
  }
}
