/**
 * Bitable API Type Definitions
 */

/**
 * Bitable metadata structure
 */
export interface BitableMetadata {
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
 * Single Bitable record
 */
export interface BitableRecordData {
  record_id: string;
  fields: Record<string, unknown>;
}

/**
 * Create record request
 */
export interface CreateRecordRequest {
  fields: Record<string, unknown>;
}

/**
 * Create record response
 */
export interface CreateRecordResponse {
  record: {
    record_id: string;
    fields: Record<string, unknown>;
  };
}

/**
 * Update record request
 */
export interface UpdateRecordRequest {
  fields: Record<string, unknown>;
}

/**
 * Update record response
 */
export interface UpdateRecordResponse {
  record: {
    record_id: string;
    fields: Record<string, unknown>;
  };
}

/**
 * Delete record response
 */
export interface DeleteRecordResponse {
  deleted: boolean;
}

/**
 * Table information structure
 */
export interface BitableTableData {
  table_id: string;
  name: string;
  revision: number;
}

/**
 * View information structure
 */
export interface BitableViewData {
  view_id: string;
  view_name: string;
  view_type: string;
  property: Record<string, unknown>;
}
