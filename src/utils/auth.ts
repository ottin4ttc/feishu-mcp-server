/**
 * Authentication utilities
 */

import { API_ENDPOINT } from '../consts/index.js';

/**
 * Generate authorization URL for the OAuth flow
 *
 * @param appId - Application ID
 * @param redirectUri - Redirect URI
 * @param state - State parameter for security
 * @returns Authorization URL
 */
export function generateAuthorizationUrl(
  appId: string,
  redirectUri: string,
  state?: string,
): string {
  const params = new URLSearchParams({
    app_id: appId,
    redirect_uri: redirectUri,
  });

  if (state) params.append('state', state);

  return `${API_ENDPOINT}/open-apis/authen/v1/index?${params.toString()}`;
}
