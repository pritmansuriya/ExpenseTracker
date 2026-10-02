import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
};

type Props = {
  transaction: Transaction;
  onDelete?: (id: string) => void;
};

export default function TransactionItem({ transaction, onDelete }: Props) {
  const { isDarkMode } = useTheme();
  const isIncome = transaction.type === "income";

  const handleDelete = () => {
    if (!onDelete) {
      return;
    }

    Alert.alert("Delete Transaction", `Delete "${transaction.title}"?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(transaction.id),
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF" },
      ]}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: isDarkMode ? "#0F172A" : "#F3F4F6" },
          ]}
        >
          <Ionicons
            name={
              isIncome ? "arrow-down-circle-outline" : "arrow-up-circle-outline"
            }
            size={24}
            color={isIncome ? "#16A34A" : "#DC2626"}
          />
        </View>

        <View style={styles.info}>
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? "#F9FAFB" : "#111827" },
            ]}
          >
            {transaction.title}
          </Text>

          <Text
            style={[
              styles.category,
              { color: isDarkMode ? "#D1D5DB" : "#6B7280" },
            ]}
          >
            {transaction.category}
          </Text>

          <Text
            style={[styles.date, { color: isDarkMode ? "#9CA3AF" : "#9CA3AF" }]}
          >
            {new Date(transaction.date).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text
          style={[
            styles.amount,
            {
              color: isIncome ? "#16A34A" : "#DC2626",
            },
          ]}
        >
          {isIncome ? "+" : "-"} ₹{transaction.amount.toLocaleString("en-IN")}
        </Text>

        {onDelete && (
          <TouchableOpacity
            style={[
              styles.deleteButton,
              { backgroundColor: isDarkMode ? "#374151" : "#FEE2E2" },
            ]}
            onPress={handleDelete}
          >
            <Text
              style={[
                styles.deleteText,
                { color: isDarkMode ? "#FCA5A5" : "#DC2626" },
              ]}
            >
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  category: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  date: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },

  rightSection: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 15,
    fontWeight: "bold",
  },

  deleteButton: {
    marginTop: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  deleteText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
  },
});
