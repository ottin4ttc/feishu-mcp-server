import { jest } from '@jest/globals';

const mockGet = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      items: [
        {
          document_id: 'doc_123',
          title: '项目计划文档',
          url: 'https://example.com/docs/doc_123',
          create_time: 1609459200,
          update_time: 1609459300,
          owner: 'user_123',
          type: 'docx',
        },
      ],
      page_token: 'next_page_token',
      has_more: false,
    },
  });
});

jest.mock('../src/client/api-client.js', () => ({
  ApiClient: jest.fn().mockImplementation(() => ({
    get: mockGet,
  })),
}));

import { DocumentClient } from '../src/client/documents/document-client.js';

describe('DocumentClient - Search Documents', () => {
  let documentClient;

  beforeEach(() => {
    jest.clearAllMocks();
    documentClient = new DocumentClient({
      appId: 'test-app-id',
      appSecret: 'test-app-secret',
    });
  });

  describe('searchDocuments', () => {
    it('should search documents with the correct parameters', async () => {
      const query = '项目计划';
      const options = {
        type: 'docx',
        pageSize: 20,
        pageToken: 'some_page_token',
      };

      await documentClient.searchDocuments(query, options);

      expect(mockGet).toHaveBeenCalledWith('/open-apis/search/v1/docs', {
        query,
        ...options,
      });
    });

    it('should work with only query parameter', async () => {
      const query = '项目计划';

      await documentClient.searchDocuments(query);

      expect(mockGet).toHaveBeenCalledWith('/open-apis/search/v1/docs', {
        query,
      });
    });

    it('should return the response from the API', async () => {
      const query = '项目计划';
      const response = await documentClient.searchDocuments(query);

      expect(response).toEqual({
        code: 0,
        data: {
          items: [
            {
              document_id: 'doc_123',
              title: '项目计划文档',
              url: 'https://example.com/docs/doc_123',
              create_time: 1609459200,
              update_time: 1609459300,
              owner: 'user_123',
              type: 'docx',
            },
          ],
          page_token: 'next_page_token',
          has_more: false,
        },
      });
    });

    it('should handle API errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      const query = '项目计划';

      await expect(documentClient.searchDocuments(query)).rejects.toThrow(
        'API Error',
      );

      expect(mockGet).toHaveBeenCalledWith('/open-apis/search/v1/docs', {
        query,
      });
    });
  });
});
