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
