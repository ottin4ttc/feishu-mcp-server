/**
 * Sheet Service
 *
 * Business logic for interacting with FeiShu Sheets (Bitable)
 */

import type { ApiClientConfig } from '@/client/api-client.js';
import { SheetClient } from '@/client/sheets/sheet-client.js';
import type {
  ViewData as ClientViewInfo,
  RecordData,
  RecordsListData,
  TableData,
} from '@/client/sheets/sheet-client.js';
import { FeiShuApiError } from '@/services/error.js';

/**
 * Sheet metadata structure (standardized format)
 */
export interface SheetMetadata {
  id: string;
  name: string;
  revision: number;
  description: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  permissions: {
    view: boolean;
    edit: boolean;
    manage: boolean;
  };
}

/**
 * View information structure (standardized format)
 */
export interface ViewInfo {
  id: string;
  name: string;
  type: string;
  property: Record<string, unknown>;
}

/**
 * View information structure (standardized format)
 */
export interface RecordInfo {
  id: string;
  fields: Record<string, unknown>;
}

/**
 * Tables list structure (standardized format)
 */
export interface TablesList {
  tables: TableData[];
  hasMore: boolean;
  pageToken: string;
  total: number;
}

/**
 * Views list structure (standardized format)
 */
export interface ViewsList {
  views: ViewInfo[];
  hasMore: boolean;
  pageToken: string;
  total: number;
}

/**
 * Record list structure (standardized format)
 */
export interface RecordList {
  records: RecordInfo[];
  hasMore: boolean;
  pageToken: string;
  total: number;
}

/**
 * Service for interacting with FeiShu Sheets
 */
export class SheetService {
  private client: SheetClient;

  /**
   * Initialize the Sheet service
   *
   * @param config - API client configuration
   */
  constructor(config: ApiClientConfig) {
    this.client = new SheetClient(config);
  }

  /**
   * Get metadata for a Bitable (Sheet)
   *
   * @param appToken - The ID of the Bitable
   * @returns Sheet metadata in a standardized format
   * @throws FeiShuApiError if the request fails or returns empty data
   */
  async getSheetMetadata(appToken: string): Promise<SheetMetadata> {
    try {
      const response = await this.client.getSheetMeta(appToken);

      if (response.code !== 0 || !response.data || !response.data.app) {
        throw new FeiShuApiError(
          `Failed to get sheet metadata: ${response.msg || 'Unknown error'}`,
          response.code,
        );
      }

      const appData = response.data.app;

      // Transform to standardized format
      return {
        id: appData.app_token,
        name: appData.name,
        revision: appData.revision,
        description: '', // No direct description field in Bitable API
        status: 'normal', // Assume normal status
        createdBy: '', // No creator information in API
        createdAt: new Date().toISOString(), // Set to current time
        updatedBy: '', // No updater information in API
        updatedAt: new Date().toISOString(), // Set to current time
        permissions: {
          view: appData.editable !== undefined ? appData.editable : true,
          edit: appData.editable !== undefined ? appData.editable : true,
          manage: appData.editable !== undefined ? appData.editable : true,
        },
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError('Failed to get sheet metadata');
    }
  }

  /**
   * Get tables list for a Bitable (Sheet)
   *
   * @param appToken - The ID of the Bitable
   * @param pageSize - Number of tables to return per page (optional)
   * @param pageToken - Token for pagination (optional)
   * @returns List of tables in a standardized format
   * @throws FeiShuApiError if the request fails or returns empty data
   */
  async getTablesList(
    appToken: string,
    pageSize?: number,
    pageToken?: string,
  ): Promise<TablesList> {
    try {
      const response = await this.client.getTablesList(
        appToken,
        pageSize,
        pageToken,
      );

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          `Failed to get tables list: ${response.msg || 'Unknown error'}`,
          response.code,
        );
      }

      const { items, has_more, page_token, total } = response.data;

      console.log(items);

      // Transform the tables to a standardized format
      const tables: TableData[] = items.map((table: any) => ({
        id: table.table_id,
        name: table.name,
        revision: table.revision,
      }));

      return {
        tables,
        hasMore: has_more,
        pageToken: page_token,
        total,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError('Failed to get tables list');
    }
  }

  /**
   * Get views list for a table
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param pageSize - Number of views to return per page (optional)
   * @param pageToken - Token for pagination (optional)
   * @returns List of views in a standardized format
   * @throws FeiShuApiError if the request fails or returns empty data
   */
  async getViewsList(
    appToken: string,
    tableId: string,
    pageSize?: number,
    pageToken?: string,
  ): Promise<ViewsList> {
    try {
      const response = await this.client.getViewsList(
        appToken,
        tableId,
        pageSize,
        pageToken,
      );

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          `Failed to get views list: ${response.msg || 'Unknown error'}`,
          response.code,
        );
      }

      const { items, has_more, page_token, total } = response.data;

      // Transform the views to a standardized format
      const views: ViewInfo[] = items.map((view: any) => ({
        id: view.view_id,
        name: view.view_name,
        type: view.view_type,
        property: view.property,
      }));

      return {
        views,
        hasMore: has_more,
        pageToken: page_token,
        total,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError('Failed to get views list');
    }
  }

  /**
   * Get details of a single view
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param viewId - The ID of the view
   * @returns View information in a standardized format
   * @throws FeiShuApiError if the request fails or returns empty data
   */
  async getView(
    appToken: string,
    tableId: string,
    viewId: string,
  ): Promise<ViewInfo> {
    try {
      const response = await this.client.getView(appToken, tableId, viewId);

      if (response.code !== 0 || !response.data || !response.data.view) {
        throw new FeiShuApiError(
          `Failed to get view details: ${response.msg || 'Unknown error'}`,
          response.code,
        );
      }

      const { view } = response.data;

      // Transform the view to a standardized format
      return {
        id: view.view_id,
        name: view.view_name,
        type: view.view_type,
        property: view.property,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError('Failed to get view details');
    }
  }

  /**
   * Get records from a table
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param viewId - The ID of the view (optional)
   * @param fieldIds - List of field IDs to include (optional)
   * @param filter - Filter condition (optional)
   * @param sort - Sort condition (optional)
   * @param pageSize - Number of records to return per page (optional)
   * @param pageToken - Token for pagination (optional)
   * @returns List of records in a standardized format
   * @throws FeiShuApiError if the request fails or returns empty data
   */
  async getRecordsList(
    appToken: string,
    tableId: string,
    viewId?: string,
    fieldIds?: string[],
    filter?: string,
    sort?: string,
    pageSize?: number,
    pageToken?: string,
  ): Promise<RecordList> {
    try {
      const response = await this.client.getRecordsList(
        appToken,
        tableId,
        viewId,
        fieldIds,
        filter,
        sort,
        pageSize,
        pageToken,
      );

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          `Failed to get records list: ${response.msg || 'Unknown error'}`,
          response.code,
        );
      }

      const { items, has_more, page_token, total } = response.data;

      // Transform the records to a standardized format
      const records: RecordInfo[] = items.map((record: any) => ({
        id: record.record_id,
        fields: record.fields,
      }));

      return {
        records,
        hasMore: has_more,
        pageToken: page_token,
        total,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError('Failed to get records list');
    }
  }

  /**
   * Get a single record from a table
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param recordId - The ID of the record
   * @param fieldIds - List of field IDs to include (optional)
   * @returns Record data in a standardized format
   * @throws FeiShuApiError if the request fails or returns empty data
   */
  async getRecord(
    appToken: string,
    tableId: string,
    recordId: string,
    fieldIds?: string[],
  ): Promise<RecordInfo> {
    try {
      const response = await this.client.getRecord(
        appToken,
        tableId,
        recordId,
        fieldIds,
      );

      if (response.code !== 0 || !response.data || !response.data.record) {
        throw new FeiShuApiError(
          `Failed to get record: ${response.msg || 'Unknown error'}`,
          response.code,
        );
      }

      const { record } = response.data;

      // Transform the record to a standardized format
      return {
        id: record.record_id,
        fields: record.fields,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError('Failed to get record');
    }
  }
}
