import { useTheme } from "@/context/ThemeContext";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors";

type Props = {
  title: string;
  amount: number;
  type: "income" | "expense";
};

export default function SummaryCard({ title, amount, type }: Props) {
  const isIncome = type === "income";
  const { isDarkMode } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: isDarkMode ? "#1F2937" : COLORS.white },
      ]}
    >
      <Text
        style={[styles.title, { color: isDarkMode ? "#D1D5DB" : COLORS.gray }]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.amount,
          {
            color: isIncome ? COLORS.green : COLORS.red,
          },
        ]}
      >
        ₹{amount.toLocaleString("en-IN")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 18,
    borderRadius: 18,
    marginHorizontal: 5,
    elevation: 2,
  },

  title: {
    color: COLORS.gray,
    fontSize: 14,
  },

  amount: {
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 8,
  },
});
