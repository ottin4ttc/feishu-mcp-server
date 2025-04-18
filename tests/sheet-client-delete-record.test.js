const mockDelete = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      deleted: true,
    },
  });
});

const MockApiClient = jest.fn().mockImplementation(() => {
  return {
    delete: mockDelete,
  };
});

jest.mock('../src/client/api-client.js', () => {
  return {
    ApiClient: MockApiClient,
  };
});

import { SheetClient } from '../src/client/sheets/sheet-client.js';

describe('SheetClient - Delete Record', () => {
  let sheetClient;

  beforeEach(() => {
    jest.clearAllMocks();
    sheetClient = new SheetClient();
  });

  describe('deleteRecord', () => {
    it('should delete a record with the correct parameters', async () => {
      const appToken = 'test_app_token';
      const tableId = 'test_table_id';
      const recordId = 'recXXXXXXXXXXXX';

      await sheetClient.deleteRecord(appToken, tableId, recordId);

      expect(mockDelete).toHaveBeenCalledWith(
        `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`,
      );
    });

    it('should return the response from the API', async () => {
      const appToken = 'test_app_token';
      const tableId = 'test_table_id';
      const recordId = 'recXXXXXXXXXXXX';

      const response = await sheetClient.deleteRecord(
        appToken,
        tableId,
        recordId,
      );

      expect(response).toEqual({
        code: 0,
        data: {
          deleted: true,
        },
      });
    });

    it('should handle API errors', async () => {
      mockDelete.mockRejectedValueOnce(new Error('API Error'));

      const appToken = 'test_app_token';
      const tableId = 'test_table_id';
      const recordId = 'recXXXXXXXXXXXX';

      await expect(
        sheetClient.deleteRecord(appToken, tableId, recordId),
      ).rejects.toThrow('API Error');

      expect(mockDelete).toHaveBeenCalledWith(
        `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`,
      );
    });
  });
});
