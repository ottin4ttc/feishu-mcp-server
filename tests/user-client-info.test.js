const mockGet = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      user: {
        union_id: 'on_abcdefg',
        user_id: 'ou_abcdefg',
        open_id: 'ou_openid',
        name: 'Test User',
        en_name: 'Test User EN',
        nickname: 'Tester',
        email: 'test@example.com',
        mobile: '+1234567890',
        avatar: {
          avatar_72: 'https://example.com/avatar_72.png',
          avatar_240: 'https://example.com/avatar_240.png',
          avatar_640: 'https://example.com/avatar_640.png',
          avatar_origin: 'https://example.com/avatar_origin.png',
        },
        status: {
          is_activated: true,
          is_frozen: false,
          is_resigned: false,
        },
        department_ids: ['dep_123', 'dep_456'],
        leader_user_id: 'ou_leader',
        city: 'Shanghai',
        country: 'China',
        work_station: 'Office A',
        join_time: 1609459200,
        employee_no: 'EMP001',
        employee_type: 1,
        gender: 1,
        enterprise_email: 'test@enterprise.com',
        job_title: 'Software Engineer',
        is_tenant_manager: false,
        mobile_visible: true,
        email_visible: true,
      },
    },
  });
});

const MockApiClient = jest.fn().mockImplementation(() => {
  return {
    get: mockGet,
  };
});

jest.mock('../src/client/api-client.js', () => {
  return {
    ApiClient: MockApiClient,
  };
});

import { UserClient } from '../src/client/users/user-client.js';

describe('UserClient - Get User Info', () => {
  let userClient;

  beforeEach(() => {
    jest.clearAllMocks();
    userClient = new UserClient();
  });

  describe('getUserInfo', () => {
    it('should get user info with the correct parameters', async () => {
      const userId = 'ou_abcdefg';
      const userIdType = 'user_id';

      await userClient.getUserInfo(userId, userIdType);

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/contact/v3/users/${userId}`,
        { user_id_type: userIdType },
      );
    });

    it('should use open_id as the default user ID type', async () => {
      const userId = 'ou_openid';

      await userClient.getUserInfo(userId);

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/contact/v3/users/${userId}`,
        { user_id_type: 'open_id' },
      );
    });

    it('should return the response from the API', async () => {
      const userId = 'ou_abcdefg';
      const userIdType = 'user_id';

      const response = await userClient.getUserInfo(userId, userIdType);

      expect(response).toEqual({
        code: 0,
        data: {
          user: {
            union_id: 'on_abcdefg',
            user_id: 'ou_abcdefg',
            open_id: 'ou_openid',
            name: 'Test User',
            en_name: 'Test User EN',
            nickname: 'Tester',
            email: 'test@example.com',
            mobile: '+1234567890',
            avatar: {
              avatar_72: 'https://example.com/avatar_72.png',
              avatar_240: 'https://example.com/avatar_240.png',
              avatar_640: 'https://example.com/avatar_640.png',
              avatar_origin: 'https://example.com/avatar_origin.png',
            },
            status: {
              is_activated: true,
              is_frozen: false,
              is_resigned: false,
            },
            department_ids: ['dep_123', 'dep_456'],
            leader_user_id: 'ou_leader',
            city: 'Shanghai',
            country: 'China',
            work_station: 'Office A',
            join_time: 1609459200,
            employee_no: 'EMP001',
            employee_type: 1,
            gender: 1,
            enterprise_email: 'test@enterprise.com',
            job_title: 'Software Engineer',
            is_tenant_manager: false,
            mobile_visible: true,
            email_visible: true,
          },
        },
      });
    });

    it('should handle API errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      const userId = 'ou_abcdefg';

      await expect(userClient.getUserInfo(userId)).rejects.toThrow('API Error');

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/contact/v3/users/${userId}`,
        { user_id_type: 'open_id' },
      );
    });
  });
});
