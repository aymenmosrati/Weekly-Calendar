import CategoriesEvent from "../../components/categoriesEvent";
import WeeklyCalendar from "../../components/calendar";
import EventForm from "../../components/eventForm";
import { useEventModal } from "../../hooks/useEventModal";

const Calendar = () => {
  const { isEventModalOpen } = useEventModal();
  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-header__title">
          <h1>Weekly Calendar</h1>
          <p>Manage your recurring events</p>
        </div>

        {/* <Button
          size="large"
          color="default"
          variant="solid"
          onClick={() => openEventForm(dayjs())}
        >
          + New Event
        </Button> */}
      </header>

      <div className="calendar-container">
        <div className="calendar-wrapper">
          <WeeklyCalendar />
          <EventForm isOpen={isEventModalOpen} />
        </div>
      </div>

      <CategoriesEvent />
    </div>
  );
};

export default Calendar;
