/**
 * Calendar API Types
 */

/**
 * Calendar information response
 */
export interface CalendarInfoResponse {
  calendar: {
    calendar_id: string;
    summary: string;
    description: string;
    permissions: {
      public_readable: boolean;
    };
    color: number;
    type: string;
    role: string;
    is_deleted: boolean;
    is_primary: boolean;
    create_time: number;
  };
}

/**
 * Calendar list response
 */
export interface CalendarListResponse {
  has_more: boolean;
  page_token: string;
  items: {
    calendar_id: string;
    summary: string;
    description: string;
    permissions: {
      public_readable: boolean;
    };
    color: number;
    type: string;
    role: string;
    is_deleted: boolean;
    is_primary: boolean;
    create_time: number;
  }[];
}

/**
 * Calendar event response
 */
export interface CalendarEventResponse {
  event: {
    event_id: string;
    organizer_calendar_id: string;
    summary: string;
    description: string;
    start_time: {
      date: string;
      timestamp: string;
      timezone: string;
    };
    end_time: {
      date: string;
      timestamp: string;
      timezone: string;
    };
    visibility: string;
    attendee_ability: string;
    free_busy_status: string;
    location: {
      name: string;
      address: string;
      latitude: number;
      longitude: number;
    };
    color: number;
    status: string;
    is_exception: boolean;
    recurring_event_id: string;
    create_time: number;
  };
}

/**
 * Calendar event list response
 */
export interface CalendarEventListResponse {
  has_more: boolean;
  page_token: string;
  items: {
    event_id: string;
    organizer_calendar_id: string;
    summary: string;
    description: string;
    start_time: {
      date: string;
      timestamp: string;
      timezone: string;
    };
    end_time: {
      date: string;
      timestamp: string;
      timezone: string;
    };
    visibility: string;
    attendee_ability: string;
    free_busy_status: string;
    location: {
      name: string;
      address: string;
      latitude: number;
      longitude: number;
    };
    color: number;
    status: string;
    is_exception: boolean;
    recurring_event_id: string;
    create_time: number;
  }[];
}
