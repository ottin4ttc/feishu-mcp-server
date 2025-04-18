/**
 * Task Service
 */

import type { TaskClient } from '../../client/tasks/task-client.js';
import { FeiShuApiError } from '../error.js';
import type { CreateTaskBO, TaskInfoBO, TaskListBO } from './types/index.js';

/**
 * Service for FeiShu task operations
 */
export class TaskService {
  private client: TaskClient;

  /**
   * Create new task service
   */
  constructor(client: TaskClient) {
    this.client = client;
  }

  /**
   * Get task list
   *
   * @param pageSize - Page size
   * @param pageToken - Page token
   * @returns Task list
   */
  async getTaskList(
    pageSize?: number,
    pageToken?: string,
  ): Promise<TaskListBO> {
    try {
      const response = await this.client.getTaskList({
        pageSize,
        pageToken,
      });

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          response.msg || 'Failed to get task list',
          response.code || -1,
        );
      }

      const { items, page_token, has_more } = response.data;

      return {
        tasks: items.map((task) => ({
          taskId: task.task_id,
          summary: task.summary,
          description: task.description,
          due: {
            date: task.due.date,
            timestamp: task.due.timestamp,
            timezone: task.due.timezone,
          },
          creatorId: task.creator_id,
          createTime: task.create_time,
          completeTime: task.complete_time,
          status: task.status,
          origin: {
            platformI18nName: task.origin.platform_i18n_name,
          },
          customComplete: task.custom_complete,
          source: task.source,
        })),
        pageToken: page_token,
        hasMore: has_more,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }
      throw new FeiShuApiError(`Failed to get task list: ${error}`, -1);
    }
  }

  /**
   * Create task
   *
   * @param task - Task data
   * @returns Created task
   */
  async createTask(task: CreateTaskBO): Promise<TaskInfoBO> {
    try {
      const requestData = {
        summary: task.summary,
        description: task.description,
        due: task.due
          ? {
              date: task.due.date,
              timestamp: task.due.timestamp,
              timezone: task.due.timezone,
            }
          : undefined,
        origin: task.origin
          ? {
              platform_i18n_name: task.origin.platformI18nName,
            }
          : undefined,
        extra: task.extra,
      };

      const response = await this.client.createTask(requestData);

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          response.msg || 'Failed to create task',
          response.code || -1,
        );
      }

      const { task: createdTask } = response.data;

      return {
        taskId: createdTask.task_id,
        summary: createdTask.summary,
        description: createdTask.description,
        due: {
          date: createdTask.due.date,
          timestamp: createdTask.due.timestamp,
          timezone: createdTask.due.timezone,
        },
        creatorId: createdTask.creator_id,
        createTime: createdTask.create_time,
        completeTime: createdTask.complete_time,
        status: createdTask.status,
        origin: {
          platformI18nName: createdTask.origin.platform_i18n_name,
        },
        customComplete: createdTask.custom_complete,
        source: createdTask.source,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }
      throw new FeiShuApiError(`Failed to create task: ${error}`, -1);
    }
  }
}
