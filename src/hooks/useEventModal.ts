import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { RootState, useAppDispatch } from "../store";
import {
  closeEventModal,
  openEventModal,
} from "../store/slices/calendar/calendarSlice";
import {
  CalendarEvent,
  EventCategory,
  RecurrencePattern,
} from "../types/calendar";

export function useEventModal() {
  const dispatch = useAppDispatch();
  const { isEventModalOpen, selectedDate, selectedEvent } = useSelector(
    (state: RootState) => state.calendar
  );
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState<EventCategory>("work");
  const [recurrencePattern, setRecurrencePattern] =
    useState<RecurrencePattern>("none");
  const [weeklyDays, setWeeklyDays] = useState<number[]>([]);
  
  const isEditing = Boolean(selectedEvent);
  const isRecurring =
    selectedEvent?.recurrencePattern !== "none" &&
    selectedEvent?.recurrencePattern !== undefined;

  const initializeFormFromEvent = useCallback((event: CalendarEvent) => {
    const start = dayjs(event.startTime);
    const end = dayjs(event.endTime);

    setTitle(event.title);
    setStartDate(start.format("YYYY-MM-DD"));
    setStartTime(start.format("HH:mm"));
    setEndDate(end.format("YYYY-MM-DD"));
    setEndTime(end.format("HH:mm"));
    setCategory(event.category);
    setRecurrencePattern(event.recurrencePattern);
    setWeeklyDays(event.weeklyRecurrence?.daysOfWeek || [start.day()]);
  }, []);

  const initializeFormFromDate = useCallback((dateStr?: string | null) => {
    const date = dateStr ? dayjs(dateStr) : dayjs();
    const end = date.add(1, "hour");

    setTitle("");
    setStartDate(date.format("YYYY-MM-DD"));
    setStartTime(date.format("HH:mm"));
    setEndDate(end.format("YYYY-MM-DD"));
    setEndTime(end.format("HH:mm"));
    setCategory("work");
    setRecurrencePattern("none");
    setWeeklyDays([date.day()]);
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      initializeFormFromEvent(selectedEvent);
    } else {
      initializeFormFromDate(selectedDate);
    }
  }, [
    selectedEvent,
    selectedDate,
    initializeFormFromEvent,
    initializeFormFromDate,
  ]);

  const handleDayToggle = (dayIndex: number) => {
    setWeeklyDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };
  const openEventForm = (date?: string, existingEvent?: CalendarEvent) => {
    dispatch(openEventModal({ date, existingEvent }));
  };
  const closeEventForm = () => {
    dispatch(closeEventModal());
  };

  return {
    isEventModalOpen,
    isEditing,
    isRecurring,
    selectedDate,
    selectedEvent,
    openEventForm,
    closeEventForm,

    state: {
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      category,
      recurrencePattern,
      weeklyDays,
    },
    handlers: {
      setTitle,
      setStartDate,
      setStartTime,
      setEndDate,
      setEndTime,
      setCategory,
      setRecurrencePattern,
      handleDayToggle,
    },
  };
}
