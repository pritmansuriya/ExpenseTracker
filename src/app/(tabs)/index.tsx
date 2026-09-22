import { ScrollView, StyleSheet, Text, View } from "react-native";

import BalanceCard from "@/components/BalanceCard";
import SummaryCard from "../../components/SummaryCard";
import TransactionItem from "../../components/TransactionItem";

import { transactions } from "@/constants/transactions";
import { COLORS } from "../../constants/colors";

export default function HomeScreen() {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = income - expenses;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
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
});
