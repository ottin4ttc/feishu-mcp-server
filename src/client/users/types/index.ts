/**
 * User API Types
 */

/**
 * User information response
 */
export interface UserInfoResponse {
  user: {
    union_id: string;
    user_id: string;
    open_id: string;
    name: string;
    en_name: string;
    nickname: string;
    email: string;
    mobile: string;
    avatar: {
      avatar_72: string;
      avatar_240: string;
      avatar_640: string;
      avatar_origin: string;
    };
    status: {
      is_activated: boolean;
      is_frozen: boolean;
      is_resigned: boolean;
    };
    department_ids: string[];
    leader_user_id: string;
    city: string;
    country: string;
    work_station: string;
    join_time: number;
    employee_no: string;
    employee_type: number;
    gender: number;
    enterprise_email: string;
    job_title: string;
    is_tenant_manager: boolean;
    mobile_visible: boolean;
    email_visible: boolean;
  };
}

/**
 * User list response
 */
export interface UserListResponse {
  has_more: boolean;
  page_token: string;
  items: {
    union_id: string;
    user_id: string;
    open_id: string;
    name: string;
    en_name: string;
    nickname: string;
    email: string;
    mobile: string;
    avatar: {
      avatar_72: string;
      avatar_240: string;
      avatar_640: string;
      avatar_origin: string;
    };
    status: {
      is_activated: boolean;
      is_frozen: boolean;
      is_resigned: boolean;
    };
    department_ids: string[];
    leader_user_id: string;
    city: string;
    country: string;
    work_station: string;
    join_time: number;
    employee_no: string;
    employee_type: number;
    gender: number;
    enterprise_email: string;
    job_title: string;
    is_tenant_manager: boolean;
    mobile_visible: boolean;
    email_visible: boolean;
  }[];
}

/**
 * User search parameters
 */
export interface UserSearchParams {
  query: string;
  page_size?: number;
  page_token?: string;
}

/**
 * User search response
 */
export interface UserSearchResponse {
  has_more: boolean;
  page_token: string;
  items: {
    user_id: string;
    open_id: string;
    name: string;
    en_name: string;
    email: string;
    mobile: string;
    avatar: {
      avatar_url: string;
    };
    department_ids: string[];
    status: {
      is_activated: boolean;
      is_deactivated: boolean;
    };
  }[];
}
