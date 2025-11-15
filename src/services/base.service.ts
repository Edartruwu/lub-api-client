/**
 * Base service class for all resource services
 * @module services/base
 */

import type { HTTPClient } from "../client/http-client";
import type { TenantID } from "../types";

/**
 * Base service configuration
 */
export interface BaseServiceConfig {
  /** HTTP client instance */
  client: HTTPClient;
  /** Tenant ID for scoped requests */
  tenantId: TenantID;
}

/**
 * Base service class that all resource services extend
 *
 * Provides common functionality for all services including:
 * - HTTP client access
 * - Tenant-scoped path building
 * - Common CRUD operations
 */
export abstract class BaseService {
  /**
   * HTTP client instance
   */
  protected readonly client: HTTPClient;

  /**
   * Tenant ID for scoped requests
   */
  protected readonly tenantId: TenantID;

  /**
   * Base path for this service's endpoints
   * Should be set by child classes
   */
  protected abstract readonly basePath: string;

  /**
   * Create a new base service
   *
   * @param config - Service configuration
   */
  constructor(config: BaseServiceConfig) {
    this.client = config.client;
    this.tenantId = config.tenantId;
  }

  /**
   * Build a tenant-scoped path
   *
   * @param path - Path relative to the tenant base
   * @returns Full path with tenant ID
   *
   * @example
   * ```ts
   * this.buildPath('/workflows')
   * // Returns: "/api/tenant/tenant-123/workflows"
   * ```
   */
  protected buildPath(path: string): string {
    const tenantBasePath = `/api/tenant/${this.tenantId}`;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${tenantBasePath}${this.basePath}${cleanPath}`;
  }

  /**
   * Build a non-tenant-scoped path
   *
   * @param path - Absolute API path
   * @returns Full path
   *
   * @example
   * ```ts
   * this.buildAbsolutePath('/api-keys')
   * // Returns: "/api-keys"
   * ```
   */
  protected buildAbsolutePath(path: string): string {
    return path;
  }
}
