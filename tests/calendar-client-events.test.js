const mockGet = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      has_more: false,
      page_token: 'next_page_token',
      items: [
        {
          event_id: 'evt_123',
          organizer_calendar_id: 'cal_123',
          summary: 'Team Meeting',
          description: 'Weekly team sync',
          start_time: {
            date: '2023-01-01',
            timestamp: '1672531200000',
            timezone: 'Asia/Shanghai',
          },
          end_time: {
            date: '2023-01-01',
            timestamp: '1672534800000',
            timezone: 'Asia/Shanghai',
          },
          visibility: 'default',
          attendee_ability: 'can_see_others',
          free_busy_status: 'busy',
          location: {
            name: 'Meeting Room 1',
            address: 'Building A',
            latitude: 39.9042,
            longitude: 116.4074,
          },
          color: 1,
          status: 'confirmed',
          is_exception: false,
          recurring_event_id: '',
          create_time: 1609459200,
        },
        {
          event_id: 'evt_456',
          organizer_calendar_id: 'cal_123',
          summary: 'Project Review',
          description: 'Monthly project review',
          start_time: {
            date: '2023-01-15',
            timestamp: '1673740800000',
            timezone: 'Asia/Shanghai',
          },
          end_time: {
            date: '2023-01-15',
            timestamp: '1673744400000',
            timezone: 'Asia/Shanghai',
          },
          visibility: 'private',
          attendee_ability: 'can_see_others',
          free_busy_status: 'busy',
          location: {
            name: 'Conference Room',
            address: 'Building B',
            latitude: 39.9042,
            longitude: 116.4074,
          },
          color: 2,
          status: 'confirmed',
          is_exception: false,
          recurring_event_id: '',
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

describe('CalendarClient - Get Calendar Events', () => {
  let calendarClient;

  beforeEach(() => {
    jest.clearAllMocks();
    calendarClient = new CalendarClient();
  });

  describe('getCalendarEvents', () => {
    it('should get calendar events with the correct parameters', async () => {
      const calendarId = 'cal_123';
      const startTime = '2023-01-01T00:00:00+08:00';
      const endTime = '2023-01-31T23:59:59+08:00';
      const options = {
        pageSize: 20,
        pageToken: 'some_page_token',
      };

      await calendarClient.getCalendarEvents(
        calendarId,
        startTime,
        endTime,
        options,
      );

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/calendar/v4/calendars/${calendarId}/events`,
        {
          start_time: startTime,
          end_time: endTime,
          ...options,
        },
      );
    });

    it('should work without pagination options', async () => {
      const calendarId = 'cal_123';
      const startTime = '2023-01-01T00:00:00+08:00';
      const endTime = '2023-01-31T23:59:59+08:00';

      await calendarClient.getCalendarEvents(calendarId, startTime, endTime);

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/calendar/v4/calendars/${calendarId}/events`,
        {
          start_time: startTime,
          end_time: endTime,
        },
      );
    });

    it('should return the response from the API', async () => {
      const calendarId = 'cal_123';
      const startTime = '2023-01-01T00:00:00+08:00';
      const endTime = '2023-01-31T23:59:59+08:00';

      const response = await calendarClient.getCalendarEvents(
        calendarId,
        startTime,
        endTime,
      );

      expect(response).toEqual({
        code: 0,
        data: {
          has_more: false,
          page_token: 'next_page_token',
          items: [
            {
              event_id: 'evt_123',
              organizer_calendar_id: 'cal_123',
              summary: 'Team Meeting',
              description: 'Weekly team sync',
              start_time: {
                date: '2023-01-01',
                timestamp: '1672531200000',
                timezone: 'Asia/Shanghai',
              },
              end_time: {
                date: '2023-01-01',
                timestamp: '1672534800000',
                timezone: 'Asia/Shanghai',
              },
              visibility: 'default',
              attendee_ability: 'can_see_others',
              free_busy_status: 'busy',
              location: {
                name: 'Meeting Room 1',
                address: 'Building A',
                latitude: 39.9042,
                longitude: 116.4074,
              },
              color: 1,
              status: 'confirmed',
              is_exception: false,
              recurring_event_id: '',
              create_time: 1609459200,
            },
            {
              event_id: 'evt_456',
              organizer_calendar_id: 'cal_123',
              summary: 'Project Review',
              description: 'Monthly project review',
              start_time: {
                date: '2023-01-15',
                timestamp: '1673740800000',
                timezone: 'Asia/Shanghai',
              },
              end_time: {
                date: '2023-01-15',
                timestamp: '1673744400000',
                timezone: 'Asia/Shanghai',
              },
              visibility: 'private',
              attendee_ability: 'can_see_others',
              free_busy_status: 'busy',
              location: {
                name: 'Conference Room',
                address: 'Building B',
                latitude: 39.9042,
                longitude: 116.4074,
              },
              color: 2,
              status: 'confirmed',
              is_exception: false,
              recurring_event_id: '',
              create_time: 1609459300,
            },
          ],
        },
      });
    });

    it('should handle API errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      const calendarId = 'cal_123';
      const startTime = '2023-01-01T00:00:00+08:00';
      const endTime = '2023-01-31T23:59:59+08:00';

      await expect(
        calendarClient.getCalendarEvents(calendarId, startTime, endTime),
      ).rejects.toThrow('API Error');

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/calendar/v4/calendars/${calendarId}/events`,
        {
          start_time: startTime,
          end_time: endTime,
        },
      );
    });
  });
});
