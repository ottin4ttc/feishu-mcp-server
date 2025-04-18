const mockGet = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      department: {
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

describe('DepartmentClient - Get Department Info', () => {
  let departmentClient;

  beforeEach(() => {
    jest.clearAllMocks();
    departmentClient = new DepartmentClient();
  });

  describe('getDepartmentInfo', () => {
    it('should get department info with the correct parameters', async () => {
      const departmentId = 'dep_123';
      const departmentIdType = 'department_id';

      await departmentClient.getDepartmentInfo(departmentId, departmentIdType);

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/contact/v3/departments/${departmentId}`,
        { department_id_type: departmentIdType },
      );
    });

    it('should use department_id as the default department ID type', async () => {
      const departmentId = 'dep_123';

      await departmentClient.getDepartmentInfo(departmentId);

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/contact/v3/departments/${departmentId}`,
        { department_id_type: 'department_id' },
      );
    });

    it('should return the response from the API', async () => {
      const departmentId = 'dep_123';
      const departmentIdType = 'department_id';

      const response = await departmentClient.getDepartmentInfo(
        departmentId,
        departmentIdType,
      );

      expect(response).toEqual({
        code: 0,
        data: {
          department: {
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
        },
      });
    });

    it('should handle API errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      const departmentId = 'dep_123';

      await expect(
        departmentClient.getDepartmentInfo(departmentId),
      ).rejects.toThrow('API Error');

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/contact/v3/departments/${departmentId}`,
        { department_id_type: 'department_id' },
      );
    });
  });
});
