/**
 * Department Service
 */

import type { DepartmentClient } from '../../client/departments/department-client.js';
import { FeiShuApiError } from '../error.js';
import type { DepartmentInfoBO, DepartmentListBO } from './types/index.js';

/**
 * Service for FeiShu department operations
 */
export class DepartmentService {
  private client: DepartmentClient;

  /**
   * Create new department service
   */
  constructor(client: DepartmentClient) {
    this.client = client;
  }

  /**
   * Get department information
   *
   * @param departmentId - Department ID
   * @param departmentIdType - Department ID type (open_department_id, department_id)
   * @returns Department information
   */
  async getDepartmentInfo(
    departmentId: string,
    departmentIdType: 'open_department_id' | 'department_id' = 'department_id',
  ): Promise<DepartmentInfoBO> {
    try {
      const response = await this.client.getDepartmentInfo(
        departmentId,
        departmentIdType,
      );

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          response.msg || 'Failed to get department info',
          response.code || -1,
        );
      }

      const { department } = response.data;

      return {
        departmentId: department.department_id,
        parentDepartmentId: department.parent_department_id,
        name: department.name,
        nameEn: department.name_en,
        leaderUserId: department.leader_user_id,
        chatId: department.chat_id,
        order: department.order,
        status: {
          isDeleted: department.status.is_deleted,
        },
        memberCount: department.member_count,
        createTime: department.create_time,
        updateTime: department.update_time,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }
      throw new FeiShuApiError(`Failed to get department info: ${error}`, -1);
    }
  }

  /**
   * Get department list
   *
   * @param parentDepartmentId - Parent department ID
   * @param pageSize - Page size
   * @param pageToken - Page token
   * @returns Department list
   */
  async getDepartmentList(
    parentDepartmentId?: string,
    pageSize?: number,
    pageToken?: string,
  ): Promise<DepartmentListBO> {
    try {
      const response = await this.client.getDepartmentList(parentDepartmentId, {
        pageSize,
        pageToken,
      });

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          response.msg || 'Failed to get department list',
          response.code || -1,
        );
      }

      const { items, page_token, has_more } = response.data;

      return {
        departments: items.map((department) => ({
          departmentId: department.department_id,
          parentDepartmentId: department.parent_department_id,
          name: department.name,
          nameEn: department.name_en,
          leaderUserId: department.leader_user_id,
          chatId: department.chat_id,
          order: department.order,
          status: {
            isDeleted: department.status.is_deleted,
          },
          memberCount: department.member_count,
          createTime: department.create_time,
          updateTime: department.update_time,
        })),
        pageToken: page_token,
        hasMore: has_more,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }
      throw new FeiShuApiError(`Failed to get department list: ${error}`, -1);
    }
  }
}
