import { useTheme } from "@/context/ThemeContext";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getBudget, saveBudget } from "@/utils/budgetStorage";

export default function MonthlyBudgetScreen() {
  const { colors } = useTheme();
  const [budget, setBudget] = useState(0);
  const [amount, setAmount] = useState("");

  const loadBudget = async () => {
    try {
      const savedBudget = await getBudget();

      setBudget(savedBudget);
      setAmount(savedBudget.toString());
    } catch (error) {
      console.log("Error loading budget:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBudget();
    }, []),
  );

  const handlSaveBudget = async () => {
    const newBudget = Number(amount);

    if (!amount || newBudget <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid budget amount.");
      return;
    }

    try {
      await saveBudget(newBudget);
      setBudget(newBudget);

      Alert.alert("Success", "Monthly budget saved successfully.");
    } catch (error) {
      console.log("Error saving budget:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Monthly Budget</Text>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.cardBorder },
        ]}
      >
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Current Budget
        </Text>

        <Text style={[styles.amount, { color: colors.primary }]}>
          ₹{budget.toLocaleString("en-IN")}
        </Text>
      </View>

      <Text style={[styles.inputLabel, { color: colors.text }]}>
        Set Monthly Budget
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter budget amount"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handlSaveBudget}>
        <Text style={styles.buttonText}>Save Budget</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 16,
    marginBottom: 25,
    elevation: 2,
    borderWidth: 1,
  },

  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },

  amount: {
    fontSize: 30,
    fontWeight: "700",
    color: "#2563EB",
  },

  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 16,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
