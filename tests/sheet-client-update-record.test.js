const mockPut = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      record: {
        record_id: 'recXXXXXXXXXXXX',
        fields: {
          Name: 'Updated Record',
          Status: 'Completed',
          Priority: 'Medium',
        },
      },
    },
  });
});

const MockApiClient = jest.fn().mockImplementation(() => {
  return {
    put: mockPut,
  };
});

jest.mock('../src/client/api-client.js', () => {
  return {
    ApiClient: MockApiClient,
  };
});

import { SheetClient } from '../src/client/sheets/sheet-client.js';

describe('SheetClient - Update Record', () => {
  let sheetClient;

  beforeEach(() => {
    jest.clearAllMocks();
    sheetClient = new SheetClient();
  });

  describe('updateRecord', () => {
    it('should update a record with the correct parameters', async () => {
      const appToken = 'test_app_token';
      const tableId = 'test_table_id';
      const recordId = 'recXXXXXXXXXXXX';
      const fields = {
        Name: 'Updated Record',
        Status: 'Completed',
        Priority: 'Medium',
      };

      await sheetClient.updateRecord(appToken, tableId, recordId, fields);

      expect(mockPut).toHaveBeenCalledWith(
        `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`,
        { fields },
      );
    });

    it('should return the response from the API', async () => {
      const appToken = 'test_app_token';
      const tableId = 'test_table_id';
      const recordId = 'recXXXXXXXXXXXX';
      const fields = {
        Name: 'Updated Record',
        Status: 'Completed',
        Priority: 'Medium',
      };

      const response = await sheetClient.updateRecord(
        appToken,
        tableId,
        recordId,
        fields,
      );

      expect(response).toEqual({
        code: 0,
        data: {
          record: {
            record_id: 'recXXXXXXXXXXXX',
            fields: {
              Name: 'Updated Record',
              Status: 'Completed',
              Priority: 'Medium',
            },
          },
        },
      });
    });

    it('should handle API errors', async () => {
      mockPut.mockRejectedValueOnce(new Error('API Error'));

      const appToken = 'test_app_token';
      const tableId = 'test_table_id';
      const recordId = 'recXXXXXXXXXXXX';
      const fields = {
        Name: 'Updated Record',
      };

      await expect(
        sheetClient.updateRecord(appToken, tableId, recordId, fields),
      ).rejects.toThrow('API Error');

      expect(mockPut).toHaveBeenCalledWith(
        `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`,
        { fields },
      );
    });
  });
});
