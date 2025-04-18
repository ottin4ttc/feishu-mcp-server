const mockPost = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      task: {
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
    },
  });
});

const MockApiClient = jest.fn().mockImplementation(() => {
  return {
    post: mockPost,
  };
});

jest.mock('../src/client/api-client.js', () => ({
  ApiClient: MockApiClient,
}));

jest.mock('../src/client/tasks/task-client.js', () => ({
  TaskClient: jest.fn().mockImplementation(() => ({
    createTask: mockPost,
  })),
}));

describe('TaskClient - Create Task', () => {
  let taskClient;

  beforeEach(() => {
    jest.clearAllMocks();
    taskClient = new TaskClient();
  });

  describe('createTask', () => {
    it('should create task with the correct parameters', async () => {
      const taskData = {
        summary: 'Complete project report',
        description: 'Finish the quarterly project report',
        due: {
          date: '2023-01-15',
          timestamp: '1673740800000',
          timezone: 'Asia/Shanghai',
        },
        origin: {
          platform_i18n_name: 'FeiShu',
        },
        extra: {
          priority: 'high',
        },
      };

      await taskClient.createTask(taskData);

      expect(mockPost).toHaveBeenCalledWith(
        '/open-apis/task/v1/tasks',
        taskData,
      );
    });

    it('should work with minimal required parameters', async () => {
      const taskData = {
        summary: 'Complete project report',
      };

      await taskClient.createTask(taskData);

      expect(mockPost).toHaveBeenCalledWith(
        '/open-apis/task/v1/tasks',
        taskData,
      );
    });

    it('should return the response from the API', async () => {
      const taskData = {
        summary: 'Complete project report',
      };

      const response = await taskClient.createTask(taskData);

      expect(response).toEqual({
        code: 0,
        data: {
          task: {
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
        },
      });
    });

    it('should handle API errors', async () => {
      mockPost.mockRejectedValueOnce(new Error('API Error'));

      const taskData = {
        summary: 'Complete project report',
      };

      await expect(taskClient.createTask(taskData)).rejects.toThrow(
        'API Error',
      );

      expect(mockPost).toHaveBeenCalledWith(
        '/open-apis/task/v1/tasks',
        taskData,
      );
    });
  });
});
