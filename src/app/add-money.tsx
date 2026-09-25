import { addNotification } from "@/utils/notificationStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const STORAGE_KEY = "savingsGoals";

type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  createdAt: string;
};

export default function AddMoneyScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const [amount, setAmount] = useState("");
  const [goal, setGoal] = useState<SavingsGoal | null>(null);

  useEffect(() => {
    loadGoal();
  }, [goalId]);

  const loadGoal = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        const goals: SavingsGoal[] = JSON.parse(data);
        const found = goals.find((g) => g.id === goalId);
        setGoal(found || null);
      }
    } catch (error) {
      console.log("Error loading goal:", error);
    }
  };

  const handleAddMoney = async () => {
    if (!amount.trim()) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!goal) {
      Alert.alert("Error", "Goal not found");
      return;
    }

    const newSavedAmount = goal.savedAmount + numericAmount;

    if (newSavedAmount > goal.targetAmount) {
      Alert.alert(
        "Over Target",
        `Adding ₹${numericAmount.toLocaleString("en-IN")} would exceed the target by ₹${(newSavedAmount - goal.targetAmount).toLocaleString("en-IN")}. Continue?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Add",
            onPress: () => saveMoney(numericAmount),
          },
        ],
      );
      return;
    }

    await saveMoney(numericAmount);
  };

  const saveMoney = async (numericAmount: number) => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const goals: SavingsGoal[] = data ? JSON.parse(data) : [];

      const updatedGoals = goals.map((g) => {
        if (g.id === goalId) {
          return {
            ...g,
            savedAmount: g.savedAmount + numericAmount,
          };
        }
        return g;
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));

      // Create notification
      await addNotification({
        id: Date.now().toString(),
        title: "Savings Progress",
        message: `Added ₹${numericAmount.toLocaleString("en-IN")} to "${goal?.name}".`,
        amount: numericAmount,
        type: "saving",
        createdAt: new Date().toISOString(),
        read: false,
      });

      Alert.alert(
        "Success",
        `₹${numericAmount.toLocaleString("en-IN")} added to "${goal?.name}"`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      console.log("Error saving money:", error);
      Alert.alert("Error", "Failed to add money");
    }
  };

  const remaining = goal
    ? Math.max(goal.targetAmount - goal.savedAmount, 0)
    : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Add Money</Text>

      {goal ? (
        <>
          {/* Goal Info */}
          <View style={styles.goalCard}>
            <Text style={styles.goalIcon}>🎯</Text>

            <Text style={styles.goalName}>{goal.name}</Text>

            <View style={styles.goalRow}>
              <View style={styles.goalStat}>
                <Text style={styles.goalStatLabel}>Saved</Text>
                <Text style={[styles.goalStatValue, { color: "#16A34A" }]}>
                  ₹{goal.savedAmount.toLocaleString("en-IN")}
                </Text>
              </View>

              <View style={styles.goalStat}>
                <Text style={styles.goalStatLabel}>Target</Text>
                <Text style={styles.goalStatValue}>
                  ₹{goal.targetAmount.toLocaleString("en-IN")}
                </Text>
              </View>

              <View style={styles.goalStat}>
                <Text style={styles.goalStatLabel}>Remaining</Text>
                <Text style={[styles.goalStatValue, { color: "#DC2626" }]}>
                  ₹{remaining.toLocaleString("en-IN")}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              {Math.round(
                Math.min((goal.savedAmount / goal.targetAmount) * 100, 100),
              )}
              % complete
            </Text>
          </View>

          {/* Amount Input */}
          <Text style={styles.label}>Amount to Add (₹)</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor="#9CA3AF"
          />

          {/* Add Button */}
          <TouchableOpacity style={styles.button} onPress={handleAddMoney}>
            <Text style={styles.buttonText}>Add Money to Goal</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Goal not found.</Text>
        </View>
      )}
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

  backButton: {
    marginBottom: 20,
  },

  backText: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "600",
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 24,
  },

  goalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  goalIcon: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 8,
  },

  goalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },

  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  goalStat: {
    alignItems: "center",
    flex: 1,
  },

  goalStatLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },

  goalStatValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },

  progressBackground: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },

  progressBar: {
    height: 8,
    backgroundColor: "#2563EB",
    borderRadius: 4,
  },

  progressText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "right",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: "#FFFFFF",
    color: "#111827",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  notFoundText: {
    fontSize: 16,
    color: "#6B7280",
  },
});
