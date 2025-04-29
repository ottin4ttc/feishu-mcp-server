/**
 * User service types
 */

/**
 * User information structure (standardized format)
 */
export interface UserInfoBO {
  unionId: string;
  userId: string;
  openId: string;
  name: string;
  enName: string;
  nickname: string;
  email: string;
  mobile: string;
  avatar: {
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  status: {
    isActivated: boolean;
    isFrozen: boolean;
    isResigned: boolean;
  };
  departmentIds: string[];
  leaderUserId: string;
  city: string;
  country: string;
  workStation: string;
  joinTime: number;
  employeeNo: string;
  employeeType: number;
  gender: number;
  enterpriseEmail: string;
  jobTitle: string;
  isTenantManager: boolean;
  mobileVisible: boolean;
  emailVisible: boolean;
}

/**
 * User list structure (standardized format)
 */
export interface UserListBO {
  users: UserInfoBO[];
  pageToken: string;
  hasMore: boolean;
}

/**
 * User search result structure (standardized format)
 */
export interface UserSearchBO {
  users: {
    userId: string;
    openId: string;
    name: string;
    enName: string;
    email: string;
    avatarUrl: string;
    departmentIds: string[];
    status: {
      isActivated: boolean;
      isDeactivated: boolean;
    };
  }[];
  pageToken: string;
  hasMore: boolean;
}
