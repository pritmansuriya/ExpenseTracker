import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
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

export default function SavingsGoalScreen() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  // Load goals from AsyncStorage
  const loadGoals = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        setGoals(JSON.parse(data));
      } else {
        setGoals([]);
      }
    } catch (error) {
      console.log("Error loading goals:", error);
    }
  };

  // Reload whenever this screen becomes active
  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, []),
  );

  // Delete goal
  const deleteGoal = (id: string) => {
    Alert.alert("Delete Goal", "Are you sure you want to delete this goal?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const updatedGoals = goals.filter((goal) => goal.id !== id);

            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(updatedGoals),
            );

            setGoals(updatedGoals);
          } catch (error) {
            console.log("Delete error:", error);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Savings Goals</Text>

          <Text style={styles.subtitle}>Save money for your future</Text>
        </View>

        {/* Create Goal Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/add-savings-goals")}
        >
          <Text style={styles.createButtonText}>+ Create Goal</Text>
        </TouchableOpacity>
      </View>

      {/* No Goals */}
      {goals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎯</Text>

          <Text style={styles.emptyTitle}>No Savings Goals</Text>

          <Text style={styles.emptyText}>
            Create your first savings goal to start tracking your progress.
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push("/add-savings-goals")}
          >
            <Text style={styles.emptyButtonText}>Create Your First Goal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Goals Count */}
          <Text style={styles.goalCount}>
            {goals.length} {goals.length === 1 ? "Goal" : "Goals"}
          </Text>

          {/* Goal Cards */}
          {goals.map((goal) => {
            const progress =
              goal.targetAmount > 0
                ? Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)
                : 0;

            const remaining = Math.max(goal.targetAmount - goal.savedAmount, 0);

            return (
              <View key={goal.id} style={styles.goalCard}>
                {/* Goal Header */}
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.icon}>🎯</Text>
                    </View>

                    <View style={styles.titleContainer}>
                      <Text style={styles.goalName}>{goal.name}</Text>

                      <Text style={styles.savedAmount}>
                        ₹{goal.savedAmount.toLocaleString("en-IN")}
                        {" / "}₹{goal.targetAmount.toLocaleString("en-IN")}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => deleteGoal(goal.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${progress}%`,
                      },
                    ]}
                  />
                </View>

                {/* Percentage */}
                <Text style={styles.percentage}>{Math.round(progress)}%</Text>

                {/* Goal Details */}
                <View style={styles.details}>
                  <View>
                    <Text style={styles.detailLabel}>Target</Text>

                    <Text style={styles.detailValue}>
                      ₹{goal.targetAmount.toLocaleString("en-IN")}
                    </Text>
                  </View>

                  <View style={styles.remaining}>
                    <Text style={styles.detailLabel}>Remaining</Text>

                    <Text style={styles.remainingValue}>
                      ₹{remaining.toLocaleString("en-IN")}
                    </Text>
                  </View>
                </View>

                {/* Add Money */}
                {progress < 100 && (
                  <TouchableOpacity
                    style={styles.addMoneyButton}
                    onPress={() =>
                      router.push({
                        pathname: "/add-money",
                        params: {
                          goalId: goal.id,
                        },
                      })
                    }
                  >
                    <Text style={styles.addMoneyText}>+ Add Money</Text>
                  </TouchableOpacity>
                )}

                {/* Completed */}
                {progress >= 100 && (
                  <View style={styles.completedBox}>
                    <Text style={styles.completedText}>🎉 Goal Completed!</Text>
                  </View>
                )}
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  createButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 9,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  goalCount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },

  goalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
  },

  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  goalInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  icon: {
    fontSize: 22,
  },

  titleContainer: {
    flex: 1,
  },

  goalName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  savedAmount: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  deleteText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
  },

  progressBackground: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 10,
  },

  percentage: {
    textAlign: "right",
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },

  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  detailLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  remaining: {
    alignItems: "flex-end",
  },

  remainingValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#DC2626",
  },

  addMoneyButton: {
    backgroundColor: "#EFF6FF",
    paddingVertical: 11,
    borderRadius: 9,
    alignItems: "center",
    marginTop: 18,
  },

  addMoneyText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "700",
  },

  completedBox: {
    backgroundColor: "#DCFCE7",
    paddingVertical: 11,
    borderRadius: 9,
    alignItems: "center",
    marginTop: 18,
  },

  completedText: {
    color: "#16A34A",
    fontWeight: "700",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#111827",
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
    paddingHorizontal: 20,
  },

  emptyButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 20,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
