
export enum NotificationType {
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
}

export interface NotificationConfig {
  message: string;
  action?: string;
  duration?: number;
}
