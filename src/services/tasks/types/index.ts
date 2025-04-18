/**
 * Task service types
 */

/**
 * Task due date structure (standardized format)
 */
export interface TaskDueBO {
  date: string;
  timestamp: string;
  timezone: string;
}

/**
 * Task origin structure (standardized format)
 */
export interface TaskOriginBO {
  platformI18nName: string;
}

/**
 * Task information structure (standardized format)
 */
export interface TaskInfoBO {
  taskId: string;
  summary: string;
  description: string;
  due: TaskDueBO;
  creatorId: string;
  createTime: number;
  completeTime: number;
  status: string;
  origin: TaskOriginBO;
  customComplete: boolean;
  source: string;
}

/**
 * Task list structure (standardized format)
 */
export interface TaskListBO {
  tasks: TaskInfoBO[];
  pageToken: string;
  hasMore: boolean;
}

/**
 * Create task request structure (standardized format)
 */
export interface CreateTaskBO {
  summary: string;
  description?: string;
  due?: {
    date?: string;
    timestamp?: string;
    timezone?: string;
  };
  origin?: {
    platformI18nName?: string;
  };
  extra?: Record<string, unknown>;
}
