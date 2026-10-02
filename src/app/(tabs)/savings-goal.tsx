import { useTheme } from "@/context/ThemeContext";
import { deleteSavingsGoal, getSavingsGoals } from "@/services/savingsApi";
import { Ionicons } from "@expo/vector-icons";
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

type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  createdAt: string;
};

export default function SavingsGoalScreen() {
  const { isDarkMode } = useTheme();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  // Load goals whenever this screen becomes active.
  const loadGoals = async () => {
    try {
      const data = await getSavingsGoals();
      setGoals(data);
    } catch (error) {
      console.log("Error loading savings goals:", error);
      Alert.alert("Error", "Failed to load savings goals. Please try again.");
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
            await deleteSavingsGoal(id);
            setGoals((currentGoals) =>
              currentGoals.filter((goal) => goal.id !== id),
            );
          } catch (error) {
            console.log("Error deleting savings goal:", error);
            Alert.alert("Error", "Unable to delete the savings goal.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: "transparent" }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.heading,
              { color: isDarkMode ? "#F9FAFB" : "#111827" },
            ]}
          >
            Savings Goals
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: isDarkMode ? "#D1D5DB" : "#6B7280" },
            ]}
          >
            Save money for your future
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/add-savings-goals")}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Goal</Text>
        </TouchableOpacity>
      </View>

      {goals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="flag-outline"
            size={55}
            color={isDarkMode ? "#60A5FA" : "#2563EB"}
            style={styles.emptyIcon}
          />

          <Text
            style={[
              styles.emptyTitle,
              { color: isDarkMode ? "#F9FAFB" : "#111827" },
            ]}
          >
            No Savings Goals
          </Text>

          <Text
            style={[
              styles.emptyText,
              { color: isDarkMode ? "#D1D5DB" : "#6B7280" },
            ]}
          >
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
          <Text
            style={[
              styles.goalCount,
              { color: isDarkMode ? "#E5E7EB" : "#374151" },
            ]}
          >
            {goals.length} {goals.length === 1 ? "Goal" : "Goals"}
          </Text>

          {goals.map((goal) => {
            const progress =
              goal.targetAmount > 0
                ? Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)
                : 0;

            const remaining = Math.max(goal.targetAmount - goal.savedAmount, 0);

            return (
              <View
                key={goal.id}
                style={[
                  styles.goalCard,
                  { backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF" },
                ]}
              >
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: isDarkMode ? "#0F172A" : "#EFF6FF" },
                      ]}
                    >
                      <Ionicons
                        name="flag-outline"
                        size={22}
                        color={isDarkMode ? "#60A5FA" : "#2563EB"}
                      />
                    </View>

                    <View style={styles.titleContainer}>
                      <Text
                        style={[
                          styles.goalName,
                          { color: isDarkMode ? "#F9FAFB" : "#111827" },
                        ]}
                      >
                        {goal.name}
                      </Text>

                      <Text
                        style={[
                          styles.savedAmount,
                          { color: isDarkMode ? "#D1D5DB" : "#6B7280" },
                        ]}
                      >
                        ₹{goal.savedAmount.toLocaleString("en-IN")}
                        {" / "}₹{goal.targetAmount.toLocaleString("en-IN")}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => deleteGoal(goal.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.progressBackground,
                    { backgroundColor: isDarkMode ? "#374151" : "#E5E7EB" },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${progress}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.percentage}>{Math.round(progress)}%</Text>

                <View style={styles.details}>
                  <View>
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: isDarkMode ? "#9CA3AF" : "#9CA3AF" },
                      ]}
                    >
                      Target
                    </Text>

                    <Text
                      style={[
                        styles.detailValue,
                        { color: isDarkMode ? "#F9FAFB" : "#111827" },
                      ]}
                    >
                      ₹{goal.targetAmount.toLocaleString("en-IN")}
                    </Text>
                  </View>

                  <View style={styles.remaining}>
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: isDarkMode ? "#9CA3AF" : "#9CA3AF" },
                      ]}
                    >
                      Remaining
                    </Text>

                    <Text style={styles.remainingValue}>
                      ₹{remaining.toLocaleString("en-IN")}
                    </Text>
                  </View>
                </View>

                {progress < 100 && (
                  <TouchableOpacity
                    style={[
                      styles.addMoneyButton,
                      { backgroundColor: isDarkMode ? "#0F172A" : "#EFF6FF" },
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: "/add-money",
                        params: {
                          goalId: goal.id,
                        },
                      })
                    }
                  >
                    <Ionicons
                      name="add"
                      size={18}
                      color={isDarkMode ? "#BFDBFE" : "#2563EB"}
                    />
                    <Text
                      style={[
                        styles.addMoneyText,
                        { color: isDarkMode ? "#BFDBFE" : "#2563EB" },
                      ]}
                    >
                      Add Money
                    </Text>
                  </TouchableOpacity>
                )}

                {progress >= 100 && (
                  <View
                    style={[
                      styles.completedBox,
                      { backgroundColor: isDarkMode ? "#14532D" : "#DCFCE7" },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={isDarkMode ? "#BBF7D0" : "#16A34A"}
                    />
                    <Text
                      style={[
                        styles.completedText,
                        { color: isDarkMode ? "#BBF7D0" : "#16A34A" },
                      ]}
                    >
                      Goal Completed!
                    </Text>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingVertical: 11,
    borderRadius: 9,
    marginTop: 18,
  },

  addMoneyText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "700",
  },

  completedBox: {
    backgroundColor: "#DCFCE7",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    paddingVertical: 11,
    borderRadius: 9,
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
