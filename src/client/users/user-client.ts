/**
 * User API Client
 */

import { ApiClient } from '../api-client.js';
import type { ApiResponse, PaginationOptions } from '../types.js';
import type { UserInfoResponse, UserListResponse } from './types/index.js';

/**
 * Client for FeiShu user operations
 */
export class UserClient extends ApiClient {
  /**
   * Get user information
   *
   * @param userId - User ID
   * @param userIdType - User ID type (open_id, union_id, user_id)
   * @returns User information
   */
  getUserInfo = (
    userId: string,
    userIdType: 'open_id' | 'union_id' | 'user_id' = 'open_id',
  ): Promise<ApiResponse<UserInfoResponse>> => {
    return this.get<UserInfoResponse>(`/open-apis/contact/v3/users/${userId}`, {
      user_id_type: userIdType,
    });
  };

  /**
   * Get user list
   *
   * @param departmentId - Department ID
   * @param options - Pagination options
   * @returns User list
   */
  getUserList = (
    departmentId: string,
    options?: PaginationOptions,
  ): Promise<ApiResponse<UserListResponse>> => {
    return this.get<UserListResponse>('/open-apis/contact/v3/users', {
      department_id: departmentId,
      ...options,
    });
  };
}
