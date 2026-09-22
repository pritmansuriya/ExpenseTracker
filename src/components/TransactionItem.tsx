import { StyleSheet, Text, View } from "react-native";
import { transaction } from "../(tabs)/transactions";
import { COLORS } from "../constants/colors";

type Props = {
  transaction: transaction;
};

export default function TransactionItem({ transaction }: Props) {
  const isIncome = transaction.type === "income";

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{transaction.icon}</Text>
        </View>

        <View>
          <Text style={styles.title}>{transaction.title}</Text>

          <Text style={styles.date}>{transaction.date}</Text>
        </View>
      </View>

      <Text
        style={[
          styles.amount,
          {
            color: isIncome ? COLORS.green : COLORS.red,
          },
        ]}
      >
        {isIncome ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    padding: 15,
    marginBottom: 10,
    borderRadius: 16,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  icon: {
    fontSize: 22,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },

  date: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 3,
  },

  amount: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
