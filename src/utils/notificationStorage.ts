import { defaultNotifications } from "@/data/notification";
import { Notification } from "@/types/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "notifications";

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    // No notifications saved yet
    if (!data) {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultNotifications),
      );

      return defaultNotifications;
    }

    // data is definitely a string here
    const parsed: unknown = JSON.parse(data);

    return Array.isArray(parsed)
      ? (parsed as Notification[])
      : defaultNotifications;
  } catch (error) {
    console.log("Error loading notifications:", error);
    return defaultNotifications;
  }
};

// Alias for backwards compatibility
export const getnotifications = getNotifications;

export const saveNotifications = async (
  notifications: Notification[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.log("Error saving notifications:", error);
  }
};

export const addNotification = async (
  notification: Notification,
): Promise<Notification[]> => {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = [notification, ...notifications];
    await saveNotifications(updatedNotifications);
    return updatedNotifications;
  } catch (error) {
    console.log("Error adding notification:", error);
    return [];
  }
};

export const deleteNotification = async (
  id: string,
): Promise<Notification[]> => {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.filter((item) => item.id !== id);
    await saveNotifications(updatedNotifications);
    return updatedNotifications;
  } catch (error) {
    console.log("Error deleting notification:", error);
    return [];
  }
};

export const markNotificationAsRead = async (
  id: string,
): Promise<Notification[]> => {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.map((item) =>
      item.id === id ? { ...item, read: true } : item,
    );
    await saveNotifications(updatedNotifications);
    return updatedNotifications;
  } catch (error) {
    console.log("Error marking notification as read:", error);
    return [];
  }
};

export const clearAllNotifications = async (): Promise<void> => {
  try {
    await saveNotifications([]);
  } catch (error) {
    console.log("Error clearing notifications:", error);
  }
};
