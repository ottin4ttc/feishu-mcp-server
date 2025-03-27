/**
 * Sheet Service
 *
 * Business logic for interacting with FeiShu Sheets (Bitable)
 */

import { SheetClient } from '@/client/sheets/sheet-client.js';
import type { ApiClientConfig, PaginationOptions } from '@/client/types.js';
import { FeiShuApiError } from '@/services/error.js';
import { SheetMapper } from './mappers/sheet-mapper.js';
import type {
  RecordInfoBO,
  RecordListBO,
  SheetMetadataBO,
  TableListBO,
  ViewInfoBO,
  ViewListBO,
} from './types/index.js';

/**
 * Service for interacting with FeiShu Sheets
 */
export class SheetService {
  private client: SheetClient;
  private mapper: SheetMapper;

  /**
   * Initialize the Sheet service
   *
   * @param config - API client configuration
   */
  constructor(config: ApiClientConfig) {
    this.client = new SheetClient(config);
    this.mapper = new SheetMapper();
  }

  /**
   * Get metadata for a Bitable (Sheet)
   *
   * @param appToken - The ID of the Bitable
   * @returns Sheet metadata in a standardized format
   * @throws FeiShuApiError if the request fails or returns empty data
   */
  async getSheetMetadata(appToken: string): Promise<SheetMetadataBO> {
    try {
      const response = await this.client.getSheetMeta(appToken);

      if (response.code !== 0 || !response.data || !response.data.app) {
        throw new FeiShuApiError(
          `Failed to get sheet metadata: ${response.msg || 'Unknown error'}`,
          response.code,
        );
      }

      return this.mapper.toSheetMetadataBO(response.data.app);
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
   * @param pagination - Pagination options
   * @returns List of tables in a standardized format
   * @throws FeiShuApiError if the request fails or returns empty data
   */
  async getTablesList(
    appToken: string,
    pagination?: PaginationOptions,
  ): Promise<TableListBO> {
    try {
      const response = await this.client.getTablesList(appToken, pagination);

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          `Failed to get tables list: ${response.msg || 'Unknown error'}`,
          response.code,
        );
      }

      return this.mapper.toTableListBO(response.data);
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
   * @param pagination - Pagination options
   * @returns List of views in a standardized format
   * @throws FeiShuApiError if the request fails or returns empty data
   */
  async getViewsList(
    appToken: string,
    tableId: string,
    pagination?: PaginationOptions,
  ): Promise<ViewListBO> {
    try {
      const response = await this.client.getViewsList(
        appToken,
        tableId,
        pagination,
      );

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          `Failed to get views list: ${response.msg || 'Unknown error'}`,
          response.code,
        );
      }

      return this.mapper.toViewListBO(response.data);
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
  ): Promise<ViewInfoBO> {
    try {
      const response = await this.client.getView(appToken, tableId, viewId);

      if (response.code !== 0 || !response.data || !response.data.view) {
        throw new FeiShuApiError(
          `Failed to get view details: ${response.msg || 'Unknown error'}`,
          response.code,
        );
      }

      return this.mapper.toViewInfoBO(response.data.view);
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
   * @param options - Record list options
   * @returns List of records in a standardized format
   * @throws FeiShuApiError if the request fails or returns empty data
   */
  async getRecordsList(
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
  ): Promise<RecordListBO> {
    try {
      const response = await this.client.getRecordsList(
        appToken,
        tableId,
        options,
      );

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          `Failed to get records list: ${response.msg || 'Unknown error'}`,
          response.code,
        );
      }

      return this.mapper.toRecordListBO(response.data);
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
   * @param options - Record options
   * @returns Record data in a standardized format
   * @throws FeiShuApiError if the request fails or returns empty data
   */
  async getRecord(
    appToken: string,
    tableId: string,
    recordId: string,
    options: { fieldIds?: string[] } = {},
  ): Promise<RecordInfoBO> {
    try {
      const response = await this.client.getRecord(
        appToken,
        tableId,
        recordId,
        options,
      );

      if (response.code !== 0 || !response.data || !response.data.record) {
        throw new FeiShuApiError(
          `Failed to get record: ${response.msg || 'Unknown error'}`,
          response.code,
        );
      }

      return this.mapper.toRecordInfoBO(response.data.record);
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError('Failed to get record');
    }
  }
}
