const mockPut = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      document: {
        document_id: 'test_doc_id',
        revision_id: 2,
        title: 'Updated Test Document',
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

import { DocumentClient } from '../src/client/documents/document-client.js';

describe('DocumentClient - Update Document', () => {
  let documentClient;

  beforeEach(() => {
    jest.clearAllMocks();
    documentClient = new DocumentClient();
  });

  describe('updateDocument', () => {
    it('should update a document with title only', async () => {
      const documentId = 'test_doc_id';
      const params = {
        title: 'Updated Test Document',
      };

      await documentClient.updateDocument(documentId, params);

      expect(mockPut).toHaveBeenCalledWith(
        `/open-apis/docx/v1/documents/${documentId}`,
        {
          title: params.title,
          folder_token: undefined,
        },
      );
    });

    it('should update a document with folder token only', async () => {
      const documentId = 'test_doc_id';
      const params = {
        folder_token: 'new_folder_token',
      };

      await documentClient.updateDocument(documentId, params);

      expect(mockPut).toHaveBeenCalledWith(
        `/open-apis/docx/v1/documents/${documentId}`,
        {
          title: undefined,
          folder_token: params.folder_token,
        },
      );
    });

    it('should update a document with all parameters', async () => {
      const documentId = 'test_doc_id';
      const params = {
        title: 'Updated Test Document',
        folder_token: 'new_folder_token',
      };

      await documentClient.updateDocument(documentId, params);

      expect(mockPut).toHaveBeenCalledWith(
        `/open-apis/docx/v1/documents/${documentId}`,
        {
          title: params.title,
          folder_token: params.folder_token,
        },
      );
    });

    it('should return the response from the API', async () => {
      const documentId = 'test_doc_id';
      const params = {
        title: 'Updated Test Document',
      };

      const response = await documentClient.updateDocument(documentId, params);

      expect(response).toEqual({
        code: 0,
        data: {
          document: {
            document_id: 'test_doc_id',
            revision_id: 2,
            title: 'Updated Test Document',
          },
        },
      });
    });
  });
});
