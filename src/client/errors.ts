/**
 * Error classes for the Relay API client
 * @module client/errors
 */

import type { APIError } from "../types";

/**
 * Base error class for all Relay API errors
 */
export class RelayError extends Error {
  /**
   * HTTP status code (if applicable)
   */
  public readonly status?: number;

  /**
   * Error code
   */
  public readonly code?: string;

  /**
   * Additional error details
   */
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: Record<string, any>,
  ) {
    super(message);
    this.name = "RelayError";
    this.status = status;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (typeof (Error as any).captureStackTrace === "function") {
      (Error as any).captureStackTrace(this, RelayError);
    }
  }

  /**
   * Create a RelayError from an API error response
   */
  static fromAPIError(error: APIError): RelayError {
    return new RelayError(
      error.message,
      error.status,
      error.code,
      error.details,
    );
  }
}

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends RelayError {
  constructor(
    message: string = "Authentication failed",
    details?: Record<string, any>,
  ) {
    super(message, 401, "AUTHENTICATION_ERROR", details);
    this.name = "AuthenticationError";
  }
}

/**
 * Error thrown when the user doesn't have permission
 */
export class AuthorizationError extends RelayError {
  constructor(
    message: string = "Insufficient permissions",
    details?: Record<string, any>,
  ) {
    super(message, 403, "AUTHORIZATION_ERROR", details);
    this.name = "AuthorizationError";
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends RelayError {
  constructor(
    message: string = "Resource not found",
    details?: Record<string, any>,
  ) {
    super(message, 404, "NOT_FOUND", details);
    this.name = "NotFoundError";
  }
}

/**
 * Error thrown when a request is invalid
 */
export class ValidationError extends RelayError {
  constructor(
    message: string = "Validation failed",
    details?: Record<string, any>,
  ) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

/**
 * Error thrown when a rate limit is exceeded
 */
export class RateLimitError extends RelayError {
  /**
   * Number of seconds to wait before retrying
   */
  public readonly retryAfter?: number;

  constructor(
    message: string = "Rate limit exceeded",
    retryAfter?: number,
    details?: Record<string, any>,
  ) {
    super(message, 429, "RATE_LIMIT_ERROR", details);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

/**
 * Error thrown when a network request fails
 */
export class NetworkError extends RelayError {
  constructor(
    message: string = "Network request failed",
    details?: Record<string, any>,
  ) {
    super(message, undefined, "NETWORK_ERROR", details);
    this.name = "NetworkError";
  }
}

/**
 * Error thrown when the server returns an unexpected error
 */
export class ServerError extends RelayError {
  constructor(
    message: string = "Internal server error",
    status: number = 500,
    details?: Record<string, any>,
  ) {
    super(message, status, "SERVER_ERROR", details);
    this.name = "ServerError";
  }
}

/**
 * Error thrown when a request times out
 */
export class TimeoutError extends RelayError {
  constructor(
    message: string = "Request timeout",
    details?: Record<string, any>,
  ) {
    super(message, 408, "TIMEOUT_ERROR", details);
    this.name = "TimeoutError";
  }
}
