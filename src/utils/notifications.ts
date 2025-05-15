import { notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";

const DEFAULT_DURATION = 3;
const DEFAULT_PLACEMENT: NotificationPlacement = "topRight";

export const showSuccess = (title: string, description: string) =>
  notification.success({
    message: title,
    description,
    duration: DEFAULT_DURATION,
    placement: DEFAULT_PLACEMENT,
    style: {
      backgroundColor: "#f6ffed",
      borderLeft: "4px solid #52c41a",
    },
  });

export const showError = (title: string, description: string) =>
  notification.error({
    message: title,
    description,
    duration: DEFAULT_DURATION,
    placement: DEFAULT_PLACEMENT,
    style: {
      backgroundColor: "#fff2f0",
      borderLeft: "4px solid #ff4d4f",
    },
  });

export const showInfo = (title: string, description: string) =>
  notification.info({
    message: title,
    description,
    duration: DEFAULT_DURATION,
    placement: DEFAULT_PLACEMENT,
    style: {
  backgroundColor: '#e6f7ff',
  borderLeft: '4px solid #1890ff',
},
  });
