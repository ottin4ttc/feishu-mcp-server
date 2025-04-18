/**
 * Sheet metadata structure (standardized format)
 */
export interface SheetMetadataBO {
  id: string;
  name: string;
  revision: number;
  permissions: {
    view: boolean;
    edit: boolean;
    manage: boolean;
  };
}

/**
 * Table information structure (standardized format)
 */
export interface TableInfoBO {
  id: string;
  name: string;
  revision: number;
}

/**
 * View information structure (standardized format)
 */
export interface ViewInfoBO {
  id: string;
  name: string;
  type: string;
  property: Record<string, unknown>;
}

/**
 * Record information structure (standardized format)
 */
export interface RecordInfoBO {
  id: string;
  fields: Record<string, unknown>;
}

/**
 * Create record parameters (standardized format)
 */
export interface CreateRecordParamsBO {
  fields: Record<string, unknown>;
}

/**
 * Update record parameters (standardized format)
 */
export interface UpdateRecordParamsBO {
  fields: Record<string, unknown>;
}

/**
 * Tables list structure (standardized format)
 */
export interface TableListBO {
  tables: TableInfoBO[];
}

/**
 * Views list structure (standardized format)
 */
export interface ViewListBO {
  views: ViewInfoBO[];
}

/**
 * Record list structure (standardized format)
 */
export interface RecordListBO {
  records: RecordInfoBO[];
}
