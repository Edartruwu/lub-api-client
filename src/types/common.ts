/**
 * Common types and interfaces used across the Relay API client
 * @module types/common
 */

/**
 * Unique identifier for a tenant
 */
export type TenantID = string;

/**
 * Unique identifier for a user
 */
export type UserID = string;

/**
 * ISO 8601 formatted date-time string
 */
export type DateTime = string;

/**
 * Pagination query parameters
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Number of items per page */
  page_size?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  data: T[];
  /** Total number of items across all pages */
  total: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  page_size: number;
  /** Total number of pages */
  total_pages: number;
}

/**
 * Standard API error response
 */
export interface APIError {
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
  /** Additional error details */
  details?: Record<string, any>;
  /** HTTP status code */
  status?: number;
}

/**
 * Standard success response for operations
 */
export interface SuccessResponse {
  /** Success message */
  message: string;
}

/**
 * Bulk operation response
 */
export interface BulkOperationResponse {
  /** Success message */
  message: string;
  /** Number of items affected */
  count: number;
  /** IDs of items that failed (if any) */
  failed_ids?: string[];
  /** Error details for failed items */
  errors?: Record<string, string>;
}

/**
 * Tenant status
 */
export enum TenantStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  CANCELED = "CANCELED",
  TRIAL = "TRIAL",
}

/**
 * Subscription plan types
 */
export enum SubscriptionPlan {
  TRIAL = "TRIAL",
  BASIC = "BASIC",
  PROFESSIONAL = "PROFESSIONAL",
  ENTERPRISE = "ENTERPRISE",
}

/**
 * User status
 */
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
}

/**
 * OAuth providers
 */
export enum OAuthProvider {
  GOOGLE = "GOOGLE",
  MICROSOFT = "MICROSOFT",
}

/**
 * Environment types
 */
export enum Environment {
  LIVE = "live",
  TEST = "test",
}

/**
 * Tenant details
 */
export interface Tenant {
  /** Unique tenant identifier */
  id: TenantID;
  /** Company name */
  company_name: string;
  /** Tenant status */
  status: TenantStatus;
  /** Subscription plan */
  subscription_plan: SubscriptionPlan;
  /** Maximum number of users allowed */
  max_users: number;
  /** Current number of users */
  current_users: number;
  /** Trial expiration date (if applicable) */
  trial_expires_at?: DateTime;
  /** Subscription expiration date */
  subscription_expires_at?: DateTime;
  /** Creation timestamp */
  created_at: DateTime;
  /** Last update timestamp */
  updated_at: DateTime;
}

/**
 * User details
 */
export interface User {
  /** Unique user identifier */
  id: UserID;
  /** Associated tenant ID */
  tenant_id: TenantID;
  /** User email address */
  email: string;
  /** User full name */
  name: string;
  /** Profile picture URL */
  picture?: string;
  /** User status */
  status: UserStatus;
  /** Whether user has admin privileges */
  is_admin: boolean;
  /** OAuth provider used */
  oauth_provider: OAuthProvider;
  /** Provider-specific user ID */
  oauth_provider_id: string;
  /** Whether email is verified */
  email_verified: boolean;
  /** Last login timestamp */
  last_login_at?: DateTime;
  /** Creation timestamp */
  created_at: DateTime;
  /** Last update timestamp */
  updated_at: DateTime;
}

/**
 * Filter options for list queries
 */
export interface FilterOptions {
  /** Filter by active status */
  is_active?: boolean;
  /** Search query string */
  search?: string;
  /** Filter by tags */
  tags?: string[];
}

/**
 * Sort options
 */
export interface SortOptions {
  /** Field to sort by */
  sort_by?: string;
  /** Sort direction */
  sort_order?: "asc" | "desc";
}
