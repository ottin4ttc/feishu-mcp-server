/**
 * Department service types
 */

/**
 * Department information structure (standardized format)
 */
export interface DepartmentInfoBO {
  departmentId: string;
  parentDepartmentId: string;
  name: string;
  nameEn: string;
  leaderUserId: string;
  chatId: string;
  order: number;
  status: {
    isDeleted: boolean;
  };
  memberCount: number;
  createTime: number;
  updateTime: number;
}

/**
 * Department list structure (standardized format)
 */
export interface DepartmentListBO {
  departments: DepartmentInfoBO[];
  pageToken: string;
  hasMore: boolean;
}
