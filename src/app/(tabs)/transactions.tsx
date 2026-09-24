import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
type DateFilter = "all" | "today" | "week" | "month";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Filters
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

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

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(
      new Set(transactions.map((transaction) => transaction.category)),
    ),
  ];

  // Check date filter
  const matchesDateFilter = (transactionDate: string) => {
    if (dateFilter === "all") {
      return true;
    }

    const transactionDateObject = new Date(transactionDate);
    const today = new Date();

    // Today
    if (dateFilter === "today") {
      return (
        transactionDateObject.getDate() === today.getDate() &&
        transactionDateObject.getMonth() === today.getMonth() &&
        transactionDateObject.getFullYear() === today.getFullYear()
      );
    }

    // This Week
    if (dateFilter === "week") {
      const startOfWeek = new Date(today);

      const day = today.getDay();

      startOfWeek.setDate(today.getDate() - day);
      startOfWeek.setHours(0, 0, 0, 0);

      return transactionDateObject >= startOfWeek;
    }

    // This Month
    if (dateFilter === "month") {
      return (
        transactionDateObject.getMonth() === today.getMonth() &&
        transactionDateObject.getFullYear() === today.getFullYear()
      );
    }

    return true;
  };

  // Apply all filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Search
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      transaction.title.toLowerCase().includes(searchText) ||
      transaction.category.toLowerCase().includes(searchText);

    // Income / Expense
    const matchesType = filter === "all" || transaction.type === filter;

    // Category
    const matchesCategory =
      categoryFilter === "All" || transaction.category === categoryFilter;

    // Date
    const matchesDate = matchesDateFilter(transaction.date);

    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setFilter("all");
    setCategoryFilter("All");
    setDateFilter("all");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    filter !== "all" ||
    categoryFilter !== "All" ||
    dateFilter !== "all";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
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

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6B7280" />

        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />

        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Income / Expense Filter */}
      <Text style={styles.sectionTitle}>Transaction Type</Text>

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
            filter === "income" && styles.activeIncomeFilter,
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
            filter === "expense" && styles.activeExpenseFilter,
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

      {/* Category */}
      <Text style={styles.sectionTitle}>Category</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              categoryFilter === category && styles.activeCategoryButton,
            ]}
            onPress={() => setCategoryFilter(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                categoryFilter === category && styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Date Filter */}
      <Text style={styles.sectionTitle}>Date</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        <TouchableOpacity
          style={[
            styles.dateButton,
            dateFilter === "all" && styles.activeDateButton,
          ]}
          onPress={() => setDateFilter("all")}
        >
          <Text
            style={[
              styles.dateButtonText,
              dateFilter === "all" && styles.activeDateText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.dateButton,
            dateFilter === "today" && styles.activeDateButton,
          ]}
          onPress={() => setDateFilter("today")}
        >
          <Text
            style={[
              styles.dateButtonText,
              dateFilter === "today" && styles.activeDateText,
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.dateButton,
            dateFilter === "week" && styles.activeDateButton,
          ]}
          onPress={() => setDateFilter("week")}
        >
          <Text
            style={[
              styles.dateButtonText,
              dateFilter === "week" && styles.activeDateText,
            ]}
          >
            This Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.dateButton,
            dateFilter === "month" && styles.activeDateButton,
          ]}
          onPress={() => setDateFilter("month")}
        >
          <Text
            style={[
              styles.dateButtonText,
              dateFilter === "month" && styles.activeDateText,
            ]}
          >
            This Month
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Results */}
      <View style={styles.resultHeader}>
        <Text style={styles.resultText}>
          {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? "s" : ""}
        </Text>

        {hasActiveFilters && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Transactions */}
      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>

          <Text style={styles.emptyTitle}>No Transactions Found</Text>

          <Text style={styles.emptyText}>
            Try changing your search or filters.
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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 5,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    marginLeft: 10,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 18,
    marginBottom: 10,
  },

  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    padding: 4,
    borderRadius: 12,
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

  activeIncomeFilter: {
    backgroundColor: "#16A34A",
  },

  activeExpenseFilter: {
    backgroundColor: "#DC2626",
  },

  filterText: {
    color: "#4B5563",
    fontWeight: "600",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  horizontalList: {
    gap: 8,
    paddingRight: 10,
  },

  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  activeCategoryButton: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  categoryButtonText: {
    color: "#374151",
    fontWeight: "500",
  },

  activeCategoryText: {
    color: "#FFFFFF",
  },

  dateButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  activeDateButton: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  dateButtonText: {
    color: "#374151",
    fontWeight: "500",
  },

  activeDateText: {
    color: "#FFFFFF",
  },

  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  resultText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },

  clearText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
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
