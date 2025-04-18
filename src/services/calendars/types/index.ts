/**
 * Calendar service types
 */

/**
 * Calendar information structure (standardized format)
 */
export interface CalendarInfoBO {
  calendarId: string;
  summary: string;
  description: string;
  permissions: {
    publicReadable: boolean;
  };
  color: number;
  type: string;
  role: string;
  isDeleted: boolean;
  isPrimary: boolean;
  createTime: number;
}

/**
 * Calendar list structure (standardized format)
 */
export interface CalendarListBO {
  calendars: CalendarInfoBO[];
  pageToken: string;
  hasMore: boolean;
}

/**
 * Calendar event time structure (standardized format)
 */
export interface CalendarEventTimeBO {
  date: string;
  timestamp: string;
  timezone: string;
}

/**
 * Calendar event location structure (standardized format)
 */
export interface CalendarEventLocationBO {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * Calendar event structure (standardized format)
 */
export interface CalendarEventBO {
  eventId: string;
  organizerCalendarId: string;
  summary: string;
  description: string;
  startTime: CalendarEventTimeBO;
  endTime: CalendarEventTimeBO;
  visibility: string;
  attendeeAbility: string;
  freeBusyStatus: string;
  location: CalendarEventLocationBO;
  color: number;
  status: string;
  isException: boolean;
  recurringEventId: string;
  createTime: number;
}

/**
 * Calendar event list structure (standardized format)
 */
export interface CalendarEventListBO {
  events: CalendarEventBO[];
  pageToken: string;
  hasMore: boolean;
}
