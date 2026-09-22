import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddTransactionScreen() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("22 Sep 2026");

  const handleAddTransaction = () => {
    if (!amount || !category) {
      Alert.alert("Error", "Please enter amount and category");
      return;
    }

    const transaction = {
      id: Date.now().toString(),
      amount: Number(amount),
      type,
      category,
      description,
      date,
    };

    console.log("New Transaction:", transaction);

    Alert.alert("Success", "Transaction added successfully");

    // Clear form
    setAmount("");
    setCategory("");
    setDescription("");
    setType("expense");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>

      {/* Amount */}
      <Text style={styles.label}>Amount</Text>

      <View style={styles.amountContainer}>
        <Text style={styles.currency}>₹</Text>

        <TextInput
          style={styles.amountInput}
          placeholder="0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {/* Type */}
      <Text style={styles.label}>Type</Text>

      <View style={styles.typeContainer}>
        <Pressable
          style={[
            styles.typeButton,
            type === "income" && styles.selectedIncome,
          ]}
          onPress={() => setType("income")}
        >
          <View
            style={[styles.radio, type === "income" && styles.radioSelected]}
          />

          <Text>Income</Text>
        </Pressable>

        <Pressable
          style={[
            styles.typeButton,
            type === "expense" && styles.selectedExpense,
          ]}
          onPress={() => setType("expense")}
        >
          <View
            style={[styles.radio, type === "expense" && styles.radioSelected]}
          />

          <Text>Expense</Text>
        </Pressable>
      </View>

      {/* Category */}
      <Text style={styles.label}>Category</Text>

      <TextInput
        style={styles.input}
        placeholder="Select Category"
        value={category}
        onChangeText={setCategory}
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>

      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Date */}
      <Text style={styles.label}>Date</Text>

      <TextInput style={styles.input} value={date} onChangeText={setDate} />

      {/* Button */}
      <Pressable style={styles.addButton} onPress={handleAddTransaction}>
        <Text style={styles.addButtonText}>Add Transaction</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
  },

  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 15,
  },

  currency: {
    fontSize: 20,
    fontWeight: "600",
  },

  amountInput: {
    flex: 1,
    fontSize: 20,
    padding: 14,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },

  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },

  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },

  selectedIncome: {
    borderColor: "#22C55E",
    backgroundColor: "#F0FDF4",
  },

  selectedExpense: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#94A3B8",
  },

  radioSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#2563EB",
  },

  description: {
    height: 90,
    textAlignVertical: "top",
  },

  addButton: {
    marginTop: 30,
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
