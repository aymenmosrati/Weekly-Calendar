import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { CalendarEvent } from "../../../types/calendar";
import { v4 as uuidv4 } from "uuid";

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    openEventModal: (
      state,
      action: PayloadAction<{ date?: string; existingEvent?: CalendarEvent }>
    ) => {
      state.isEventModalOpen = true;
      state.selectedDate = action.payload.date || null;
      state.selectedEvent = action.payload.existingEvent || null;
    },
    closeEventModal: (state) => {
      state.isEventModalOpen = false;
      state.selectedDate = null;
      state.selectedEvent = null;
    },
    addEvent(state, action: PayloadAction<Omit<CalendarEvent, "id">>) {
      const newEvent: CalendarEvent = {
        ...action.payload,
        id: uuidv4(),
      };
      state.events.push(newEvent);
    },

    updateEvent(state, action: PayloadAction<CalendarEvent>) {
      const updatedEvent = action.payload;
      state.events = state.events?.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      );
    },

    deleteEvent(state, action: PayloadAction<{ eventId: string }>) {
      const { eventId } = action.payload;
      const eventToDelete = state.events.find((e) => e.id === eventId);
      if (!eventToDelete) return;
      const isRecurring = eventToDelete.recurrencePattern !== "none";

      if (isRecurring) {
        state.events = state.events.filter(
          (e) =>
            !(
              e.id === eventToDelete.id &&
              e.recurrencePattern === eventToDelete.recurrencePattern
            )
        );
      } else {
        state.events = state.events.filter((event) => event.id !== eventId);
      }
    },
  },
});

export const {
  openEventModal,
  closeEventModal,
  addEvent,
  updateEvent,
  deleteEvent,
} = calendarSlice.actions;

export default calendarSlice.reducer;
