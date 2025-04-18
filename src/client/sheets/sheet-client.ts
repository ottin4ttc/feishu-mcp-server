/**
 * Sheet Client
 *
 * Implements API calls for FeiShu Sheets (Bitable)
 */

import { ApiClient } from '@/client/api-client.js';
import type {
  ApiResponse,
  ListResponseData,
  PaginationOptions,
} from '@/client/types.js';
import type {
  BitableMetadata,
  BitableRecordData,
  BitableTableData,
  BitableViewData,
  CreateRecordRequest,
  CreateRecordResponse,
  DeleteRecordResponse,
  UpdateRecordRequest,
  UpdateRecordResponse,
} from './types/index.js';

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
  getSheetMeta = (appToken: string): Promise<ApiResponse<BitableMetadata>> =>
    this.get<BitableMetadata>(`/open-apis/bitable/v1/apps/${appToken}`);

  /**
   * Get tables list for a Bitable
   *
   * @param appToken - The ID of the Bitable
   * @param pagination - Pagination options
   * @returns Tables list response
   */
  getTablesList = (
    appToken: string,
    pagination?: PaginationOptions,
  ): Promise<ApiResponse<ListResponseData<BitableTableData>>> =>
    this.getList<ListResponseData<BitableTableData>>(
      `/open-apis/bitable/v1/apps/${appToken}/tables`,
      pagination,
    );

  /**
   * Get views list for a table
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param pagination - Pagination options
   * @returns Views list response
   */
  getViewsList = (
    appToken: string,
    tableId: string,
    pagination?: PaginationOptions,
  ): Promise<ApiResponse<ListResponseData<BitableViewData>>> =>
    this.getList<ListResponseData<BitableViewData>>(
      `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/views`,
      pagination,
    );

  /**
   * Get details of a single view
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param viewId - The ID of the view
   * @returns View detail response
   */
  getView = (
    appToken: string,
    tableId: string,
    viewId: string,
  ): Promise<ApiResponse<BitableViewData>> =>
    this.get<BitableViewData>(
      `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/views/${viewId}`,
    );

  /**
   * Get records from a table
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param options - Query options
   * @returns Records list response
   */
  getRecordsList = (
    appToken: string,
    tableId: string,
    options: {
      viewId?: string;
      fieldIds?: string[];
      filter?: string;
      sort?: string;
      pageSize?: number;
      pageToken?: string;
    } = {},
  ): Promise<ApiResponse<ListResponseData<BitableRecordData>>> => {
    const { viewId, fieldIds, filter, sort, pageSize, pageToken } = options;
    const params: Record<string, unknown> = {};

    if (viewId) params.view_id = viewId;
    if (fieldIds?.length) params.field_ids = fieldIds;
    if (filter) params.filter = filter;
    if (sort) params.sort = sort;

    const pagination: PaginationOptions = {};
    if (pageSize) pagination.pageSize = pageSize;
    if (pageToken) pagination.pageToken = pageToken;

    return this.getList<ListResponseData<BitableRecordData>>(
      `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
      pagination,
      params,
    );
  };

  /**
   * Get a single record from a table
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param recordId - The ID of the record
   * @param options - Query options
   * @returns Single record response
   */
  getRecord = (
    appToken: string,
    tableId: string,
    recordId: string,
    { fieldIds }: { fieldIds?: string[] } = {},
  ): Promise<ApiResponse<BitableRecordData>> => {
    const params: Record<string, unknown> = {};
    if (fieldIds?.length) params.field_ids = fieldIds;

    return this.get<BitableRecordData>(
      `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`,
      params,
    );
  };

  /**
   * Create a new record in a table
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param fields - Record fields data
   * @returns Created record response
   */
  createRecord = (
    appToken: string,
    tableId: string,
    fields: Record<string, unknown>,
  ): Promise<ApiResponse<CreateRecordResponse>> => {
    return this.post<CreateRecordResponse>(
      `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
      { fields },
    );
  };

  /**
   * Update an existing record in a table
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param recordId - The ID of the record to update
   * @param fields - Updated record fields data
   * @returns Updated record response
   */
  updateRecord = (
    appToken: string,
    tableId: string,
    recordId: string,
    fields: Record<string, unknown>,
  ): Promise<ApiResponse<UpdateRecordResponse>> => {
    return this.put<UpdateRecordResponse>(
      `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`,
      { fields },
    );
  };

  /**
   * Delete a record from a table
   *
   * @param appToken - The ID of the Bitable
   * @param tableId - The ID of the table
   * @param recordId - The ID of the record to delete
   * @returns Delete response
   */
  deleteRecord = (
    appToken: string,
    tableId: string,
    recordId: string,
  ): Promise<ApiResponse<DeleteRecordResponse>> => {
    return this.delete<DeleteRecordResponse>(
      `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`,
    );
  };
}
