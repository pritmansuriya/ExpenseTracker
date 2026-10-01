import { useTheme } from "@/context/ThemeContext";
import { addSavingsGoal } from "@/services/savingsApi";
import { addNotification } from "@/utils/notificationStorage";
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

export default function AddSavingsGoal() {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      // Save to API — same source the savings screen reads from
      await addSavingsGoal({ name: name.trim(), targetAmount: numericTarget });

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
      Alert.alert(
        "Error",
        "Failed to create savings goal. Make sure the server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Create Savings Goal
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>Goal Name</Text>

      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        placeholder="e.g. New Laptop"
        placeholderTextColor="#9CA3AF"
        value={name}
        onChangeText={setName}
      />

      <Text style={[styles.label, { color: colors.text }]}>
        Target Amount (₹)
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        placeholder="e.g. 60000"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={targetAmount}
        onChangeText={setTargetAmount}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCreateGoal}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Goal"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
          Cancel
        </Text>
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
    color: "#111827",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    backgroundColor: "#93C5FD",
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
