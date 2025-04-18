import { jest } from '@jest/globals';

const mockGet = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      has_more: false,
      page_token: 'next_page_token',
      items: [
        {
          task_id: 'task_123',
          summary: 'Complete project report',
          description: 'Finish the quarterly project report',
          due: {
            date: '2023-01-15',
            timestamp: '1673740800000',
            timezone: 'Asia/Shanghai',
          },
          creator_id: 'user_123',
          create_time: 1609459200,
          complete_time: 0,
          status: 'active',
          origin: {
            platform_i18n_name: 'FeiShu',
          },
          custom_complete: false,
          source: 'feishu',
        },
        {
          task_id: 'task_456',
          summary: 'Review code changes',
          description: 'Review pull request #123',
          due: {
            date: '2023-01-20',
            timestamp: '1674172800000',
            timezone: 'Asia/Shanghai',
          },
          creator_id: 'user_456',
          create_time: 1609459300,
          complete_time: 1609459400,
          status: 'completed',
          origin: {
            platform_i18n_name: 'FeiShu',
          },
          custom_complete: true,
          source: 'feishu',
        },
      ],
    },
  });
});

jest.mock('../src/client/api-client.js', () => ({
  ApiClient: jest.fn().mockImplementation(() => ({
    get: mockGet,
  })),
}));

const TaskClient = jest.fn().mockImplementation(() => ({
  getTaskList: mockGet,
}));

describe('TaskClient - Get Task List', () => {
  let taskClient;

  beforeEach(() => {
    jest.clearAllMocks();
    taskClient = TaskClient();
  });

  describe('getTaskList', () => {
    it('should get task list with the correct parameters', async () => {
      const options = {
        pageSize: 20,
        pageToken: 'some_page_token',
      };

      await taskClient.getTaskList(options);

      expect(mockGet).toHaveBeenCalledWith('/open-apis/task/v1/tasks', {
        ...options,
      });
    });

    it('should work without pagination options', async () => {
      await taskClient.getTaskList();

      expect(mockGet).toHaveBeenCalledWith('/open-apis/task/v1/tasks', {});
    });

    it('should return the response from the API', async () => {
      const response = await taskClient.getTaskList();

      expect(response).toEqual({
        code: 0,
        data: {
          has_more: false,
          page_token: 'next_page_token',
          items: [
            {
              task_id: 'task_123',
              summary: 'Complete project report',
              description: 'Finish the quarterly project report',
              due: {
                date: '2023-01-15',
                timestamp: '1673740800000',
                timezone: 'Asia/Shanghai',
              },
              creator_id: 'user_123',
              create_time: 1609459200,
              complete_time: 0,
              status: 'active',
              origin: {
                platform_i18n_name: 'FeiShu',
              },
              custom_complete: false,
              source: 'feishu',
            },
            {
              task_id: 'task_456',
              summary: 'Review code changes',
              description: 'Review pull request #123',
              due: {
                date: '2023-01-20',
                timestamp: '1674172800000',
                timezone: 'Asia/Shanghai',
              },
              creator_id: 'user_456',
              create_time: 1609459300,
              complete_time: 1609459400,
              status: 'completed',
              origin: {
                platform_i18n_name: 'FeiShu',
              },
              custom_complete: true,
              source: 'feishu',
            },
          ],
        },
      });
    });

    it('should handle API errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      await expect(taskClient.getTaskList()).rejects.toThrow('API Error');

      expect(mockGet).toHaveBeenCalledWith('/open-apis/task/v1/tasks', {});
    });
  });
});
