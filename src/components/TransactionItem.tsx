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
    <View style={styles.container}>
      {/* Left side */}
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{isIncome ? "💰" : "💸"}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{transaction.title}</Text>

          <Text style={styles.category}>{transaction.category}</Text>

          <Text style={styles.date}>
            {new Date(transaction.date).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Right side */}
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

        {/* Delete button */}
        {/* Delete button - only shown when onDelete is provided */}
        {onDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete</Text>
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

  icon: {
    fontSize: 22,
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
