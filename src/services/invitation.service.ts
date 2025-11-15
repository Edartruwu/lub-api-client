/**
 * Invitation service for managing user invitations
 * @module services/invitation
 */

import { BaseService } from "./base.service";
import type {
  InvitationID,
  InvitationDetailsDTO,
  CreateInvitationRequest,
  InvitationListResponseDTO,
  ValidateInvitationResponse,
  SuccessResponse,
} from "../types";

/**
 * Service for managing user invitations
 *
 * Allows inviting new users to join your tenant. Invitations can be validated
 * and accepted through the OAuth login flow.
 *
 * @example
 * ```ts
 * const invitation = await client.invitations.create({
 *   email: 'user@example.com',
 *   role_id: 'admin',
 *   expires_in_days: 7
 * });
 *
 * console.log('Invitation token:', invitation.token);
 * ```
 */
export class InvitationService extends BaseService {
  protected readonly basePath = "";

  /**
   * Build path for invitation endpoints (not tenant-scoped)
   */
  protected buildInvitationPath(path: string): string {
    return this.buildAbsolutePath(`/invitations${path}`);
  }

  /**
   * Create a new invitation
   *
   * @param request - Invitation creation request
   * @returns Promise resolving to the created invitation
   *
   * @throws {ValidationError} When the request data is invalid
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * // Invite a new admin user
   * const invitation = await client.invitations.create({
   *   email: 'admin@example.com',
   *   role_id: 'admin',
   *   expires_in_days: 7,
   *   message: 'Welcome to the team!'
   * });
   *
   * // Send the invitation URL to the user
   * const inviteUrl = `https://app.relay.com/invite?token=${invitation.token}`;
   * console.log('Send this URL:', inviteUrl);
   *
   * // Invite a regular user
   * await client.invitations.create({
   *   email: 'user@example.com',
   *   expires_in_days: 3
   * });
   * ```
   */
  async create(
    request: CreateInvitationRequest,
  ): Promise<InvitationDetailsDTO> {
    return this.client.post<InvitationDetailsDTO>(
      this.buildInvitationPath(""),
      request,
    );
  }

  /**
   * List all invitations for the tenant
   *
   * @returns Promise resolving to paginated list of invitations
   *
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * const { data, total } = await client.invitations.list();
   * data.forEach(invite => {
   *   console.log(`${invite.email} - ${invite.status}`);
   * });
   * ```
   */
  async list(): Promise<InvitationListResponseDTO> {
    return this.client.get<InvitationListResponseDTO>(
      this.buildInvitationPath(""),
    );
  }

  /**
   * List pending invitations only
   *
   * @returns Promise resolving to paginated list of pending invitations
   *
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * const { data } = await client.invitations.listPending();
   * console.log(`${data.length} pending invitations`);
   * ```
   */
  async listPending(): Promise<InvitationListResponseDTO> {
    return this.client.get<InvitationListResponseDTO>(
      this.buildInvitationPath("/pending"),
    );
  }

  /**
   * Get an invitation by ID
   *
   * @param id - Invitation ID
   * @returns Promise resolving to the invitation
   *
   * @throws {NotFoundError} When the invitation doesn't exist
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * const invitation = await client.invitations.get('invite-123');
   * console.log('Invited:', invitation.email);
   * console.log('Status:', invitation.status);
   * ```
   */
  async get(id: InvitationID): Promise<InvitationDetailsDTO> {
    return this.client.get<InvitationDetailsDTO>(
      this.buildInvitationPath(`/${id}`),
    );
  }

  /**
   * Delete an invitation
   *
   * @param id - Invitation ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the invitation doesn't exist
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * await client.invitations.delete('invite-123');
   * ```
   */
  async delete(id: InvitationID): Promise<SuccessResponse> {
    return this.client.delete<SuccessResponse>(
      this.buildInvitationPath(`/${id}`),
    );
  }

  /**
   * Revoke an invitation
   *
   * Revoked invitations cannot be accepted.
   *
   * @param id - Invitation ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the invitation doesn't exist
   * @throws {AuthorizationError} When the user is not authenticated
   *
   * @example
   * ```ts
   * await client.invitations.revoke('invite-123');
   * console.log('Invitation revoked');
   * ```
   */
  async revoke(id: InvitationID): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(
      this.buildInvitationPath(`/${id}/revoke`),
    );
  }

  /**
   * Validate an invitation token (public endpoint)
   *
   * This is a public endpoint that doesn't require authentication.
   * Used to check if an invitation token is valid before accepting.
   *
   * @param token - Invitation token
   * @returns Promise resolving to validation response
   *
   * @example
   * ```ts
   * const validation = await client.invitations.validateToken('token-abc123');
   * if (validation.is_valid) {
   *   console.log('Valid invitation for:', validation.invitation?.email);
   * } else {
   *   console.error('Invalid:', validation.error);
   * }
   * ```
   */
  async validateToken(token: string): Promise<ValidateInvitationResponse> {
    return this.client.get<ValidateInvitationResponse>(
      this.buildInvitationPath("/public/validate"),
      { token },
    );
  }

  /**
   * Get an invitation by token (public endpoint)
   *
   * This is a public endpoint that doesn't require authentication.
   *
   * @param token - Invitation token
   * @returns Promise resolving to the invitation
   *
   * @throws {NotFoundError} When the invitation doesn't exist or is invalid
   *
   * @example
   * ```ts
   * const invitation = await client.invitations.getByToken('token-abc123');
   * console.log('You are invited to:', invitation.email);
   * ```
   */
  async getByToken(token: string): Promise<InvitationDetailsDTO> {
    return this.client.get<InvitationDetailsDTO>(
      this.buildInvitationPath(`/public/token/${token}`),
    );
  }
}
