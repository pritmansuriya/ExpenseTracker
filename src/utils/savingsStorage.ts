import AsyncStorage from "@react-native-async-storage/async-storage";

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  createdAt: string;
};

const STORAGE_KEY = "savingsGoals";

export const getSavingsGoals = async (): Promise<SavingsGoal[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.log("Error getting savings goals:", error);
    return [];
  }
};

export const saveSavingsGoals = async (goals: SavingsGoal[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.log("Error saving savings goals:", error);
  }
};

export const addSavingsGoal = async (goal: SavingsGoal): Promise<void> => {
  try {
    const existingGoals = await getSavingsGoals();

    const updatedGoals = [...existingGoals, goal];

    await saveSavingsGoals(updatedGoals);
  } catch (error) {
    console.log("Error adding savings goal:", error);
  }
};

export const deleteSavingsGoal = async (goalId: string): Promise<void> => {
  try {
    const existingGoals = await getSavingsGoals();

    const updatedGoals = existingGoals.filter((goal) => goal.id !== goalId);

    await saveSavingsGoals(updatedGoals);
  } catch (error) {
    console.log("Error deleting savings goal:", error);
  }
};
