import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export type EventCategory = "work" | "personal" | "meeting";

export type RecurrencePattern = "none" | "daily" | "weekly";

export interface WeeklyRecurrence {
  daysOfWeek: number[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: EventCategory;
  recurrencePattern: RecurrencePattern;
  weeklyRecurrence?: WeeklyRecurrence;
}

export type InitialState = {
  events: CalendarEvent[];
  isEventModalOpen: boolean;
  selectedDate: string | null;
  selectedEvent: CalendarEvent | null;
};

export const sampleEvents: CalendarEvent[] = [
  {
    id: uuidv4(),
    title: "Weekly Team Meeting",
    startTime: dayjs().day(1).hour(9).minute(30).second(0).toISOString(), // Monday
    endTime: dayjs().day(1).hour(10).minute(45).second(0).toISOString(),
    category: "meeting",
    recurrencePattern: "weekly",
    weeklyRecurrence: {
      daysOfWeek: [1], // Monday
    },
  },
  {
    id: uuidv4(),
    title: "Project Review",
    startTime: dayjs().day(2).hour(13).minute(15).second(0).toISOString(), // Tuesday
    endTime: dayjs().day(2).hour(15).minute(0).second(0).toISOString(),
    category: "work",
    recurrencePattern: "none",
  },
  {
    id: uuidv4(),
    title: "Gym Session",
    startTime: dayjs().day(4).hour(18).minute(0).second(0).toISOString(), // Thursday
    endTime: dayjs().day(4).hour(19).minute(30).second(0).toISOString(),
    category: "personal",
    recurrencePattern: "weekly",
    weeklyRecurrence: {
      daysOfWeek: [2, 4], // Tuesday and Thursday
    },
  },
  {
    id: uuidv4(),
    title: "Quick Standup",
    startTime: dayjs().day(3).hour(10).minute(0).second(0).toISOString(), // Wednesday
    endTime: dayjs().day(3).hour(10).minute(15).second(0).toISOString(),
    category: "work",
    recurrencePattern: "none",
  },
  {
    id: uuidv4(),
    title: "Design Sprint",
    startTime: dayjs().day(5).hour(11).minute(30).second(0).toISOString(), // Friday
    endTime: dayjs().day(5).hour(14).minute(15).second(0).toISOString(),
    category: "work",
    recurrencePattern: "none",
  },
  {
    id: uuidv4(),
    title: "Doctor Appointment",
    startTime: dayjs().day(6).hour(16).minute(45).second(0).toISOString(), // Saturday
    endTime: dayjs().day(6).hour(17).minute(30).second(0).toISOString(),
    category: "personal",
    recurrencePattern: "none",
  },
];
