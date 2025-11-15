/**
 * HTTP client for making requests to the Relay API
 * @module client/http-client
 */

import { appendQueryParams } from "../utils/query-params";
import {
  RelayError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  NetworkError,
  ServerError,
  TimeoutError,
} from "./errors";

/**
 * HTTP request options
 */
export interface RequestOptions {
  /** HTTP method */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Request headers */
  headers?: Record<string, string>;
  /** Request body (will be JSON stringified) */
  body?: any;
  /** Query parameters */
  query?: Record<string, any>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Whether to include credentials */
  credentials?: RequestCredentials;
}

/**
 * HTTP client configuration
 */
export interface HTTPClientConfig {
  /** Base URL for the API */
  baseURL: string;
  /** API key for authentication */
  apiKey: string;
  /** Default request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Custom headers to include in all requests */
  headers?: Record<string, string>;
  /** Request interceptor */
  onRequest?: (url: string, options: RequestInit) => void | Promise<void>;
  /** Response interceptor */
  onResponse?: (response: Response) => void | Promise<void>;
  /** Error interceptor */
  onError?: (error: RelayError) => void | Promise<void>;
}

/**
 * HTTP client for the Relay API
 *
 * Handles authentication, error handling, and request/response interceptors
 */
export class HTTPClient {
  private readonly baseURL: string;
  private readonly apiKey: string;
  private readonly timeout: number;
  private readonly defaultHeaders: Record<string, string>;
  private readonly onRequest?: (
    url: string,
    options: RequestInit,
  ) => void | Promise<void>;
  private readonly onResponse?: (response: Response) => void | Promise<void>;
  private readonly onError?: (error: RelayError) => void | Promise<void>;

  /**
   * Create a new HTTP client
   *
   * @param config - Client configuration
   *
   * @example
   * ```ts
   * const client = new HTTPClient({
   *   baseURL: 'https://api.relay.com',
   *   apiKey: 'relay_live_xxx...',
   *   timeout: 30000
   * });
   * ```
   */
  constructor(config: HTTPClientConfig) {
    this.baseURL = config.baseURL.replace(/\/$/, ""); // Remove trailing slash
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 30000;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "User-Agent": "relay-api-client-typescript/1.0.0",
      ...config.headers,
    };
    this.onRequest = config.onRequest;
    this.onResponse = config.onResponse;
    this.onError = config.onError;
  }

  /**
   * Make an HTTP request
   *
   * @param path - API endpoint path
   * @param options - Request options
   * @returns Promise resolving to the response data
   *
   * @throws {RelayError} When the request fails
   */
  async request<T = any>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const {
      method = "GET",
      headers = {},
      body,
      query,
      timeout = this.timeout,
      credentials = "same-origin",
    } = options;

    // Build URL with query parameters
    let url = `${this.baseURL}${path}`;
    if (query) {
      url = appendQueryParams(url, query);
    }

    // Build headers
    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers,
      Authorization: `Bearer ${this.apiKey}`,
    };

    // Build request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials,
    };

    // Add body if present (and not GET)
    if (body && method !== "GET") {
      requestOptions.body =
        typeof body === "string" ? body : JSON.stringify(body);
    }

    // Call request interceptor
    if (this.onRequest) {
      await this.onRequest(url, requestOptions);
    }

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new TimeoutError(`Request timeout after ${timeout}ms`));
        }, timeout);
      });

      // Make the request with timeout
      const response = await Promise.race([
        fetch(url, requestOptions),
        timeoutPromise,
      ]);

      // Call response interceptor
      if (this.onResponse) {
        await this.onResponse(response);
      }

      // Handle response
      return await this.handleResponse<T>(response);
    } catch (error) {
      // Handle errors
      const relayError = this.handleError(error);

      // Call error interceptor
      if (this.onError) {
        await this.onError(relayError);
      }

      throw relayError;
    }
  }

  /**
   * Make a GET request
   *
   * @param path - API endpoint path
   * @param query - Query parameters
   * @param options - Additional request options
   * @returns Promise resolving to the response data
   */
  async get<T = any>(
    path: string,
    query?: Record<string, any>,
    options?: Omit<RequestOptions, "method" | "query">,
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET", query });
  }

  /**
   * Make a POST request
   *
   * @param path - API endpoint path
   * @param body - Request body
   * @param options - Additional request options
   * @returns Promise resolving to the response data
   */
  async post<T = any>(
    path: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: "POST", body });
  }

  /**
   * Make a PUT request
   *
   * @param path - API endpoint path
   * @param body - Request body
   * @param options - Additional request options
   * @returns Promise resolving to the response data
   */
  async put<T = any>(
    path: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: "PUT", body });
  }

  /**
   * Make a PATCH request
   *
   * @param path - API endpoint path
   * @param body - Request body
   * @param options - Additional request options
   * @returns Promise resolving to the response data
   */
  async patch<T = any>(
    path: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: "PATCH", body });
  }

  /**
   * Make a DELETE request
   *
   * @param path - API endpoint path
   * @param options - Additional request options
   * @returns Promise resolving to the response data
   */
  async delete<T = any>(
    path: string,
    options?: Omit<RequestOptions, "method">,
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }

  /**
   * Handle HTTP response
   *
   * @private
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Get response body
    const contentType = response.headers.get("content-type");
    const isJSON = contentType?.includes("application/json");

    let data: any;
    try {
      if (isJSON) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = text ? { message: text } : {};
      }
    } catch (error) {
      // If we can't parse the response, use an empty object
      data = {};
    }

    // Handle error responses
    if (!response.ok) {
      throw this.createErrorFromResponse(response.status, data);
    }

    return data as T;
  }

  /**
   * Create an appropriate error from a response
   *
   * @private
   */
  private createErrorFromResponse(status: number, data: any): RelayError {
    const message = data?.message || data?.error || "An error occurred";
    const code = data?.code;
    const details = data?.details;

    switch (status) {
      case 401:
        return new AuthenticationError(message, details);
      case 403:
        return new AuthorizationError(message, details);
      case 404:
        return new NotFoundError(message, details);
      case 400:
      case 422:
        return new ValidationError(message, details);
      case 429:
        const retryAfter = data?.retry_after;
        return new RateLimitError(message, retryAfter, details);
      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerError(message, status, details);
      default:
        return new RelayError(message, status, code, details);
    }
  }

  /**
   * Handle errors from the request
   *
   * @private
   */
  private handleError(error: any): RelayError {
    // If it's already a RelayError, return it
    if (error instanceof RelayError) {
      return error;
    }

    // If it's a network error
    if (error instanceof TypeError || error.message === "Failed to fetch") {
      return new NetworkError(
        "Network request failed. Please check your connection.",
        {
          originalError: error.message,
        },
      );
    }

    // If it's an unknown error
    return new RelayError(
      error.message || "An unknown error occurred",
      undefined,
      "UNKNOWN_ERROR",
      { originalError: error },
    );
  }
}
