const mockPost = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      record: {
        record_id: 'recXXXXXXXXXXXX',
        fields: {
          Name: 'Test Record',
          Status: 'In Progress',
          Priority: 'High',
        },
      },
    },
  });
});

const MockApiClient = jest.fn().mockImplementation(() => {
  return {
    post: mockPost,
  };
});

jest.mock('../src/client/api-client.js', () => {
  return {
    ApiClient: MockApiClient,
  };
});

import { SheetClient } from '../src/client/sheets/sheet-client.js';

describe('SheetClient - Create Record', () => {
  let sheetClient;

  beforeEach(() => {
    jest.clearAllMocks();
    sheetClient = new SheetClient();
  });

  describe('createRecord', () => {
    it('should create a record with the correct parameters', async () => {
      const appToken = 'test_app_token';
      const tableId = 'test_table_id';
      const fields = {
        Name: 'Test Record',
        Status: 'In Progress',
        Priority: 'High',
      };

      await sheetClient.createRecord(appToken, tableId, fields);

      expect(mockPost).toHaveBeenCalledWith(
        `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
        { fields },
      );
    });

    it('should return the response from the API', async () => {
      const appToken = 'test_app_token';
      const tableId = 'test_table_id';
      const fields = {
        Name: 'Test Record',
        Status: 'In Progress',
        Priority: 'High',
      };

      const response = await sheetClient.createRecord(
        appToken,
        tableId,
        fields,
      );

      expect(response).toEqual({
        code: 0,
        data: {
          record: {
            record_id: 'recXXXXXXXXXXXX',
            fields: {
              Name: 'Test Record',
              Status: 'In Progress',
              Priority: 'High',
            },
          },
        },
      });
    });

    it('should handle API errors', async () => {
      mockPost.mockRejectedValueOnce(new Error('API Error'));

      const appToken = 'test_app_token';
      const tableId = 'test_table_id';
      const fields = {
        Name: 'Test Record',
      };

      await expect(
        sheetClient.createRecord(appToken, tableId, fields),
      ).rejects.toThrow('API Error');

      expect(mockPost).toHaveBeenCalledWith(
        `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
        { fields },
      );
    });
  });
});
