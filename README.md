# Weekly Calendar

A modern, interactive weekly calendar application built with React, TypeScript, and Redux Toolkit. This application allows users to manage events with different recurrence patterns, drag-and-drop functionality, and a clean, intuitive interface.

## Features

- 📅 Weekly calendar view with drag-and-drop event management
- 🔄 Support for recurring events (daily and weekly patterns)
- 🎨 Event categorization (Work, Personal, Meeting)
- 🎯 Interactive event creation and editing
- 📱 Responsive design
- 🎨 Modern UI with Ant Design components

## Recurrence Logic

The calendar supports three types of event recurrence patterns:

1. **None (One-time events)**

   - Events that occur only once
   - Can be freely dragged and dropped to new times/dates

2. **Daily Recurrence**

   - Events that repeat every day
   - Starts from the event's creation date
   - Continues indefinitely within the calendar view

3. **Weekly Recurrence**
   - Events that repeat on specific days of the week
   - Users can select multiple days (e.g., Monday and Wednesday)
   - Maintains the same time slot across selected days
   - Starts from the event's creation date

### Implementation Details

- Recurrence patterns are stored in the event object with the following structure:

  ```typescript
  type RecurrencePattern = "none" | "daily" | "weekly";

  interface WeeklyRecurrence {
    daysOfWeek: number[]; // 0-6 representing Sunday-Saturday
  }

  interface CalendarEvent {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    category: "work" | "personal" | "meeting";
    recurrencePattern: RecurrencePattern;
    weeklyRecurrence?: WeeklyRecurrence;
  }
  ```

- The calendar uses a filtering system to display recurring events:
  - For daily events: Shows the event on all days after the start date
  - For weekly events: Shows the event only on the selected days of the week
  - For one-time events: Shows the event only on its specific date

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd weekly-calendar
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── components/         # React components
│   ├── calendar/      # Calendar view components
│   └── eventForm/     # Event creation/editing form
├── hooks/             # Custom React hooks
├── store/             # Redux store and slices
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── styles/            # SCSS styles
```

## Technologies Used

- React 18
- TypeScript
- Redux Toolkit
- Ant Design
- date-fns
- react-beautiful-dnd
- Vite
- SCSS