import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "monthlyBudget";

export const getBudget = async (): Promise<number> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);

  if (!data) {
    return 0;
  }

  return Number(data);
};

export const saveBudget = async (amount: Number) => {
  await AsyncStorage.setItem(STORAGE_KEY, amount.toString());
};
