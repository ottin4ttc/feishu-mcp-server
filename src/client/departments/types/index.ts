/**
 * Department API Types
 */

/**
 * Department information response
 */
export interface DepartmentInfoResponse {
  department: {
    department_id: string;
    parent_department_id: string;
    name: string;
    name_en: string;
    leader_user_id: string;
    chat_id: string;
    order: number;
    status: {
      is_deleted: boolean;
    };
    member_count: number;
    create_time: number;
    update_time: number;
  };
}

/**
 * Department list response
 */
export interface DepartmentListResponse {
  has_more: boolean;
  page_token: string;
  items: {
    department_id: string;
    parent_department_id: string;
    name: string;
    name_en: string;
    leader_user_id: string;
    chat_id: string;
    order: number;
    status: {
      is_deleted: boolean;
    };
    member_count: number;
    create_time: number;
    update_time: number;
  }[];
}
