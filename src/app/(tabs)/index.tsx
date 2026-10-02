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
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import BalanceCard from "@/components/BalanceCard";
import SummaryCard from "../../components/SummaryCard";
import TransactionItem from "../../components/TransactionItem";
import { COLORS } from "../../constants/colors";

const STORAGE_KEY = "transactions";

type Transaction = {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
};

type MonthSummary = {
  key: string;
  label: string;
  fullLabel: string;
  income: number;
  expenses: number;
};

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const buildMonthlySummaries = (
  transactions: Transaction[],
  monthCount: number,
): MonthSummary[] => {
  const totalsByMonth = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const key = getMonthKey(date);
    const totals = totalsByMonth.get(key) ?? { income: 0, expenses: 0 };

    if (transaction.type === "income") {
      totals.income += transaction.amount;
    } else {
      totals.expenses += transaction.amount;
    }

    totalsByMonth.set(key, totals);
  });

  const currentDate = new Date();

  return Array.from({ length: monthCount + 1 }, (_, index) => {
    const monthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - monthCount + index,
      1,
    );
    const key = getMonthKey(monthDate);
    const totals = totalsByMonth.get(key) ?? { income: 0, expenses: 0 };

    return {
      key,
      label: monthDate.toLocaleDateString("en-IN", { month: "short" }),
      fullLabel: monthDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
      ...totals,
    };
  });
};

const formatCurrency = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

const CATEGORY_COLORS = ["#0D9488", "#D97706", "#2563EB", "#DC2626", "#65A30D"];

export default function HomeScreen() {
  const { isDarkMode } = useTheme();
  const { width } = useWindowDimensions();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [monthCount, setMonthCount] = useState<3 | 6 | 12>(6);
  const [selectedMonthKey, setSelectedMonthKey] = useState(
    getMonthKey(new Date()),
  );

  const loadTransactions = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        const savedTransactions: Transaction[] = JSON.parse(data);

        setTransactions(savedTransactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.log("Error loading transactions:", error);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const loggedIn = await AsyncStorage.getItem("loggedIn");
      const userData = await AsyncStorage.getItem("user");

      setIsLoggedIn(loggedIn === "true");

      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.name || "");
      } else {
        setUserName("");
      }
    } catch (error) {
      console.log("Auth check error:", error);
    }
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.setItem("loggedIn", "false");

            setIsLoggedIn(false);
            setUserName("");

            router.replace("/(tabs)");
          } catch (error) {
            console.log("Logout error:", error);
          }
        },
      },
    ]);
  };
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
      checkAuth();
    }, [loadTransactions, checkAuth]),
  );

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = income - expenses;

  const monthlySummaries = buildMonthlySummaries(transactions, monthCount);
  const chartMonths = monthlySummaries.slice(1);
  const selectedMonth =
    chartMonths.find((month) => month.key === selectedMonthKey) ??
    chartMonths[chartMonths.length - 1];
  const selectedMonthIndex = monthlySummaries.findIndex(
    (month) => month.key === selectedMonth.key,
  );
  const previousMonth = monthlySummaries[selectedMonthIndex - 1];
  const maximumMonthlyValue = Math.max(
    1,
    ...chartMonths.flatMap((month) => [month.income, month.expenses]),
  );
  const selectedMonthTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    return (
      !Number.isNaN(date.getTime()) && getMonthKey(date) === selectedMonth.key
    );
  });
  const expensesByCategory = new Map<string, number>();

  selectedMonthTransactions.forEach((transaction) => {
    if (transaction.type === "expense") {
      const category = transaction.category.trim() || "Uncategorized";
      expensesByCategory.set(
        category,
        (expensesByCategory.get(category) ?? 0) + transaction.amount,
      );
    }
  });

  const sortedCategories = Array.from(
    expensesByCategory,
    ([category, amount]) => ({
      category,
      amount,
    }),
  ).sort((first, second) => second.amount - first.amount);
  const topCategories = sortedCategories.slice(0, 5);
  const otherCategoryTotal = sortedCategories
    .slice(5)
    .reduce((total, category) => total + category.amount, 0);

  if (otherCategoryTotal > 0) {
    topCategories.push({ category: "Other", amount: otherCategoryTotal });
  }

  const maximumCategoryValue = Math.max(
    1,
    ...topCategories.map((category) => category.amount),
  );
  const expenseChange = selectedMonth.expenses - previousMonth.expenses;
  const expenseChangePercent = previousMonth.expenses
    ? Math.round(Math.abs(expenseChange / previousMonth.expenses) * 100)
    : null;
  const comparisonText =
    expenseChange === 0
      ? "Same as previous month"
      : expenseChangePercent === null
        ? "Expenses started this month"
        : `Expenses ${expenseChange < 0 ? "down" : "up"} ${expenseChangePercent}% vs previous month`;
  const comparisonColor =
    expenseChange < 0 ? "#16A34A" : expenseChange > 0 ? "#DC2626" : COLORS.gray;
  const chartWidth = Math.max(width - 80, chartMonths.length * 44);

  const openTransactions = (params: { month: string; category?: string }) => {
    router.push({ pathname: "/(tabs)/transactions", params });
  };

  // Show only latest 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: "transparent" }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.authHeader}>
        {isLoggedIn ? (
          <>
            <Text
              style={[
                styles.userName,
                { color: isDarkMode ? "#F9FAFB" : COLORS.black },
              ]}
            >
              Hello, {userName || "User"}{" "}
              <Ionicons
                name="hand-right-outline"
                size={16}
                color={isDarkMode ? "#F9FAFB" : COLORS.black}
              />
            </Text>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.authButtons}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text
        style={[
          styles.greeting,
          { color: isDarkMode ? "#F9FAFB" : COLORS.black },
        ]}
      >
        Good Morning{" "}
        <Ionicons
          name="hand-right-outline"
          size={22}
          color={isDarkMode ? "#F9FAFB" : COLORS.black}
        />
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: isDarkMode ? "#D1D5DB" : COLORS.gray },
        ]}
      >
        Manage your finances
      </Text>

      <BalanceCard balance={balance} />

      <View style={styles.summaryRow}>
        <SummaryCard title="Income" amount={income} type="income" />

        <SummaryCard title="Expenses" amount={expenses} type="expense" />
      </View>

      <View
        style={[
          styles.trendCard,
          {
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            borderColor: isDarkMode ? "#374151" : "#E5E7EB",
          },
        ]}
      >
        <View style={styles.trendHeader}>
          <Text
            style={[
              styles.trendTitle,
              { color: isDarkMode ? "#F9FAFB" : COLORS.black },
            ]}
          >
            Spending trends
          </Text>

          <View
            style={[
              styles.rangeSelector,
              { backgroundColor: isDarkMode ? "#111827" : "#F3F4F6" },
            ]}
          >
            {([3, 6, 12] as const).map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.rangeButton,
                  monthCount === count && styles.activeRangeButton,
                ]}
                onPress={() => {
                  setMonthCount(count);
                  setSelectedMonthKey(getMonthKey(new Date()));
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: monthCount === count }}
                accessibilityLabel={`Show ${count} months`}
              >
                <Text
                  style={[
                    styles.rangeButtonText,
                    {
                      color:
                        monthCount === count
                          ? "#FFFFFF"
                          : isDarkMode
                            ? "#D1D5DB"
                            : "#4B5563",
                    },
                  ]}
                >
                  {count}M
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendSwatch, { backgroundColor: "#16A34A" }]}
            />
            <Text
              style={[
                styles.legendText,
                { color: isDarkMode ? "#D1D5DB" : COLORS.gray },
              ]}
            >
              Income
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendSwatch, { backgroundColor: "#DC2626" }]}
            />
            <Text
              style={[
                styles.legendText,
                { color: isDarkMode ? "#D1D5DB" : COLORS.gray },
              ]}
            >
              Expenses
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: chartWidth }}
          style={styles.chartScroll}
        >
          <View style={styles.chartBars}>
            {chartMonths.map((month) => {
              const isSelected = month.key === selectedMonth.key;
              const incomeHeight = Math.max(
                month.income > 0 ? 3 : 2,
                (month.income / maximumMonthlyValue) * 88,
              );
              const expenseHeight = Math.max(
                month.expenses > 0 ? 3 : 2,
                (month.expenses / maximumMonthlyValue) * 88,
              );

              return (
                <TouchableOpacity
                  key={month.key}
                  style={[
                    styles.barGroup,
                    isSelected && {
                      backgroundColor: isDarkMode ? "#172554" : "#EFF6FF",
                    },
                  ]}
                  onPress={() => setSelectedMonthKey(month.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${month.fullLabel}: income ${formatCurrency(month.income)}, expenses ${formatCurrency(month.expenses)}`}
                >
                  <View style={styles.barPlot}>
                    <View style={styles.barPair}>
                      <View
                        style={[
                          styles.chartBar,
                          styles.incomeBar,
                          { height: incomeHeight },
                        ]}
                      />
                      <View
                        style={[
                          styles.chartBar,
                          styles.expenseBar,
                          { height: expenseHeight },
                        ]}
                      />
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.monthLabel,
                      { color: isDarkMode ? "#D1D5DB" : COLORS.gray },
                    ]}
                  >
                    {month.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {transactions.length === 0 && (
          <Text
            style={[
              styles.trendEmptyHint,
              { color: isDarkMode ? "#9CA3AF" : COLORS.gray },
            ]}
          >
            Add transactions to see monthly comparisons.
          </Text>
        )}

        <View style={styles.selectedMonthRow}>
          <Text
            style={[
              styles.selectedMonthLabel,
              { color: isDarkMode ? "#F9FAFB" : COLORS.black },
            ]}
          >
            {selectedMonth.fullLabel}
          </Text>
          <TouchableOpacity
            style={styles.viewTransactionsButton}
            onPress={() => openTransactions({ month: selectedMonth.key })}
            accessibilityRole="button"
            accessibilityLabel={`View transactions for ${selectedMonth.fullLabel}`}
          >
            <Text style={styles.viewTransactionsText}>Transactions</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.periodTotals}>
          <View style={styles.periodTotal}>
            <Text
              style={[
                styles.periodLabel,
                { color: isDarkMode ? "#9CA3AF" : COLORS.gray },
              ]}
            >
              Income
            </Text>
            <Text style={[styles.periodAmount, { color: "#16A34A" }]}>
              {formatCurrency(selectedMonth.income)}
            </Text>
          </View>
          <View style={styles.periodTotal}>
            <Text
              style={[
                styles.periodLabel,
                { color: isDarkMode ? "#9CA3AF" : COLORS.gray },
              ]}
            >
              Expenses
            </Text>
            <Text style={[styles.periodAmount, { color: "#DC2626" }]}>
              {formatCurrency(selectedMonth.expenses)}
            </Text>
          </View>
        </View>

        <Text style={[styles.comparisonText, { color: comparisonColor }]}>
          {comparisonText}
        </Text>

        <View
          style={[
            styles.categoryDivider,
            { backgroundColor: isDarkMode ? "#374151" : "#E5E7EB" },
          ]}
        />

        <Text
          style={[
            styles.categoryHeading,
            { color: isDarkMode ? "#F9FAFB" : COLORS.black },
          ]}
        >
          Spending by category
        </Text>

        {topCategories.length === 0 ? (
          <Text
            style={[
              styles.noCategoryText,
              { color: isDarkMode ? "#9CA3AF" : COLORS.gray },
            ]}
          >
            No expenses recorded for this month.
          </Text>
        ) : (
          topCategories.map((category, index) => {
            const categoryContent = (
              <>
                <View style={styles.categoryLabelRow}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.categoryLabel,
                      { color: isDarkMode ? "#E5E7EB" : "#374151" },
                    ]}
                  >
                    {category.category}
                  </Text>
                  <Text
                    style={[
                      styles.categoryAmount,
                      { color: isDarkMode ? "#F9FAFB" : COLORS.black },
                    ]}
                  >
                    {formatCurrency(category.amount)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.categoryTrack,
                    { backgroundColor: isDarkMode ? "#374151" : "#E5E7EB" },
                  ]}
                >
                  <View
                    style={[
                      styles.categoryFill,
                      {
                        width: `${(category.amount / maximumCategoryValue) * 100}%`,
                        backgroundColor:
                          CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                      },
                    ]}
                  />
                </View>
              </>
            );

            if (category.category === "Other") {
              return (
                <View key={category.category} style={styles.categoryRow}>
                  {categoryContent}
                </View>
              );
            }

            return (
              <TouchableOpacity
                key={category.category}
                style={styles.categoryRow}
                onPress={() =>
                  openTransactions({
                    month: selectedMonth.key,
                    category: category.category,
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`View ${category.category} expenses for ${selectedMonth.fullLabel}`}
              >
                {categoryContent}
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDarkMode ? "#F9FAFB" : COLORS.black },
          ]}
        >
          Recent Transactions
        </Text>

        <TouchableOpacity onPress={() => router.push("/(tabs)/transactions")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {recentTransactions.length === 0 ? (
        <Text
          style={[
            styles.emptyText,
            { color: isDarkMode ? "#D1D5DB" : COLORS.gray },
          ]}
        >
          No transactions yet
        </Text>
      ) : (
        recentTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.black,
  },

  subtitle: {
    color: COLORS.gray,
    fontSize: 15,
    marginTop: 5,
    marginBottom: 25,
  },

  summaryRow: {
    flexDirection: "row",
    marginHorizontal: -5,
    marginBottom: 30,
  },

  trendCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 28,
  },

  trendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  trendTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  rangeSelector: {
    flexDirection: "row",
    padding: 3,
    borderRadius: 9,
  },

  rangeButton: {
    minWidth: 34,
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 7,
  },

  activeRangeButton: {
    backgroundColor: COLORS.primary,
  },

  rangeButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },

  chartLegend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  legendSwatch: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },

  legendText: {
    fontSize: 12,
  },

  chartScroll: {
    marginTop: 12,
  },

  chartBars: {
    height: 132,
    flexDirection: "row",
    alignItems: "flex-end",
  },

  barGroup: {
    flex: 1,
    height: 128,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 2,
    paddingTop: 5,
    borderRadius: 7,
  },

  barPlot: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  barPair: {
    height: 92,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
  },

  chartBar: {
    width: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  incomeBar: {
    backgroundColor: "#16A34A",
  },

  expenseBar: {
    backgroundColor: "#DC2626",
  },

  monthLabel: {
    fontSize: 11,
    marginTop: 6,
  },

  trendEmptyHint: {
    fontSize: 12,
    marginTop: 6,
  },

  selectedMonthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },

  selectedMonthLabel: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "700",
  },

  viewTransactionsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  viewTransactionsText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },

  periodTotals: {
    flexDirection: "row",
    marginTop: 12,
  },

  periodTotal: {
    flex: 1,
  },

  periodLabel: {
    fontSize: 11,
  },

  periodAmount: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
  },

  comparisonText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 9,
  },

  categoryDivider: {
    height: 1,
    marginTop: 16,
    marginBottom: 14,
  },

  categoryHeading: {
    fontSize: 14,
    fontWeight: "700",
  },

  noCategoryText: {
    fontSize: 12,
    marginTop: 9,
  },

  categoryRow: {
    marginTop: 12,
  },

  categoryLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  categoryLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
  },

  categoryAmount: {
    fontSize: 12,
    fontWeight: "600",
  },

  categoryTrack: {
    height: 6,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 7,
  },

  categoryFill: {
    height: "100%",
    borderRadius: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
  },

  seeAll: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: COLORS.gray,
  },

  authHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },

  authButtons: {
    flexDirection: "row",
    gap: 10,
    marginLeft: "auto",
  },

  loginButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  loginText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },

  registerText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  logoutButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  logoutText: {
    color: "#DC2626",
    fontWeight: "600",
  },
});
