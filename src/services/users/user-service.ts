/**
 * User Service
 */

import type { PaginationOptions } from '../../client/types.js';
import type { UserClient } from '../../client/users/user-client.js';
import { FeiShuApiError } from '../error.js';
import type { UserInfoBO, UserListBO, UserSearchBO } from './types/index.js';

/**
 * Service for FeiShu user operations
 */
export class UserService {
  private client: UserClient;

  /**
   * Create new user service
   */
  constructor(client: UserClient) {
    this.client = client;
  }

  /**
   * Get user information
   *
   * @param userId - User ID
   * @param userIdType - User ID type (open_id, union_id, user_id)
   * @returns User information
   */
  async getUserInfo(
    userId: string,
    userIdType: 'open_id' | 'union_id' | 'user_id' = 'open_id',
  ): Promise<UserInfoBO> {
    try {
      const response = await this.client.getUserInfo(userId, userIdType);

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          response.msg || 'Failed to get user info',
          response.code || -1,
        );
      }

      const { user } = response.data;

      return {
        unionId: user.union_id,
        userId: user.user_id,
        openId: user.open_id,
        name: user.name,
        enName: user.en_name,
        nickname: user.nickname,
        email: user.email,
        mobile: user.mobile,
        avatar: {
          small: user.avatar.avatar_72,
          medium: user.avatar.avatar_240,
          large: user.avatar.avatar_640,
          original: user.avatar.avatar_origin,
        },
        status: {
          isActivated: user.status.is_activated,
          isFrozen: user.status.is_frozen,
          isResigned: user.status.is_resigned,
        },
        departmentIds: user.department_ids,
        leaderUserId: user.leader_user_id,
        city: user.city,
        country: user.country,
        workStation: user.work_station,
        joinTime: user.join_time,
        employeeNo: user.employee_no,
        employeeType: user.employee_type,
        gender: user.gender,
        enterpriseEmail: user.enterprise_email,
        jobTitle: user.job_title,
        isTenantManager: user.is_tenant_manager,
        mobileVisible: user.mobile_visible,
        emailVisible: user.email_visible,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }
      throw new FeiShuApiError(`Failed to get user info: ${error}`, -1);
    }
  }

  /**
   * Get user list
   *
   * @param departmentId - Department ID
   * @param pageSize - Page size
   * @param pageToken - Page token
   * @returns User list
   */
  async getUserList(
    departmentId: string,
    pageSize?: number,
    pageToken?: string,
  ): Promise<UserListBO> {
    try {
      const response = await this.client.getUserList(departmentId, {
        pageSize,
        pageToken,
      });

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          response.msg || 'Failed to get user list',
          response.code || -1,
        );
      }

      const { items, page_token, has_more } = response.data;

      return {
        users: items.map((user) => ({
          unionId: user.union_id,
          userId: user.user_id,
          openId: user.open_id,
          name: user.name,
          enName: user.en_name,
          nickname: user.nickname,
          email: user.email,
          mobile: user.mobile,
          avatar: {
            small: user.avatar.avatar_72,
            medium: user.avatar.avatar_240,
            large: user.avatar.avatar_640,
            original: user.avatar.avatar_origin,
          },
          status: {
            isActivated: user.status.is_activated,
            isFrozen: user.status.is_frozen,
            isResigned: user.status.is_resigned,
          },
          departmentIds: user.department_ids,
          leaderUserId: user.leader_user_id,
          city: user.city,
          country: user.country,
          workStation: user.work_station,
          joinTime: user.join_time,
          employeeNo: user.employee_no,
          employeeType: user.employee_type,
          gender: user.gender,
          enterpriseEmail: user.enterprise_email,
          jobTitle: user.job_title,
          isTenantManager: user.is_tenant_manager,
          mobileVisible: user.mobile_visible,
          emailVisible: user.email_visible,
        })),
        pageToken: page_token,
        hasMore: has_more,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }
      throw new FeiShuApiError(`Failed to get user list: ${error}`, -1);
    }
  }

  /**
   * Search users by keyword
   *
   * @param query - Search keywords
   * @param options - Pagination options
   * @returns User search results in business object format
   */
  async searchUsers(
    query: string,
    options?: PaginationOptions,
  ): Promise<UserSearchBO> {
    try {
      const response = await this.client.searchUsers(query, options);

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          `Failed to search users: ${response.msg || 'Unknown error'}`,
          response.code || -1,
        );
      }

      return {
        users: response.data.items.map((item) => ({
          userId: item.user_id || '',
          openId: item.open_id || '',
          name: item.name || '',
          enName: item.en_name || '',
          email: item.email || '',
          avatarUrl: item.avatar?.avatar_url || '',
          departmentIds: item.department_ids || [],
          status: {
            isActivated: item.status?.is_activated || false,
            isDeactivated: item.status?.is_deactivated || false,
          },
        })),
        pageToken: response.data.page_token || '',
        hasMore: response.data.has_more || false,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }
      throw new FeiShuApiError(
        `Failed to search users: ${(error as Error).message}`,
        -1,
      );
    }
  }
}
