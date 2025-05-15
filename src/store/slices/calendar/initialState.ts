import { InitialState, sampleEvents } from "../../../types/calendar";

export const initialState: InitialState = {
  events: sampleEvents || [],
  isEventModalOpen: false,
  selectedDate: null,
  selectedEvent: null,
};
