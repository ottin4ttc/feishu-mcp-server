/**
 * Calendar Tools
 */

import { z } from 'zod';
import {
  TOOL_GET_CALENDAR_EVENTS,
  TOOL_GET_CALENDAR_LIST,
} from '../../consts/index.js';
import { FeiShuApiError } from '../../services/error.js';
import type { ToolRegistryParams } from './index.js';

/**
 * Register calendar tools
 */
export function registerCalendarTools({
  server,
  services,
  logger,
}: ToolRegistryParams) {
  server.tool(
    TOOL_GET_CALENDAR_LIST,
    'Get a list of FeiShu calendars',
    {
      pageSize: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe('Number of calendars to return per page (1-100)'),
      pageToken: z.string().optional().describe('Page token for pagination'),
    },
    async ({ pageSize, pageToken }) => {
      try {
        logger.info('Getting calendar list');
        const calendarList = await services.calendars.getCalendarList(
          pageSize,
          pageToken,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(calendarList, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error getting calendar list: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  server.tool(
    TOOL_GET_CALENDAR_EVENTS,
    'Get events from a FeiShu calendar',
    {
      calendarId: z
        .string()
        .describe('The ID of the calendar to get events from'),
      startTime: z
        .string()
        .describe(
          'Start time in RFC3339 format (e.g., 2023-01-01T00:00:00+08:00)',
        ),
      endTime: z
        .string()
        .describe(
          'End time in RFC3339 format (e.g., 2023-01-31T23:59:59+08:00)',
        ),
      pageSize: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe('Number of events to return per page (1-100)'),
      pageToken: z.string().optional().describe('Page token for pagination'),
    },
    async ({ calendarId, startTime, endTime, pageSize, pageToken }) => {
      try {
        logger.info(
          `Getting events for calendar ${calendarId} from ${startTime} to ${endTime}`,
        );
        const eventList = await services.calendars.getCalendarEvents(
          calendarId,
          startTime,
          endTime,
          pageSize,
          pageToken,
        );

        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(eventList, null, 2) },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error getting calendar events: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );
}
