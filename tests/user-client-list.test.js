const mockGet = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      has_more: false,
      page_token: 'next_page_token',
      items: [
        {
          union_id: 'on_abcdefg1',
          user_id: 'ou_abcdefg1',
          open_id: 'ou_openid1',
          name: 'Test User 1',
          en_name: 'Test User 1 EN',
          nickname: 'Tester 1',
          email: 'test1@example.com',
          mobile: '+1234567891',
          avatar: {
            avatar_72: 'https://example.com/avatar1_72.png',
            avatar_240: 'https://example.com/avatar1_240.png',
            avatar_640: 'https://example.com/avatar1_640.png',
            avatar_origin: 'https://example.com/avatar1_origin.png',
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
          enterprise_email: 'test1@enterprise.com',
          job_title: 'Software Engineer',
          is_tenant_manager: false,
          mobile_visible: true,
          email_visible: true,
        },
        {
          union_id: 'on_abcdefg2',
          user_id: 'ou_abcdefg2',
          open_id: 'ou_openid2',
          name: 'Test User 2',
          en_name: 'Test User 2 EN',
          nickname: 'Tester 2',
          email: 'test2@example.com',
          mobile: '+1234567892',
          avatar: {
            avatar_72: 'https://example.com/avatar2_72.png',
            avatar_240: 'https://example.com/avatar2_240.png',
            avatar_640: 'https://example.com/avatar2_640.png',
            avatar_origin: 'https://example.com/avatar2_origin.png',
          },
          status: {
            is_activated: true,
            is_frozen: false,
            is_resigned: false,
          },
          department_ids: ['dep_789'],
          leader_user_id: 'ou_leader',
          city: 'Beijing',
          country: 'China',
          work_station: 'Office B',
          join_time: 1609545600,
          employee_no: 'EMP002',
          employee_type: 1,
          gender: 2,
          enterprise_email: 'test2@enterprise.com',
          job_title: 'Product Manager',
          is_tenant_manager: false,
          mobile_visible: true,
          email_visible: true,
        },
      ],
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

describe('UserClient - Get User List', () => {
  let userClient;

  beforeEach(() => {
    jest.clearAllMocks();
    userClient = new UserClient();
  });

  describe('getUserList', () => {
    it('should get user list with the correct parameters', async () => {
      const departmentId = 'dep_123';
      const options = {
        pageSize: 20,
        pageToken: 'some_page_token',
      };

      await userClient.getUserList(departmentId, options);

      expect(mockGet).toHaveBeenCalledWith('/open-apis/contact/v3/users', {
        department_id: departmentId,
        pageSize: 20,
        pageToken: 'some_page_token',
      });
    });

    it('should work without pagination options', async () => {
      const departmentId = 'dep_123';

      await userClient.getUserList(departmentId);

      expect(mockGet).toHaveBeenCalledWith('/open-apis/contact/v3/users', {
        department_id: departmentId,
      });
    });

    it('should return the response from the API', async () => {
      const departmentId = 'dep_123';

      const response = await userClient.getUserList(departmentId);

      expect(response).toEqual({
        code: 0,
        data: {
          has_more: false,
          page_token: 'next_page_token',
          items: [
            {
              union_id: 'on_abcdefg1',
              user_id: 'ou_abcdefg1',
              open_id: 'ou_openid1',
              name: 'Test User 1',
              en_name: 'Test User 1 EN',
              nickname: 'Tester 1',
              email: 'test1@example.com',
              mobile: '+1234567891',
              avatar: {
                avatar_72: 'https://example.com/avatar1_72.png',
                avatar_240: 'https://example.com/avatar1_240.png',
                avatar_640: 'https://example.com/avatar1_640.png',
                avatar_origin: 'https://example.com/avatar1_origin.png',
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
              enterprise_email: 'test1@enterprise.com',
              job_title: 'Software Engineer',
              is_tenant_manager: false,
              mobile_visible: true,
              email_visible: true,
            },
            {
              union_id: 'on_abcdefg2',
              user_id: 'ou_abcdefg2',
              open_id: 'ou_openid2',
              name: 'Test User 2',
              en_name: 'Test User 2 EN',
              nickname: 'Tester 2',
              email: 'test2@example.com',
              mobile: '+1234567892',
              avatar: {
                avatar_72: 'https://example.com/avatar2_72.png',
                avatar_240: 'https://example.com/avatar2_240.png',
                avatar_640: 'https://example.com/avatar2_640.png',
                avatar_origin: 'https://example.com/avatar2_origin.png',
              },
              status: {
                is_activated: true,
                is_frozen: false,
                is_resigned: false,
              },
              department_ids: ['dep_789'],
              leader_user_id: 'ou_leader',
              city: 'Beijing',
              country: 'China',
              work_station: 'Office B',
              join_time: 1609545600,
              employee_no: 'EMP002',
              employee_type: 1,
              gender: 2,
              enterprise_email: 'test2@enterprise.com',
              job_title: 'Product Manager',
              is_tenant_manager: false,
              mobile_visible: true,
              email_visible: true,
            },
          ],
        },
      });
    });

    it('should handle API errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      const departmentId = 'dep_123';

      await expect(userClient.getUserList(departmentId)).rejects.toThrow(
        'API Error',
      );

      expect(mockGet).toHaveBeenCalledWith('/open-apis/contact/v3/users', {
        department_id: departmentId,
      });
    });
  });
});
