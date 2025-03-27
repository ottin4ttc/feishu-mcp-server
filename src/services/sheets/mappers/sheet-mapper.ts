import type {
  RecordInfoBO,
  RecordListBO,
  SheetMetadataBO,
  TableInfoBO,
  TableListBO,
  ViewInfoBO,
  ViewListBO,
} from '../types/index.js';

import type {
  BitableMetadata,
  BitableRecordData,
  BitableTableData,
  BitableViewData,
  ListResponseData,
} from '@/client/index.js';

export class SheetMapper {
  /**
   * Convert sheet metadata from API response to BO
   */
  toSheetMetadataBO = (appData: BitableMetadata['app']): SheetMetadataBO => ({
    id: appData.app_token,
    name: appData.name,
    revision: appData.revision,
    permissions: {
      view: appData.editable ?? true,
      edit: appData.editable ?? true,
      manage: appData.editable ?? true,
    },
  });

  /**
   * Convert table data from API response to BO
   */
  toTableInfoBO = (tableData: BitableTableData): TableInfoBO => ({
    id: tableData.table_id,
    name: tableData.name,
    revision: tableData.revision,
  });

  /**
   * Convert view data from API response to BO
   */
  toViewInfoBO = (viewData: BitableViewData): ViewInfoBO => ({
    id: viewData.view_id,
    name: viewData.view_name,
    type: viewData.view_type,
    property: viewData.property,
  });

  /**
   * Convert record data from API response to BO
   */
  toRecordInfoBO = (recordData: BitableRecordData): RecordInfoBO => ({
    id: recordData.record_id,
    fields: recordData.fields,
  });

  /**
   * Convert table list from API response to BO
   */
  toTableListBO = (data: ListResponseData<BitableTableData>): TableListBO => ({
    tables: data.items.map(this.toTableInfoBO),
  });

  /**
   * Convert view list from API response to BO
   */
  toViewListBO = (data: ListResponseData<BitableViewData>): ViewListBO => ({
    views: data.items.map(this.toViewInfoBO),
  });

  /**
   * Convert record list from API response to BO
   */
  toRecordListBO = (
    data: ListResponseData<BitableRecordData>,
  ): RecordListBO => ({
    records: data.items.map(this.toRecordInfoBO),
  });
}
