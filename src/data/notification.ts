import { Notification } from "@/types/notification";

export const notifications: Notification[] = [
  {
    id: "1",
    title: "Bill Reminder",
    message: "Electricity bill is due tomorrow.",
    amount: 1500,
    type: "bill",
    createdAt: new Date().toISOString(),
    read: false,
  },

  {
    id: "2",
    title: "Budget Alert",
    message: "You were used 80% of your Food budget.",
    type: "budget",
    createdAt: new Date().toISOString(),
    read: false,
  },

  {
    id: "3",
    title: "Savings Reminder",
    message: "Add money to your new Laptop goal.",
    type: "bill",
    createdAt: new Date().toISOString(),
    read: true,
  },

  {
    id: "4",
    title: "Transaction Reminder",
    message: "Dont forgot to record today expenses.",
    type: "bill",
    createdAt: new Date().toISOString(),
    read: true,
  },
];

export const defaultNotifications = notifications;
