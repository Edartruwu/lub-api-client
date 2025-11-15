/**
 * Tool service for managing tools
 * @module services/tool
 */

import { BaseService } from "./base.service";
import type {
  Tool,
  ToolID,
  CreateToolRequest,
  UpdateToolRequest,
  TestToolRequest,
  ToolTestResponse,
  ToolParametersResponse,
  ToolListResponse,
  ListToolsParams,
  SuccessResponse,
  ToolTypeMetadata,
  ToolType,
} from "../types";

/**
 * Service for managing tools
 *
 * Provides methods for creating, updating, testing, and managing tools
 *
 * @example
 * ```ts
 * const tool = await client.tools.create({
 *   name: 'My HTTP Tool',
 *   description: 'Makes HTTP requests',
 *   type: 'HTTP',
 *   config: { url: 'https://api.example.com' },
 *   parameters: [...]
 * });
 * ```
 */
export class ToolService extends BaseService {
  protected readonly basePath = "/tools";

  /**
   * Create a new tool
   *
   * @param request - Tool creation request
   * @returns Promise resolving to the created tool
   *
   * @throws {ValidationError} When the tool data is invalid
   * @throws {AuthorizationError} When the user lacks `tools:write` scope
   *
   * @example
   * ```ts
   * const tool = await client.tools.create({
   *   name: 'Get User Info',
   *   description: 'Fetches user information from CRM',
   *   type: 'HTTP',
   *   config: {
   *     method: 'GET',
   *     url: 'https://crm.example.com/users/{user_id}'
   *   },
   *   parameters: [{
   *     name: 'user_id',
   *     description: 'User ID to fetch',
   *     type: 'string',
   *     required: true,
   *     source: 'agent'
   *   }]
   * });
   * ```
   */
  async create(request: CreateToolRequest): Promise<Tool> {
    return this.client.post<Tool>(this.buildPath(""), request);
  }

  /**
   * List tools with optional filtering and pagination
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated list of tools
   *
   * @throws {AuthorizationError} When the user lacks `tools:read` scope
   *
   * @example
   * ```ts
   * const tools = await client.tools.list({
   *   page: 1,
   *   page_size: 20,
   *   type: 'HTTP',
   *   is_active: true,
   *   search: 'user'
   * });
   * ```
   */
  async list(params?: ListToolsParams): Promise<ToolListResponse> {
    return this.client.get<ToolListResponse>(this.buildPath(""), params);
  }

  /**
   * Get a tool by ID
   *
   * @param id - Tool ID
   * @returns Promise resolving to the tool
   *
   * @throws {NotFoundError} When the tool doesn't exist
   * @throws {AuthorizationError} When the user lacks `tools:read` scope
   *
   * @example
   * ```ts
   * const tool = await client.tools.get('tool-123');
   * ```
   */
  async get(id: ToolID): Promise<Tool> {
    return this.client.get<Tool>(this.buildPath(`/${id}`));
  }

  /**
   * Get tool parameters grouped by source
   *
   * @param id - Tool ID
   * @returns Promise resolving to tool parameters grouped by source
   *
   * @throws {NotFoundError} When the tool doesn't exist
   * @throws {AuthorizationError} When the user lacks `tools:read` scope
   *
   * @example
   * ```ts
   * const params = await client.tools.getParameters('tool-123');
   * console.log('Agent parameters:', params.agent_parameters);
   * console.log('Context parameters:', params.context_parameters);
   * ```
   */
  async getParameters(id: ToolID): Promise<ToolParametersResponse> {
    return this.client.get<ToolParametersResponse>(
      this.buildPath(`/${id}/parameters`),
    );
  }

  /**
   * Update a tool
   *
   * @param id - Tool ID
   * @param request - Tool update request
   * @returns Promise resolving to the updated tool
   *
   * @throws {NotFoundError} When the tool doesn't exist
   * @throws {ValidationError} When the update data is invalid
   * @throws {AuthorizationError} When the user lacks `tools:write` scope
   *
   * @example
   * ```ts
   * const updated = await client.tools.update('tool-123', {
   *   description: 'Updated description',
   *   config: { timeout: 30000 }
   * });
   * ```
   */
  async update(id: ToolID, request: UpdateToolRequest): Promise<Tool> {
    return this.client.put<Tool>(this.buildPath(`/${id}`), request);
  }

  /**
   * Delete a tool
   *
   * @param id - Tool ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the tool doesn't exist
   * @throws {AuthorizationError} When the user lacks `tools:delete` scope
   *
   * @example
   * ```ts
   * await client.tools.delete('tool-123');
   * ```
   */
  async delete(id: ToolID): Promise<SuccessResponse> {
    return this.client.delete<SuccessResponse>(this.buildPath(`/${id}`));
  }

  /**
   * Activate a tool
   *
   * @param id - Tool ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the tool doesn't exist
   * @throws {AuthorizationError} When the user lacks `tools:write` scope
   *
   * @example
   * ```ts
   * await client.tools.activate('tool-123');
   * ```
   */
  async activate(id: ToolID): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(this.buildPath(`/${id}/activate`));
  }

  /**
   * Deactivate a tool
   *
   * @param id - Tool ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the tool doesn't exist
   * @throws {AuthorizationError} When the user lacks `tools:write` scope
   *
   * @example
   * ```ts
   * await client.tools.deactivate('tool-123');
   * ```
   */
  async deactivate(id: ToolID): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(
      this.buildPath(`/${id}/deactivate`),
    );
  }

  /**
   * Test a tool with sample parameters
   *
   * @param id - Tool ID
   * @param request - Test request with parameters
   * @returns Promise resolving to test response
   *
   * @throws {NotFoundError} When the tool doesn't exist
   * @throws {ValidationError} When the test parameters are invalid
   * @throws {AuthorizationError} When the user lacks `tools:test` scope
   *
   * @example
   * ```ts
   * const result = await client.tools.test('tool-123', {
   *   parameters: {
   *     user_id: '12345'
   *   },
   *   context: {
   *     sender_id: 'test-user'
   *   }
   * });
   *
   * if (result.success) {
   *   console.log('Tool output:', result.output);
   * } else {
   *   console.error('Test failed:', result.error);
   * }
   * ```
   */
  async test(id: ToolID, request: TestToolRequest): Promise<ToolTestResponse> {
    return this.client.post<ToolTestResponse>(
      this.buildPath(`/${id}/test`),
      request,
    );
  }

  /**
   * Get available tool types and their schemas
   *
   * @returns Promise resolving to array of tool type metadata
   *
   * @example
   * ```ts
   * const toolTypes = await client.tools.getToolTypes();
   * toolTypes.forEach(type => {
   *   console.log(`${type.name}: ${type.description}`);
   * });
   * ```
   */
  async getToolTypes(): Promise<ToolTypeMetadata[]> {
    return this.client.get<ToolTypeMetadata[]>(
      this.buildAbsolutePath("/api/tools/types"),
    );
  }

  /**
   * Get schema for a specific tool type
   *
   * @param type - Tool type
   * @returns Promise resolving to tool type schema
   *
   * @example
   * ```ts
   * const schema = await client.tools.getToolTypeSchema('HTTP');
   * console.log('Required config:', schema);
   * ```
   */
  async getToolTypeSchema(type: ToolType): Promise<Record<string, any>> {
    return this.client.get<Record<string, any>>(
      this.buildAbsolutePath(`/api/tools/types/${type}/schema`),
    );
  }
}
