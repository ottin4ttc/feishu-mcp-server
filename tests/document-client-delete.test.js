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

import { DocumentClient } from '../src/client/documents/document-client.js';

describe('DocumentClient - Delete Document', () => {
  let documentClient;

  beforeEach(() => {
    jest.clearAllMocks();
    documentClient = new DocumentClient();
  });

  describe('deleteDocument', () => {
    it('should delete a document with the correct document ID', async () => {
      const documentId = 'test_doc_id';

      await documentClient.deleteDocument(documentId);

      expect(mockDelete).toHaveBeenCalledWith(
        `/open-apis/docx/v1/documents/${documentId}`,
      );
    });

    it('should return the response from the API', async () => {
      const documentId = 'test_doc_id';

      const response = await documentClient.deleteDocument(documentId);

      expect(response).toEqual({
        code: 0,
        data: {
          deleted: true,
        },
      });
    });

    it('should handle API errors', async () => {
      mockDelete.mockRejectedValueOnce(new Error('API Error'));

      const documentId = 'test_doc_id';

      await expect(documentClient.deleteDocument(documentId)).rejects.toThrow(
        'API Error',
      );

      expect(mockDelete).toHaveBeenCalledWith(
        `/open-apis/docx/v1/documents/${documentId}`,
      );
    });
  });
});
