import { defaultAccounts } from "@/data/accounts";
import { Account } from "@/types/account";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "accounts";

export const getAccounts = async (): Promise<Account[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (!data) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAccounts));
      return defaultAccounts;
    }

    const parsed: unknown = JSON.parse(data);

    if (Array.isArray(parsed)) {
      return parsed as Account[];
    }
    return defaultAccounts;
  } catch (error) {
    console.log("Error loading acounts", error);
    return defaultAccounts;
  }
};

export const saveAccounts = async (accounts: Account[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.log("Error savings accounts:", error);
  }
};

export const addAccount = async (account: Account): Promise<Account[]> => {
  const accounts = await getAccounts();

  const updateAccounts = [...accounts, account];

  await saveAccounts(updateAccounts);

  return updateAccounts;
};

export const updateAccount = async (
  updatedAccount: Account,
): Promise<Account[]> => {
  const accounts = await getAccounts();

  const updatedAccounts = accounts.map((account) =>
    account.id === updatedAccount.id ? updatedAccount : account,
  );

  await saveAccounts(updatedAccounts);

  return updatedAccounts;
};

export const deleteAccount = async (id: string): Promise<Account[]> => {
  const accounts = await getAccounts();

  const updateAccounts = accounts.filter((account) => account.id !== id);
  await saveAccounts(updateAccounts);

  return updateAccounts;
};
