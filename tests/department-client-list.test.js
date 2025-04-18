const mockGet = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      has_more: false,
      page_token: 'next_page_token',
      items: [
        {
          department_id: 'dep_123',
          parent_department_id: 'dep_parent',
          name: 'Engineering',
          name_en: 'Engineering',
          leader_user_id: 'ou_leader',
          chat_id: 'oc_abcdef',
          order: 100,
          status: {
            is_deleted: false,
          },
          member_count: 42,
          create_time: 1609459200,
          update_time: 1609545600,
        },
        {
          department_id: 'dep_456',
          parent_department_id: 'dep_parent',
          name: 'Product',
          name_en: 'Product',
          leader_user_id: 'ou_leader2',
          chat_id: 'oc_ghijkl',
          order: 200,
          status: {
            is_deleted: false,
          },
          member_count: 15,
          create_time: 1609459300,
          update_time: 1609545700,
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

import { DepartmentClient } from '../src/client/departments/department-client.js';

describe('DepartmentClient - Get Department List', () => {
  let departmentClient;

  beforeEach(() => {
    jest.clearAllMocks();
    departmentClient = new DepartmentClient();
  });

  describe('getDepartmentList', () => {
    it('should get department list with the correct parameters', async () => {
      const parentDepartmentId = 'dep_parent';
      const options = {
        pageSize: 20,
        pageToken: 'some_page_token',
      };

      await departmentClient.getDepartmentList(parentDepartmentId, options);

      expect(mockGet).toHaveBeenCalledWith(
        '/open-apis/contact/v3/departments',
        {
          parent_department_id: parentDepartmentId,
          pageSize: 20,
          pageToken: 'some_page_token',
        },
      );
    });

    it('should work without parent department ID', async () => {
      const options = {
        pageSize: 20,
        pageToken: 'some_page_token',
      };

      await departmentClient.getDepartmentList(undefined, options);

      expect(mockGet).toHaveBeenCalledWith(
        '/open-apis/contact/v3/departments',
        {
          parent_department_id: undefined,
          pageSize: 20,
          pageToken: 'some_page_token',
        },
      );
    });

    it('should work without pagination options', async () => {
      const parentDepartmentId = 'dep_parent';

      await departmentClient.getDepartmentList(parentDepartmentId);

      expect(mockGet).toHaveBeenCalledWith(
        '/open-apis/contact/v3/departments',
        {
          parent_department_id: parentDepartmentId,
        },
      );
    });

    it('should return the response from the API', async () => {
      const parentDepartmentId = 'dep_parent';

      const response =
        await departmentClient.getDepartmentList(parentDepartmentId);

      expect(response).toEqual({
        code: 0,
        data: {
          has_more: false,
          page_token: 'next_page_token',
          items: [
            {
              department_id: 'dep_123',
              parent_department_id: 'dep_parent',
              name: 'Engineering',
              name_en: 'Engineering',
              leader_user_id: 'ou_leader',
              chat_id: 'oc_abcdef',
              order: 100,
              status: {
                is_deleted: false,
              },
              member_count: 42,
              create_time: 1609459200,
              update_time: 1609545600,
            },
            {
              department_id: 'dep_456',
              parent_department_id: 'dep_parent',
              name: 'Product',
              name_en: 'Product',
              leader_user_id: 'ou_leader2',
              chat_id: 'oc_ghijkl',
              order: 200,
              status: {
                is_deleted: false,
              },
              member_count: 15,
              create_time: 1609459300,
              update_time: 1609545700,
            },
          ],
        },
      });
    });

    it('should handle API errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      const parentDepartmentId = 'dep_parent';

      await expect(
        departmentClient.getDepartmentList(parentDepartmentId),
      ).rejects.toThrow('API Error');

      expect(mockGet).toHaveBeenCalledWith(
        '/open-apis/contact/v3/departments',
        {
          parent_department_id: parentDepartmentId,
        },
      );
    });
  });
});
