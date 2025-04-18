import { jest } from '@jest/globals';

jest.mock('../src/client/api-client.js', () => {
  return {
    ApiClient: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn().mockImplementation((url, options) => {
          return Promise.resolve({
            code: 0,
            data: {
              items: [{ task_id: 'task_123' }],
              page_token: 'next_page',
              has_more: false,
            },
          });
        }),
        post: jest.fn().mockImplementation((url, data) => {
          return Promise.resolve({
            code: 0,
            data: {
              task: { task_id: 'new_task_123', ...data },
            },
          });
        }),
      };
    }),
  };
});

import { TaskClient } from '../src/client/tasks/task-client.js';

describe('TaskClient', () => {
  let taskClient;

  beforeEach(() => {
    taskClient = new TaskClient();
  });

  describe('getTaskList', () => {
    it('should return task list data', async () => {
      const result = await taskClient.getTaskList();
      expect(result.data.items).toBeDefined();
      expect(result.data.items.length).toBeGreaterThan(0);
    });
  });

  describe('createTask', () => {
    it('should return created task data', async () => {
      const taskData = { summary: 'Test Task' };
      const result = await taskClient.createTask(taskData);
      expect(result.data.task).toBeDefined();
      expect(result.data.task.task_id).toBeDefined();
    });
  });
});
