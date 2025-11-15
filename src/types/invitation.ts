/**
 * Invitation-related types and interfaces
 * @module types/invitation
 */

import type { DateTime, TenantID, UserID, PaginatedResponse } from "./common";

/**
 * Unique identifier for an invitation
 */
export type InvitationID = string;

/**
 * Invitation status
 */
export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

/**
 * Invitation details
 */
export interface Invitation {
  /** Unique invitation identifier */
  id: InvitationID;
  /** Associated tenant ID */
  tenant_id: TenantID;
  /** Email address of the invitee */
  email: string;
  /** Invitation token */
  token: string;
  /** Role ID to assign (optional) */
  role_id?: string;
  /** Invitation status */
  status: InvitationStatus;
  /** User who created the invitation */
  invited_by: UserID;
  /** Expiration timestamp */
  expires_at: DateTime;
  /** Acceptance timestamp */
  accepted_at?: DateTime;
  /** User who accepted the invitation */
  accepted_by?: UserID;
  /** Creation timestamp */
  created_at: DateTime;
  /** Last update timestamp */
  updated_at: DateTime;
}

/**
 * Invitation details DTO
 */
export interface InvitationDetailsDTO extends Invitation {}

/**
 * Request to create a new invitation
 */
export interface CreateInvitationRequest {
  /** Email address of the invitee */
  email: string;
  /** Role ID to assign (optional) */
  role_id?: string;
  /** Custom expiration in days (optional, defaults to 7) */
  expires_in_days?: number;
  /** Custom message to include (optional) */
  message?: string;
}

/**
 * Invitation list response
 */
export interface InvitationListResponseDTO
  extends PaginatedResponse<InvitationDetailsDTO> {}

/**
 * Validate invitation response
 */
export interface ValidateInvitationResponse {
  /** Whether the invitation is valid */
  is_valid: boolean;
  /** Invitation details (if valid) */
  invitation?: InvitationDetailsDTO;
  /** Error message (if invalid) */
  error?: string;
}
