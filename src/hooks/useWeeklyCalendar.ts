import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isBetween from "dayjs/plugin/isBetween";
import { useAppSelector } from "../store";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

const userTimezone = dayjs.tz.guess();

const useWeeklyCalendar = () => {
  const { events } = useAppSelector((state) => state.calendar);
  const [currentWeekStart, setCurrentWeekStart] = useState<Dayjs>(() => {
    const today = dayjs().tz(userTimezone);
    return today.day(0);
  });
  const weekEnd = currentWeekStart.add(6, "day");

  const goToNextWeek = () => {
    setCurrentWeekStart((current) => current.add(7, "day"));
  };
  const goToPrevWeek = () => {
    setCurrentWeekStart((current) => current.subtract(7, "day"));
  };
  const goToToday = () => {
    const today = dayjs().tz(userTimezone);
    setCurrentWeekStart(today.day(0));
  };

  return {
    events,
    currentWeekStart,
    weekEnd,
    goToNextWeek,
    goToPrevWeek,
    goToToday,
  };
};

export default useWeeklyCalendar;
