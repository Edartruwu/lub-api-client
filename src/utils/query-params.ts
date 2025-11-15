/**
 * Utility functions for handling query parameters
 * @module utils/query-params
 */

/**
 * Convert an object to URL query parameters
 *
 * @param params - Object containing query parameters
 * @returns URL-encoded query string (without leading '?')
 *
 * @example
 * ```ts
 * buildQueryString({ page: 1, is_active: true })
 * // Returns: "page=1&is_active=true"
 * ```
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // Handle arrays by repeating the key
        value.forEach((item) => {
          searchParams.append(key, String(item));
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

/**
 * Merge query parameters into a URL
 *
 * @param url - Base URL
 * @param params - Object containing query parameters
 * @returns URL with query parameters appended
 *
 * @example
 * ```ts
 * appendQueryParams('/api/workflows', { page: 1 })
 * // Returns: "/api/workflows?page=1"
 * ```
 */
export function appendQueryParams(
  url: string,
  params: Record<string, any>,
): string {
  const queryString = buildQueryString(params);
  if (!queryString) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${queryString}`;
}
