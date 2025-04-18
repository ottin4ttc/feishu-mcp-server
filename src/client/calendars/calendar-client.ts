/**
 * Calendar API Client
 */

import { ApiClient } from '../api-client.js';
import type { ApiResponse, PaginationOptions } from '../types.js';
import type {
  CalendarEventListResponse,
  CalendarListResponse,
} from './types/index.js';

/**
 * Client for FeiShu calendar operations
 */
export class CalendarClient extends ApiClient {
  /**
   * Get calendar list
   *
   * @param options - Pagination options
   * @returns Calendar list
   */
  getCalendarList = (
    options?: PaginationOptions,
  ): Promise<ApiResponse<CalendarListResponse>> => {
    return this.get<CalendarListResponse>('/open-apis/calendar/v4/calendars', {
      ...options,
    });
  };

  /**
   * Get calendar events
   *
   * @param calendarId - Calendar ID
   * @param startTime - Start time (RFC3339 timestamp)
   * @param endTime - End time (RFC3339 timestamp)
   * @param options - Pagination options
   * @returns Calendar event list
   */
  getCalendarEvents = (
    calendarId: string,
    startTime: string,
    endTime: string,
    options?: PaginationOptions,
  ): Promise<ApiResponse<CalendarEventListResponse>> => {
    return this.get<CalendarEventListResponse>(
      `/open-apis/calendar/v4/calendars/${calendarId}/events`,
      {
        start_time: startTime,
        end_time: endTime,
        ...options,
      },
    );
  };
}
