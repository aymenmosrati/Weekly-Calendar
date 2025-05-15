import { Button } from "antd";
import dayjs from "dayjs";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Calendar, ChevronLeft, ChevronRight, Repeat } from "lucide-react";
import useWeeklyCalendar from "../../hooks/useWeeklyCalendar";
import { formatEventTime, getEventsForDay } from "../../utils/utils";
import { CalendarEvent } from "../../types/calendar";
import { useEventModal } from "../../hooks/useEventModal";
import { updateEvent } from "../../store/slices/calendar/calendarSlice";
import { useAppDispatch } from "../../store";
import { showInfo } from "../../utils/notifications";

const WeeklyCalendar = () => {
  const dispatch = useAppDispatch();
  const {
    events,
    currentWeekStart,
    weekEnd,
    goToNextWeek,
    goToPrevWeek,
    goToToday,
  } = useWeeklyCalendar();
  const { openEventForm } = useEventModal();

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, "day")
  );

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const handleCellClick = (date: dayjs.Dayjs, hour: string) => {
    const dateTime = `${date.format("YYYY-MM-DD")}T${hour}`;
    openEventForm(dateTime);
  };
  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    openEventForm(undefined, event);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const eventId = result.draggableId;
    const [srcDay, srcHour] = result.source.droppableId.split("_");
    const [destDay, destHour] = result.destination.droppableId.split("_");

    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    // Calculate the time difference between source and destination
    const srcDate = dayjs(srcDay);
    const destDate = dayjs(destDay);
    const hoursDiff = parseInt(destHour) - parseInt(srcHour);
    const daysDiff = destDate.diff(srcDate, "day");

    // Calculate the new start and end times
    const newStartTime = dayjs(event.startTime)
      .add(daysDiff, "day")
      .add(hoursDiff, "hour");
    const newEndTime = dayjs(event.endTime)
      .add(daysDiff, "day")
      .add(hoursDiff, "hour");

    // Create updated event with the new times
    const updatedEvent = {
      ...event,
      startTime: newStartTime.toISOString(),
      endTime: newEndTime.toISOString(),
    };

    // Handle different recurrence patterns
    if (event.recurrencePattern === "none") {
      dispatch(updateEvent(updatedEvent));
      showInfo("Event updated!", updatedEvent.title);
    } else if (event.recurrencePattern === "daily") {
      const updatedDailyEvent = {
        ...updatedEvent,
        recurrencePattern: "daily" as const,
      };
      dispatch(updateEvent(updatedDailyEvent));
      showInfo("Daily recurring event updated!", updatedEvent.title);
    } else if (event.recurrencePattern === "weekly" && event.weeklyRecurrence) {
      // For weekly events, maintain the same days of the week but shift them based on the new start date
      const originalDaysOfWeek = event.weeklyRecurrence.daysOfWeek;
      const originalStartDay = dayjs(event.startTime).day();
      const newStartDay = newStartTime.day();
      const dayShift = newStartDay - originalStartDay;

      // Shift all days of the week by the same amount, ensuring they stay within 0-6 range
      const updatedDaysOfWeek = originalDaysOfWeek.map((day) => {
        const shiftedDay = (day + dayShift) % 7;
        return shiftedDay >= 0 ? shiftedDay : shiftedDay + 7;
      });

      const updatedWeeklyRecurrence = {
        ...event.weeklyRecurrence,
        daysOfWeek: updatedDaysOfWeek,
      };

      const updatedWeeklyEvent = {
        ...updatedEvent,
        weeklyRecurrence: updatedWeeklyRecurrence,
      };

      dispatch(updateEvent(updatedWeeklyEvent));
      showInfo("Weekly recurring event updated! ", updatedEvent.title);
    }
  };

  const renderEvent = (
    event: CalendarEvent,
    hour: number,
    index: number
  ) => {
    const eventStart = dayjs(event.startTime);
    const eventEnd = dayjs(event.endTime);

    const eventStartHour = eventStart.hour();
    const eventEndHour = eventEnd.hour() + (eventEnd.minute() > 0 ? 1 : 0);

    // Determine if this event should be rendered at this hour
    const shouldRender = eventStartHour <= hour && eventEndHour > hour;
    if (!shouldRender) return null;

    // Calculate the duration in grid rows
    const durationHours = Math.min(
      eventEndHour - eventStartHour,
      24 - hour // Don't extend beyond the last hour of the day
    );

    // Only show event from its start time
    const isFirstHourOfEvent = hour === eventStartHour;
    if (!isFirstHourOfEvent) return null;

    return (
      <Draggable key={event.id} draggableId={event.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              height: `${durationHours * 60}px`,
              ...provided.draggableProps.style,
            }}
            className={`event-item ${event.category}`}
            onClick={(e) => handleEventClick(e, event)}
          >
            <div className="event-title">
              {event.title}
              {event.recurrencePattern !== "none" && (
                <Repeat size={14} className="repeat-icon" />
              )}
            </div>
            <div className="event-time">
              {formatEventTime(event.startTime, event.endTime)}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <>
      <div className="calendar-header">
        <div className="nav-buttons">
          <Button size="small" onClick={goToPrevWeek}>
            <ChevronLeft size={16} />
          </Button>
          <Button size="small" onClick={goToToday}>
            <Calendar size={16} />
            Today
          </Button>
          <Button size="small" onClick={goToNextWeek}>
            <ChevronRight size={16} />
          </Button>
        </div>

        <h2 className="week-range">
          {currentWeekStart.format("MMM D")} - {weekEnd.format("MMM D, YYYY")}
        </h2>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="schedule-wrapper">
          <div className="time-column">
            <div className="empty-cell"></div>
            {timeSlots?.map((time) => (
              <div key={time} className="time-slot">
                {time}
              </div>
            ))}
          </div>

          <div className="days-columns">
            {weekDays?.map((day) => (
              <div
                key={day.toString()}
                className={`day-column ${day.isSame(dayjs(), "day") ? "today" : ""}`}
              >
                <div
                  className={`day-header ${day.isSame(dayjs(), "day") ? "today" : ""}`}
                >
                  <div className="text-center">
                    <div className="day-name">{day.format("ddd")}</div>
                    <div className="day-number">{day.format("D")}</div>
                  </div>
                </div>

                {timeSlots?.map((time, i) => {
                  const dateWithHour = `${day.format("YYYY-MM-DD")}_${i}`;
                  const eventsForThisHour = getEventsForDay(
                    events,
                    day,
                    currentWeekStart,
                    weekEnd
                  );
                  return (
                    <Droppable droppableId={dateWithHour} key={dateWithHour}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="hour-slot"
                          onClick={() => handleCellClick(day, time)}
                        >
                          {eventsForThisHour?.map((event, index) =>
                            renderEvent(event, day, i, index)
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    </>
  );
};
export default WeeklyCalendar;
