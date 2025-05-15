import { combineReducers } from "@reduxjs/toolkit";
import calendarReducer from "./slices/calendar/calendarSlice";

const rootReducer = combineReducers({
  calendar: calendarReducer,
});

export default rootReducer;
