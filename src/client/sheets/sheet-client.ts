/**
 * Bitable metadata structure
 */
export interface BitableMetaData {
  app: {
    app_token: string;
    name: string;
    revision: number;
    current_user_id?: string;
    editable?: boolean;
    formula_type?: number;
    is_advanced?: boolean;
    time_zone?: string;
  };
}

/**
 * Record data structure
 */
export interface RecordData {
  record_id: string;
  fields: Record<string, unknown>;
}

/**
 * Table information structure
 */
export interface TableData {
  table_id: string;
  name: string;
  revision: number;
}

/**
 * View information structure
 */
export interface ViewData {
  view_id: string;
  view_name: string;
  view_type: string;
  property: Record<string, unknown>;
}

/**
 * Records list structure
 */
export interface RecordsListData {
  records: RecordData[];
  has_more: boolean;
  page_token: string;
  total: number;
}

/**
 * Bitable tables list structure
 */
export interface BitableTableListData {
  items: TableData[];
  has_more: boolean;
  page_token: string;
  total: number;
}

/**
 * Bitable views list structure
 */
export interface BitableViewListData {
  items: ViewData[];
  has_more: boolean;
  page_token: string;
  total: number;
}

/**
 * Single Bitable view structure
 */
export interface BitableViewData {
  view: ViewData;
}

/**
 * Bitable records list structure
 */
export interface BitableRecordListData {
  items: RecordData[];
  has_more: boolean;
  page_token: string;
  total: number;
}

/**
 * Single Bitable record
 */
export interface BitableRecordData {
  record: RecordData;
}

/**
 * Sheet Client
 *
 * Implements API calls for FeiShu Sheets (Bitable)
 */

import { ApiClient, type ApiResponse } from '@/client/api-client.js';

/**
 * FeiShu Sheet API Client
 *
 * Provides methods to interact with FeiShu Sheets (Bitable) API
 */
export class SheetClient extends ApiClient {
  /**
   * Get metadata for a Bitable
   *
   * @param appToken - The ID of the Bitable
   * @returns Sheet metadata response
   */
  async getSheetMeta(appToken: string): Promise<ApiResponse<BitableMetaData>> {
    try {
      return await this.request<BitableMetaData>({
        url: `/open-apis/bitable/v1/apps/${appToken}`,
        method: 'GET',
        paramsSerializer: this.createParamsSerializer(),
      });
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  /**
   * Get tables list for a Bitable
   *
   * @param appToken - The ID of the Bitable
   * @param pageSize - Number of tables to return per page (default: 20, max: 100)
   * @param pageToken - Token for pagination
   * @returns Tables list response
   */
  async getTablesList(
    appToken: string,
    pageSize?: number,
    pageToken?: string,
  ): Promise<ApiResponse<BitableTables>> {
    try {
      const params: Record<string, unknown> = {};
      if (pageSize) {
        params.page_size = pageSize;
      }
      if (pageToken) {
        params.page_token = pageToken;
      }

      return await this.request<BitableTables>({
        url: `/open-apis/bitable/v1/apps/${appToken}/tables`,
        method: 'GET',
        params,
        paramsSerializer: this.createParamsSerializer(),
      });
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  /**
   * Get views list for a table
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param pageSize - Number of views to return per page (default: 20, max: 100)
   * @param pageToken - Token for pagination
   * @returns Views list response
   */
  async getViewsList(
    appToken: string,
    tableId: string,
    pageSize?: number,
    pageToken?: string,
  ): Promise<ApiResponse<BitableViewListData>> {
    try {
      const params: Record<string, unknown> = {};
      if (pageSize) {
        params.page_size = pageSize;
      }
      if (pageToken) {
        params.page_token = pageToken;
      }

      return await this.request<BitableViewListData>({
        url: `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/views`,
        method: 'GET',
        params,
        paramsSerializer: this.createParamsSerializer(),
      });
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  /**
   * Get details of a single view
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param viewId - The ID of the view
   * @returns View detail response
   */
  async getView(
    appToken: string,
    tableId: string,
    viewId: string,
  ): Promise<ApiResponse<BitableViewData>> {
    try {
      return await this.request<BitableViewData>({
        url: `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/views/${viewId}`,
        method: 'GET',
        paramsSerializer: this.createParamsSerializer(),
      });
    } catch (error) {
      return this.handleRequestError(error);
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
   * @param pageSize - Number of records to return per page (default: 20, max: 100)
   * @param pageToken - Token for pagination (optional)
   * @returns Records list response
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
  ): Promise<ApiResponse<BitableRecords>> {
    try {
      const params: Record<string, unknown> = {};

      if (viewId) {
        params.view_id = viewId;
      }
      if (fieldIds && fieldIds.length > 0) {
        params.field_ids = fieldIds;
      }
      if (filter) {
        params.filter = filter;
      }
      if (sort) {
        params.sort = sort;
      }
      if (pageSize) {
        params.page_size = pageSize;
      }
      if (pageToken) {
        params.page_token = pageToken;
      }

      return await this.request<BitableRecords>({
        url: `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
        method: 'GET',
        params,
        paramsSerializer: this.createParamsSerializer(),
      });
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  /**
   * Get a single record from a table
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param recordId - The ID of the record
   * @param fieldIds - List of field IDs to include (optional)
   * @returns Single record response
   */
  async getRecord(
    appToken: string,
    tableId: string,
    recordId: string,
    fieldIds?: string[],
  ): Promise<ApiResponse<BitableRecordData>> {
    try {
      const params: Record<string, unknown> = {};

      if (fieldIds && fieldIds.length > 0) {
        params.field_ids = fieldIds;
      }

      return await this.request<BitableRecordData>({
        url: `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`,
        method: 'GET',
        params,
        paramsSerializer: this.createParamsSerializer(),
      });
    } catch (error) {
      return this.handleRequestError(error);
    }
  }
}
