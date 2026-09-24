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

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

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

  // Show only latest 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.authHeader}>
        {isLoggedIn ? (
          <>
            <Text style={styles.userName}>Hello, {userName || "User"} 👋</Text>

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
      <Text style={styles.greeting}>Good Morning 👋</Text>

      <Text style={styles.subtitle}>Manage your finances</Text>

      <BalanceCard balance={balance} />

      <View style={styles.summaryRow}>
        <SummaryCard title="Income" amount={income} type="income" />

        <SummaryCard title="Expenses" amount={expenses} type="expense" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        <Text style={styles.seeAll}>See All</Text>
      </View>

      {recentTransactions.length === 0 ? (
        <Text style={styles.emptyText}>No transactions yet</Text>
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
