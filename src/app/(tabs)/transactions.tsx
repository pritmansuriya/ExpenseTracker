import { useTheme } from "@/context/ThemeContext";
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

const TRANSACTION_TYPES = [
  { label: "All", value: "all" },
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
];

const DATE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

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
  const { isDarkMode } = useTheme();
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
    if (dateFilter === "all") return true;

    const transactionDateObject = new Date(transactionDate);
    const today = new Date();

    if (dateFilter === "today") {
      return transactionDateObject.toDateString() === today.toDateString();
    }

    if (dateFilter === "month") {
      return (
        transactionDateObject.getMonth() === today.getMonth() &&
        transactionDateObject.getFullYear() === today.getFullYear()
      );
    }

    if (dateFilter === "week") {
      const startOfWeek = new Date(today);

      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      return transactionDateObject >= startOfWeek;
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
      style={[styles.container, { backgroundColor: "transparent" }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text
            style={[
              styles.heading,
              { color: isDarkMode ? "#F9FAFB" : "#111827" },
            ]}
          >
            Transactions
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: isDarkMode ? "#D1D5DB" : "#6B7280" },
            ]}
          >
            Manage all your income and expenses
          </Text>
        </View>

        <View style={styles.headerButtons}>
          {/* Export Button */}
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => router.push("/export-transaction")}
            activeOpacity={0.8}
          >
            <Ionicons name="download-outline" size={19} color="#2563EB" />

            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>

          {/* Add Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/add-transactions")}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />

            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            borderColor: isDarkMode ? "#374151" : "#D1D5DB",
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={isDarkMode ? "#D1D5DB" : "#6B7280"}
        />

        <TextInput
          style={[
            styles.searchInput,
            { color: isDarkMode ? "#F9FAFB" : "#111827" },
          ]}
          placeholder="Search transactions..."
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#9CA3AF"}
          value={search}
          onChangeText={setSearch}
        />

        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={isDarkMode ? "#D1D5DB" : "#9CA3AF"}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text
        style={[
          styles.sectionTitle,
          { color: isDarkMode ? "#F9FAFB" : "#111827" },
        ]}
      >
        Transaction Type
      </Text>

      <View
        style={[
          styles.filterContainer,
          { backgroundColor: isDarkMode ? "#374151" : "#E5E7EB" },
        ]}
      >
        {TRANSACTION_TYPES.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.filterButton,
              filter === item.value && styles.activeFilter,
            ]}
            onPress={() => setFilter(item.value as FilterType)}
          >
            <Text
              style={[
                styles.filterText,
                filter === item.value && styles.activeFilterText,
                {
                  color:
                    isDarkMode && filter !== item.value ? "#D1D5DB" : undefined,
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text
        style={[
          styles.sectionTitle,
          { color: isDarkMode ? "#F9FAFB" : "#111827" },
        ]}
      >
        Category
      </Text>

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
              {
                backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                borderColor: isDarkMode ? "#374151" : "#D1D5DB",
              },
              categoryFilter === category && styles.activeCategoryButton,
            ]}
            onPress={() => setCategoryFilter(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                {
                  color:
                    categoryFilter === category
                      ? "#FFFFFF"
                      : isDarkMode
                        ? "#E5E7EB"
                        : "#374151",
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text
        style={[
          styles.sectionTitle,
          { color: isDarkMode ? "#F9FAFB" : "#111827" },
        ]}
      >
        Date
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {DATE_FILTERS.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.dateButton,
              {
                backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                borderColor: isDarkMode ? "#374151" : "#D1D5DB",
              },
              dateFilter === item.value && styles.activeDateButton,
            ]}
            onPress={() => setDateFilter(item.value as DateFilter)}
          >
            <Text
              style={[
                styles.dateButtonText,
                {
                  color:
                    dateFilter === item.value
                      ? "#FFFFFF"
                      : isDarkMode
                        ? "#E5E7EB"
                        : "#374151",
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.resultHeader}>
        <Text
          style={[
            styles.resultText,
            { color: isDarkMode ? "#D1D5DB" : "#6B7280" },
          ]}
        >
          {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? "s" : ""}
        </Text>

        {hasActiveFilters && (
          <TouchableOpacity onPress={clearFilters}>
            <Text
              style={[
                styles.clearText,
                { color: isDarkMode ? "#93C5FD" : "#2563EB" },
              ]}
            >
              Clear Filters
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>

          <Text
            style={[
              styles.emptyTitle,
              { color: isDarkMode ? "#F9FAFB" : "#111827" },
            ]}
          >
            No Transactions Found
          </Text>

          <Text
            style={[
              styles.emptyText,
              { color: isDarkMode ? "#D1D5DB" : "#6B7280" },
            ]}
          >
            Try changing your search or filters.
          </Text>
        </View>
      ) : (
        filteredTransactions.map((transaction) => {
          const isIncome = transaction.type === "income";

          return (
            <View
              key={transaction.id}
              style={[
                styles.transactionCard,
                { backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF" },
              ]}
            >
              <View style={styles.transactionInfo}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: isDarkMode ? "#0F172A" : "#F3F4F6" },
                  ]}
                >
                  <Text style={styles.icon}>{isIncome ? "💰" : "💸"}</Text>
                </View>

                <View style={styles.details}>
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
                    style={[
                      styles.date,
                      { color: isDarkMode ? "#9CA3AF" : "#9CA3AF" },
                    ]}
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
                  {isIncome ? "+" : "-"} ₹
                  {transaction.amount.toLocaleString("en-IN")}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    { backgroundColor: isDarkMode ? "#374151" : "#FEE2E2" },
                  ]}
                  onPress={() => deleteTransaction(transaction.id)}
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

  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 5,
  },

  exportButtonText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
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
