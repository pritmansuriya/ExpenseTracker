import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors";

type Props = {
  balance: number;
};

export default function BalanceCard({ balance }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Total Balance</Text>

      <Text style={styles.balance}>₹{balance.toLocaleString("en-IN")}</Text>

      <Text style={styles.subtitle}>Available balance</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },

  label: {
    color: COLORS.white,
    fontSize: 15,
  },

  balance: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 8,
  },

  subtitle: {
    color: "#DBEAFE",
    fontSize: 13,
    marginTop: 6,
  },
});
