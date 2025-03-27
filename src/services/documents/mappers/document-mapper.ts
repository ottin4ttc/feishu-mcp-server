import type {
  DocumentContent,
  DocumentInfo,
} from '@/client/documents/types/index.js';
import type { DocumentContentBO, DocumentInfoBO } from '../types/index.js';

export class DocumentMapper {
  /**
   * Convert document content from API response to BO
   */
  toDocumentContentBO = (data: DocumentContent): DocumentContentBO => ({
    content: data.content ?? '',
  });

  /**
   * Convert document info from API response to BO
   */
  toDocumentInfoBO = (data: DocumentInfo): DocumentInfoBO => {
    if (!data.document) {
      throw new Error('Document info is empty');
    }

    const doc = data.document;
    if (!doc.document_id || !doc.revision_id || !doc.title) {
      throw new Error('Required document fields are missing');
    }

    return {
      id: doc.document_id,
      revisionId: doc.revision_id,
      title: doc.title,
    };
  };
}
