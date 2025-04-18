const mockGet = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      has_more: false,
      page_token: 'next_page_token',
      items: [
        {
          calendar_id: 'cal_123',
          summary: 'Work Calendar',
          description: 'Calendar for work events',
          permissions: {
            public_readable: true,
          },
          color: 1,
          type: 'primary',
          role: 'owner',
          is_deleted: false,
          is_primary: true,
          create_time: 1609459200,
        },
        {
          calendar_id: 'cal_456',
          summary: 'Personal Calendar',
          description: 'Calendar for personal events',
          permissions: {
            public_readable: false,
          },
          color: 2,
          type: 'shared',
          role: 'reader',
          is_deleted: false,
          is_primary: false,
          create_time: 1609459300,
        },
      ],
    },
  });
});

const MockApiClient = jest.fn().mockImplementation(() => {
  return {
    get: mockGet,
  };
});

jest.mock('../src/client/api-client.js', () => {
  return {
    ApiClient: MockApiClient,
  };
});

import { CalendarClient } from '../src/client/calendars/calendar-client.js';

describe('CalendarClient - Get Calendar List', () => {
  let calendarClient;

  beforeEach(() => {
    jest.clearAllMocks();
    calendarClient = new CalendarClient();
  });

  describe('getCalendarList', () => {
    it('should get calendar list with the correct parameters', async () => {
      const options = {
        pageSize: 20,
        pageToken: 'some_page_token',
      };

      await calendarClient.getCalendarList(options);

      expect(mockGet).toHaveBeenCalledWith('/open-apis/calendar/v4/calendars', {
        ...options,
      });
    });

    it('should work without pagination options', async () => {
      await calendarClient.getCalendarList();

      expect(mockGet).toHaveBeenCalledWith(
        '/open-apis/calendar/v4/calendars',
        {},
      );
    });

    it('should return the response from the API', async () => {
      const response = await calendarClient.getCalendarList();

      expect(response).toEqual({
        code: 0,
        data: {
          has_more: false,
          page_token: 'next_page_token',
          items: [
            {
              calendar_id: 'cal_123',
              summary: 'Work Calendar',
              description: 'Calendar for work events',
              permissions: {
                public_readable: true,
              },
              color: 1,
              type: 'primary',
              role: 'owner',
              is_deleted: false,
              is_primary: true,
              create_time: 1609459200,
            },
            {
              calendar_id: 'cal_456',
              summary: 'Personal Calendar',
              description: 'Calendar for personal events',
              permissions: {
                public_readable: false,
              },
              color: 2,
              type: 'shared',
              role: 'reader',
              is_deleted: false,
              is_primary: false,
              create_time: 1609459300,
            },
          ],
        },
      });
    });

    it('should handle API errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      await expect(calendarClient.getCalendarList()).rejects.toThrow(
        'API Error',
      );

      expect(mockGet).toHaveBeenCalledWith(
        '/open-apis/calendar/v4/calendars',
        {},
      );
    });
  });
});
