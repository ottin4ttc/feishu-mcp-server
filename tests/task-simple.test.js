const { TaskClient } = require('../src/client/tasks/task-client');

jest.mock('../src/client/api-client', () => {
  return {
    ApiClient: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn().mockResolvedValue({
          code: 0,
          data: {
            items: [{ task_id: 'task_123' }],
            page_token: 'next_page',
            has_more: false,
          },
        }),
        post: jest.fn().mockResolvedValue({
          code: 0,
          data: {
            task: { task_id: 'new_task_123' },
          },
        }),
      };
    }),
  };
});

describe('TaskClient', () => {
  test('should pass basic test', () => {
    expect(true).toBe(true);
  });
});
