const mockGet = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      items: [
        {
          block_id: 'block1',
          parent_id: 'parent1',
          block_type: 'text',
          text: {
            content: 'This is a text block',
            elements: [
              {
                type: 'text_run',
                text_run: {
                  content: 'This is a text block',
                  text_element_style: {
                    bold: true,
                    italic: false,
                    underline: false,
                    strike_through: false,
                  },
                },
              },
            ],
          },
        },
        {
          block_id: 'block2',
          parent_id: 'parent1',
          block_type: 'heading1',
          heading1: {
            content: 'This is a heading',
            elements: [],
          },
        },
        {
          block_id: 'block3',
          parent_id: 'parent1',
          block_type: 'code',
          code: {
            content: 'console.log("Hello World");',
            language: 'javascript',
          },
        },
      ],
      page_token: 'next_page_token',
      has_more: true,
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

import { DocumentClient } from '../src/client/documents/document-client.js';

describe('DocumentClient - Get Document Blocks', () => {
  let documentClient;

  beforeEach(() => {
    jest.clearAllMocks();
    documentClient = new DocumentClient();
  });

  describe('getDocumentBlocks', () => {
    it('should get document blocks with the correct document ID', async () => {
      const documentId = 'test_doc_id';

      await documentClient.getDocumentBlocks(documentId);

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/docx/v1/documents/${documentId}/blocks`,
        undefined,
      );
    });

    it('should get document blocks with pagination parameters', async () => {
      const documentId = 'test_doc_id';
      const params = {
        page_size: 10,
        page_token: 'test_page_token',
      };

      await documentClient.getDocumentBlocks(documentId, params);

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/docx/v1/documents/${documentId}/blocks`,
        params,
      );
    });

    it('should return the response from the API', async () => {
      const documentId = 'test_doc_id';

      const response = await documentClient.getDocumentBlocks(documentId);

      expect(response).toEqual({
        code: 0,
        data: {
          items: [
            {
              block_id: 'block1',
              parent_id: 'parent1',
              block_type: 'text',
              text: {
                content: 'This is a text block',
                elements: [
                  {
                    type: 'text_run',
                    text_run: {
                      content: 'This is a text block',
                      text_element_style: {
                        bold: true,
                        italic: false,
                        underline: false,
                        strike_through: false,
                      },
                    },
                  },
                ],
              },
            },
            {
              block_id: 'block2',
              parent_id: 'parent1',
              block_type: 'heading1',
              heading1: {
                content: 'This is a heading',
                elements: [],
              },
            },
            {
              block_id: 'block3',
              parent_id: 'parent1',
              block_type: 'code',
              code: {
                content: 'console.log("Hello World");',
                language: 'javascript',
              },
            },
          ],
          page_token: 'next_page_token',
          has_more: true,
        },
      });
    });

    it('should handle API errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      const documentId = 'test_doc_id';

      await expect(
        documentClient.getDocumentBlocks(documentId),
      ).rejects.toThrow('API Error');

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/docx/v1/documents/${documentId}/blocks`,
        undefined,
      );
    });
  });
});
