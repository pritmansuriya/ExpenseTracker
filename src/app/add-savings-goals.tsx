import { addNotification } from "@/utils/notificationStorage";
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

const STORAGE_KEY = "savingsGoals";

export default function AddSavingsGoal() {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const handleCreateGoal = async () => {
    if (!name.trim() || !targetAmount.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const numericTarget = Number(targetAmount);

    if (isNaN(numericTarget) || numericTarget <= 0) {
      Alert.alert("Error", "Please enter a valid target amount");
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      name: name.trim(),
      targetAmount: numericTarget,
      savedAmount: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);

      const existingGoals = existingData ? JSON.parse(existingData) : [];

      const updatedGoals = [newGoal, ...existingGoals];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));

      // Create notification
      await addNotification({
        id: Date.now().toString(),
        title: "New Savings Goal",
        message: `Goal "${name.trim()}" created with target ₹${numericTarget.toLocaleString("en-IN")}.`,
        type: "saving",
        createdAt: new Date().toISOString(),
        read: false,
      });

      Alert.alert("Success", "Savings goal created successfully");

      setName("");
      setTargetAmount("");

      router.back();
    } catch (error) {
      console.log("Create goal error:", error);

      Alert.alert("Error", "Failed to create savings goal");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Savings Goal</Text>

      <Text style={styles.label}>Goal Name</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. New Laptop"
        placeholderTextColor="#9CA3AF"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Target Amount</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 60000"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={targetAmount}
        onChangeText={setTargetAmount}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateGoal}>
        <Text style={styles.buttonText}>Create Goal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    paddingTop: 60,
  },

  heading: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },

  cancelText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
});
