import dayjs from "dayjs";
import { CalendarEvent } from "../types/calendar";

export const getEventsForDay = (
  events: CalendarEvent[],
  date: dayjs.Dayjs,
  weekStart: dayjs.Dayjs,
  weekEnd: dayjs.Dayjs
): CalendarEvent[] => {
  const dateStr = date.format("YYYY-MM-DD");

  return events.filter((event) => {
    const eventStart = dayjs(event.startTime);
    const eventStartDate = eventStart.format("YYYY-MM-DD");
    const dayOfWeek = date.day();

    if (event.recurrencePattern === "none") {
      // One-time event
      return eventStartDate === dateStr;
    } else if (event.recurrencePattern === "daily") {
      // Daily recurring event
      // Check if this day falls within the range of the recurring event start date and the end of the displayed week
      return eventStart.isSameOrBefore(date) && date.isSameOrBefore(weekEnd);
    } else if (event.recurrencePattern === "weekly" && event.weeklyRecurrence) {
      // Weekly recurring event
      // Check if this day of the week is included in the recurrence pattern
      // and if the event starts on or before the current day
      return (
        event.weeklyRecurrence.daysOfWeek.includes(dayOfWeek) &&
        eventStart.isSameOrBefore(date)
      );
    }
    return false;
  });
};

export const formatEventTime = (startTime: string, endTime: string) => {
  return `${dayjs(startTime).format("HH:mm")} - ${dayjs(endTime).format(
    "HH:mm"
  )}`;
};
