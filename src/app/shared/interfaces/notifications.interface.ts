export interface NotificationInterface {
  title?: string;
  information: string;
  type: NotificationsTypes;
}

export type NotificationsTypes = 'success' | 'error';
