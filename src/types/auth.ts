/**
 * Authentication-related types and interfaces
 * @module types/auth
 */

import type { OAuthProvider, User, Tenant } from "./common";

/**
 * OAuth login request
 */
export interface OAuthLoginRequest {
  /** OAuth provider to use */
  provider: OAuthProvider;
  /** Invitation token (optional, for accepting invitations) */
  invitation_token?: string;
}

/**
 * OAuth login response
 */
export interface OAuthLoginResponse {
  /** OAuth authorization URL to redirect to */
  auth_url: string;
  /** State parameter for OAuth flow */
  state: string;
}

/**
 * Token response
 */
export interface TokenResponse {
  /** JWT access token */
  access_token: string;
  /** Refresh token */
  refresh_token: string;
  /** Token type (usually "Bearer") */
  token_type: string;
  /** Expiration time in seconds */
  expires_in: number;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
  /** Refresh token */
  refresh_token: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  /** New JWT access token */
  access_token: string;
  /** Expiration time in seconds */
  expires_in: number;
}

/**
 * Current user response
 */
export interface CurrentUserResponse {
  /** Current user details */
  user: UserDetailsDTO;
  /** Current tenant details */
  tenant: TenantDetailsDTO;
}

/**
 * User details DTO
 */
export interface UserDetailsDTO extends User {}

/**
 * Tenant details DTO
 */
export interface TenantDetailsDTO extends Tenant {}
