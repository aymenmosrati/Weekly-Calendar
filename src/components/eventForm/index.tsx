import {
  Modal,
  Button,
  Input,
  DatePicker,
  TimePicker,
  Radio,
  Form,
  Space,
  Typography,
  message,
} from "antd";
import { Repeat } from "lucide-react";
import dayjs from "dayjs";
import { useEventModal } from "../../hooks/useEventModal";
import { useAppDispatch } from "../../store";
import {
  addEvent,
  deleteEvent,
  updateEvent,
} from "../../store/slices/calendar/calendarSlice";
import { CalendarEvent } from "../../types/calendar";
import { showError, showInfo, showSuccess } from "../../utils/notifications";

interface EventFormProps {
  isOpen: boolean;
}
const { Title } = Typography;

const EventForm: React.FC<EventFormProps> = ({ isOpen }) => {
  const dispatch = useAppDispatch();
  const {
    closeEventForm,
    selectedEvent,
    isEditing,
    isRecurring,
    state,
    handlers,
  } = useEventModal();
  const {
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    category,
    recurrencePattern,
    weeklyDays,
  } = state;
  const {
    setTitle,
    setStartDate,
    setStartTime,
    setEndDate,
    setEndTime,
    setCategory,
    setRecurrencePattern,
    handleDayToggle,
  } = handlers;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      message.error("Title is required.");
      return;
    }

    const startDateTime = `${startDate}T${startTime}:00`;
    const endDateTime = `${endDate}T${endTime}:00`;
    const eventData: Omit<CalendarEvent, "id"> & Partial<CalendarEvent> = {
      title,
      startTime: dayjs(startDateTime).toISOString(),
      endTime: dayjs(endDateTime).toISOString(),
      category,
      recurrencePattern,
    };

    if (recurrencePattern === "weekly") {
      eventData.weeklyRecurrence = {
        daysOfWeek: weeklyDays,
      };
    }

    if (isEditing && selectedEvent) {
      dispatch(updateEvent({ ...selectedEvent, ...eventData }));
      showInfo("Event updated!", selectedEvent.title);
    } else {
      dispatch(addEvent(eventData));
      showSuccess("Event created!", eventData.title);
    }
    closeEventForm();
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      dispatch(deleteEvent({ eventId: selectedEvent.id }));
      closeEventForm();
      showError("Event deleted!", selectedEvent.title);
    }
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Modal
      open={isOpen}
      onCancel={closeEventForm}
      footer={null}
      className="event-modal"
      width={480}
    >
      <div className="event-modal__header">
        <Title level={4} className="event-modal__title">
          {isEditing ? "Edit Event" : "Add Event"}
          {isRecurring && <Repeat size={16} className="repeat-icon" />}
        </Title>
      </div>

      <Form layout="vertical" onFinish={handleSubmit} className="event-form">
        <Form.Item label="Title" required>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>

        <div className="event-form__grid">
          <Form.Item label="Start Date" required>
            <DatePicker
              value={dayjs(startDate)}
              onChange={(val) => setStartDate(val?.toISOString() || "")}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item label="Start Time" required>
            <TimePicker
              value={dayjs(startTime, "HH:mm")}
              format="HH:mm"
              onChange={(val) => setStartTime(val?.format("HH:mm") || "")}
              allowClear={false}
            />
          </Form.Item>
        </div>

        <div className="event-form__grid">
          <Form.Item label="End Date" required>
            <DatePicker
              value={dayjs(endDate)}
              onChange={(val) => setEndDate(val?.toISOString() || "")}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item label="End Time" required>
            <TimePicker
              value={dayjs(endTime, "HH:mm")}
              format="HH:mm"
              onChange={(val) => setEndTime(val?.format("HH:mm") || "")}
              allowClear={false}
            />
          </Form.Item>
        </div>

        <Form.Item label="Category" required>
          <Radio.Group
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <Space>
              <Radio value="work" className="radio-work">
                Work
              </Radio>
              <Radio value="personal" className="radio-personal">
                Personal
              </Radio>
              <Radio value="meeting" className="radio-meeting">
                Meeting
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Recurrence">
          <Radio.Group
            onChange={(e) => setRecurrencePattern(e.target.value)}
            value={recurrencePattern}
          >
            <Space>
              <Radio value="none">None</Radio>
              <Radio value="daily">Daily</Radio>
              <Radio value="weekly">Weekly</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        {recurrencePattern === "weekly" && (
          <Form.Item label="Repeat on">
            <div className="event-form__days">
              {daysOfWeek.map((day, index) => (
                <div
                  key={day}
                  className={`event-form__day ${
                    weeklyDays.includes(index) ? "active" : ""
                  }`}
                  onClick={() => handleDayToggle(index)}
                >
                  {day.charAt(0)}
                </div>
              ))}
            </div>
          </Form.Item>
        )}

        <div className="event-form__footer">
          <div>
            {isEditing && (
              <Button
                size="large"
                color="danger"
                variant="solid"
                onClick={handleDeleteEvent}
              >
                Delete
              </Button>
            )}
          </div>
          <Space>
            <Button
              size="large"
              color="default"
              variant="filled"
              onClick={closeEventForm}
            >
              Cancel
            </Button>
            <Button
              size="large"
              color="default"
              variant="solid"
              htmlType="submit"
              onClick={handleSubmit}
            >
              {isEditing ? "Update" : "Add Event"}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default EventForm;
