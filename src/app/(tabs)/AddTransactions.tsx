import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEY = "transactions";

type TransactionType = "income" | "expense";

export default function AddTransactions() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<TransactionType>("expense");

  const handleAddTransaction = async () => {
    if (!title.trim() || !amount.trim() || !category.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      title: title.trim(),
      amount: numericAmount,
      type,
      category: category.trim(),
      date: new Date().toISOString(),
    };

    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);

      const existingTransactions = existingData ? JSON.parse(existingData) : [];

      const updatedTransactions = [newTransaction, ...existingTransactions];

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedTransactions),
      );

      Alert.alert(
        "Success",
        `${type === "income" ? "Income" : "Expense"} added successfully`,
      );

      setTitle("");
      setAmount("");
      setCategory("");
      setType("expense");

      router.back();
    } catch (error) {
      console.log("Error saving transaction:", error);
      Alert.alert("Error", "Failed to save transaction");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Transaction</Text>

      {/* Transaction Type */}
      <Text style={styles.label}>Transaction Type</Text>

      <View style={styles.radioContainer}>
        {/* Expense */}
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setType("expense")}
        >
          <View style={styles.radioOuter}>
            {type === "expense" && <View style={styles.radioInner} />}
          </View>

          <Text style={styles.radioText}>Expense</Text>
        </TouchableOpacity>

        {/* Income */}
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setType("income")}
        >
          <View style={styles.radioOuter}>
            {type === "income" && <View style={styles.radioInner} />}
          </View>

          <Text style={styles.radioText}>Income</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.label}>Title</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Grocery Shopping"
        value={title}
        onChangeText={setTitle}
      />

      {/* Amount */}
      <Text style={styles.label}>Amount</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Category */}
      <Text style={styles.label}>Category</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Food, Salary, Bills"
        value={category}
        onChangeText={setCategory}
      />

      {/* Save */}
      <TouchableOpacity style={styles.button} onPress={handleAddTransaction}>
        <Text style={styles.buttonText}>
          Add {type === "income" ? "Income" : "Expense"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#F9FAFB",
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },

  radioContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },

  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 30,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2563EB",
  },

  radioText: {
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});
