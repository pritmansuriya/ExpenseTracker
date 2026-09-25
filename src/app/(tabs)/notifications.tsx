import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Notification } from "@/types/notification";
import {
    clearAllNotifications,
    getNotifications,
    markNotificationAsRead,
    deleteNotification as removeNotificationStorage,
} from "@/utils/notificationStorage";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.log("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, []),
  );

  const handleMarkAsRead = async (id: string) => {
    const updated = await markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleDeleteNotification = (id: string) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = await removeNotificationStorage(id);
            setNotifications(updated);
          },
        },
      ],
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearAllNotifications();
            setNotifications([]);
          },
        },
      ],
    );
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "bill":
        return "🔴";

      case "budget":
        return "🟡";

      case "saving":
        return "🟢";

      case "transaction":
        return "🔵";

      default:
        return "🔔";
    }
  };

  const formatAmount = (amount?: number) => {
    if (amount === undefined) {
      return null;
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.read && styles.unreadCard]}
        onPress={() => handleMarkAsRead(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getIcon(item.type)}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.message}>{item.message}</Text>

          <View style={styles.bottomRow}>
            {item.amount !== undefined ? (
              <Text style={styles.amount}>{formatAmount(item.amount)}</Text>
            ) : (
              <View />
            )}

            <Text style={styles.time}>
              {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        {/* Visible Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={19} color="#9CA3AF" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Notifications</Text>
        {notifications && notifications.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={handleClearAll}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {!notifications || notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={60}
            color="#9CA3AF"
          />

          <Text style={styles.emptyText}>No notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 55,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  clearAllButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },

  clearAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },

  iconContainer: {
    width: 40,
    alignItems: "center",
    marginTop: 2,
  },

  icon: {
    fontSize: 24,
  },

  content: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#2563EB",
    marginLeft: 6,
  },

  message: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  amount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16A34A",
  },

  time: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  deleteButton: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
  },
});
