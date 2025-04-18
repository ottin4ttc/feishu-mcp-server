/**
 * Department API Client
 */

import { ApiClient } from '../api-client.js';
import type { ApiResponse, PaginationOptions } from '../types.js';
import type {
  DepartmentInfoResponse,
  DepartmentListResponse,
} from './types/index.js';

/**
 * Client for FeiShu department operations
 */
export class DepartmentClient extends ApiClient {
  /**
   * Get department information
   *
   * @param departmentId - Department ID
   * @param departmentIdType - Department ID type (open_department_id, department_id)
   * @returns Department information
   */
  getDepartmentInfo = (
    departmentId: string,
    departmentIdType: 'open_department_id' | 'department_id' = 'department_id',
  ): Promise<ApiResponse<DepartmentInfoResponse>> => {
    return this.get<DepartmentInfoResponse>(
      `/open-apis/contact/v3/departments/${departmentId}`,
      { department_id_type: departmentIdType },
    );
  };

  /**
   * Get department list
   *
   * @param parentDepartmentId - Parent department ID
   * @param options - Pagination options
   * @returns Department list
   */
  getDepartmentList = (
    parentDepartmentId?: string,
    options?: PaginationOptions,
  ): Promise<ApiResponse<DepartmentListResponse>> => {
    return this.get<DepartmentListResponse>(
      '/open-apis/contact/v3/departments',
      {
        parent_department_id: parentDepartmentId,
        ...options,
      },
    );
  };
}
