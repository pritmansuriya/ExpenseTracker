export type NotificationType = "bill" | "budget" | "saving" | "transaction";

export type Notification = {
  id: string;
  title: string;
  message: string;
  amount?: number;
  type: NotificationType;
  createdAt: string;
  read: boolean;
};
