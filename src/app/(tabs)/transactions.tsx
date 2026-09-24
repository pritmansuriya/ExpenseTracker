import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEY = "transactions";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
};

type FilterType = "all" | "income" | "expense";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  const loadTransactions = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        setTransactions(JSON.parse(data));
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.log("Error loading transactions:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, []),
  );

  const deleteTransaction = async (id: string) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedTransactions = transactions.filter(
                (transaction) => transaction.id !== id,
              );

              await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updatedTransactions),
              );

              setTransactions(updatedTransactions);
            } catch (error) {
              console.log("Delete error:", error);
            }
          },
        },
      ],
    );
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") {
      return true;
    }

    return transaction.type === filter;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header with Title on Left & Small Add Button on Right */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.heading}>Transactions</Text>
          <Text style={styles.subtitle}>
            Manage all your income and expenses
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-transactions")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "income" && styles.activeFilter,
          ]}
          onPress={() => setFilter("income")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "income" && styles.activeFilterText,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "expense" && styles.activeFilter,
          ]}
          onPress={() => setFilter("expense")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "expense" && styles.activeFilterText,
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions */}
      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>

          <Text style={styles.emptyTitle}>No Transactions</Text>

          <Text style={styles.emptyText}>
            Add an income or expense to see it here.
          </Text>
        </View>
      ) : (
        filteredTransactions.map((transaction) => {
          const isIncome = transaction.type === "income";

          return (
            <View key={transaction.id} style={styles.transactionCard}>
              {/* Left */}
              <View style={styles.transactionInfo}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{isIncome ? "💰" : "💸"}</Text>
                </View>

                <View style={styles.details}>
                  <Text style={styles.title}>{transaction.title}</Text>

                  <Text style={styles.category}>{transaction.category}</Text>

                  <Text style={styles.date}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Right */}
              <View style={styles.rightSection}>
                <Text
                  style={[
                    styles.amount,
                    {
                      color: isIncome ? "#16A34A" : "#DC2626",
                    },
                  ]}
                >
                  {isIncome ? "+" : "-"} ₹
                  {transaction.amount.toLocaleString("en-IN")}
                </Text>

                {/* DELETE BUTTON */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteTransaction(transaction.id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },

  heading: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    padding: 4,
    borderRadius: 12,
    marginBottom: 20,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },

  activeFilter: {
    backgroundColor: "#2563EB",
  },

  filterText: {
    color: "#4B5563",
    fontWeight: "600",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
  },

  transactionInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  icon: {
    fontSize: 22,
  },

  details: {
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
    marginTop: 3,
  },

  rightSection: {
    alignItems: "flex-end",
    marginLeft: 10,
  },

  amount: {
    fontSize: 15,
    fontWeight: "bold",
  },

  deleteButton: {
    marginTop: 8,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },

  deleteText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
});
