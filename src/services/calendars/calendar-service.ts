/**
 * Calendar Service
 */

import type { CalendarClient } from '../../client/calendars/calendar-client.js';
import { FeiShuApiError } from '../error.js';
import type {
  CalendarEventBO,
  CalendarEventListBO,
  CalendarInfoBO,
  CalendarListBO,
} from './types/index.js';

/**
 * Service for FeiShu calendar operations
 */
export class CalendarService {
  private client: CalendarClient;

  /**
   * Create new calendar service
   */
  constructor(client: CalendarClient) {
    this.client = client;
  }

  /**
   * Get calendar list
   *
   * @param pageSize - Page size
   * @param pageToken - Page token
   * @returns Calendar list
   */
  async getCalendarList(
    pageSize?: number,
    pageToken?: string,
  ): Promise<CalendarListBO> {
    try {
      const response = await this.client.getCalendarList({
        pageSize,
        pageToken,
      });

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          response.msg || 'Failed to get calendar list',
          response.code || -1,
        );
      }

      const { items, page_token, has_more } = response.data;

      return {
        calendars: items.map((calendar) => ({
          calendarId: calendar.calendar_id,
          summary: calendar.summary,
          description: calendar.description,
          permissions: {
            publicReadable: calendar.permissions.public_readable,
          },
          color: calendar.color,
          type: calendar.type,
          role: calendar.role,
          isDeleted: calendar.is_deleted,
          isPrimary: calendar.is_primary,
          createTime: calendar.create_time,
        })),
        pageToken: page_token,
        hasMore: has_more,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }
      throw new FeiShuApiError(`Failed to get calendar list: ${error}`, -1);
    }
  }

  /**
   * Get calendar events
   *
   * @param calendarId - Calendar ID
   * @param startTime - Start time (RFC3339 timestamp)
   * @param endTime - End time (RFC3339 timestamp)
   * @param pageSize - Page size
   * @param pageToken - Page token
   * @returns Calendar event list
   */
  async getCalendarEvents(
    calendarId: string,
    startTime: string,
    endTime: string,
    pageSize?: number,
    pageToken?: string,
  ): Promise<CalendarEventListBO> {
    try {
      const response = await this.client.getCalendarEvents(
        calendarId,
        startTime,
        endTime,
        {
          pageSize,
          pageToken,
        },
      );

      if (response.code !== 0 || !response.data) {
        throw new FeiShuApiError(
          response.msg || 'Failed to get calendar events',
          response.code || -1,
        );
      }

      const { items, page_token, has_more } = response.data;

      return {
        events: items.map((event) => ({
          eventId: event.event_id,
          organizerCalendarId: event.organizer_calendar_id,
          summary: event.summary,
          description: event.description,
          startTime: {
            date: event.start_time.date,
            timestamp: event.start_time.timestamp,
            timezone: event.start_time.timezone,
          },
          endTime: {
            date: event.end_time.date,
            timestamp: event.end_time.timestamp,
            timezone: event.end_time.timezone,
          },
          visibility: event.visibility,
          attendeeAbility: event.attendee_ability,
          freeBusyStatus: event.free_busy_status,
          location: {
            name: event.location.name,
            address: event.location.address,
            latitude: event.location.latitude,
            longitude: event.location.longitude,
          },
          color: event.color,
          status: event.status,
          isException: event.is_exception,
          recurringEventId: event.recurring_event_id,
          createTime: event.create_time,
        })),
        pageToken: page_token,
        hasMore: has_more,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }
      throw new FeiShuApiError(`Failed to get calendar events: ${error}`, -1);
    }
  }
}
