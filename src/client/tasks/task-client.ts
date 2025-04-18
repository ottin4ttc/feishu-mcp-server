/**
 * Task API Client
 */

import { ApiClient } from '../api-client.js';
import type { ApiResponse, PaginationOptions } from '../types.js';
import type {
  CreateTaskRequest,
  CreateTaskResponse,
  TaskInfoResponse,
  TaskListResponse,
} from './types/index.js';

/**
 * Client for FeiShu task operations
 */
export class TaskClient extends ApiClient {
  /**
   * Get task list
   *
   * @param options - Pagination options
   * @returns Task list
   */
  getTaskList = (
    options?: PaginationOptions,
  ): Promise<ApiResponse<TaskListResponse>> => {
    return this.get<TaskListResponse>('/open-apis/task/v1/tasks', {
      ...options,
    });
  };

  /**
   * Create task
   *
   * @param task - Task data
   * @returns Created task
   */
  createTask = (
    task: CreateTaskRequest,
  ): Promise<ApiResponse<CreateTaskResponse>> => {
    return this.post<CreateTaskResponse>('/open-apis/task/v1/tasks', task);
  };
}
