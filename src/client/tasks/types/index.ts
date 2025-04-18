/**
 * Task API Types
 */

/**
 * Task information response
 */
export interface TaskInfoResponse {
  task: {
    task_id: string;
    summary: string;
    description: string;
    due: {
      date: string;
      timestamp: string;
      timezone: string;
    };
    creator_id: string;
    create_time: number;
    complete_time: number;
    status: string;
    origin: {
      platform_i18n_name: string;
    };
    custom_complete: boolean;
    source: string;
  };
}

/**
 * Task list response
 */
export interface TaskListResponse {
  has_more: boolean;
  page_token: string;
  items: {
    task_id: string;
    summary: string;
    description: string;
    due: {
      date: string;
      timestamp: string;
      timezone: string;
    };
    creator_id: string;
    create_time: number;
    complete_time: number;
    status: string;
    origin: {
      platform_i18n_name: string;
    };
    custom_complete: boolean;
    source: string;
  }[];
}

/**
 * Create task request
 */
export interface CreateTaskRequest {
  summary: string;
  description?: string;
  due?: {
    date?: string;
    timestamp?: string;
    timezone?: string;
  };
  origin?: {
    platform_i18n_name?: string;
  };
  extra?: Record<string, unknown>;
}

/**
 * Create task response
 */
export interface CreateTaskResponse {
  task: {
    task_id: string;
    summary: string;
    description: string;
    due: {
      date: string;
      timestamp: string;
      timezone: string;
    };
    creator_id: string;
    create_time: number;
    complete_time: number;
    status: string;
    origin: {
      platform_i18n_name: string;
    };
    custom_complete: boolean;
    source: string;
  };
}
