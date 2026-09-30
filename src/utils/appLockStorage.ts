import AsyncStorage from "@react-native-async-storage/async-storage";

const PIN_KEY = "appLockPin";
const APP_LOCK_KEY = "appLockEnabled";

export const setAppLockPin = async (pin: string) => {
  await AsyncStorage.setItem(PIN_KEY, pin);
  await AsyncStorage.setItem(APP_LOCK_KEY, "true");
};

export const getAppLockPin = async () => {
  return await AsyncStorage.getItem(PIN_KEY);
};

export const isAppLockEnabled = async () => {
  const enabled = await AsyncStorage.getItem(APP_LOCK_KEY);
  return enabled === "true";
};

export const disableAppLock = async () => {
  await AsyncStorage.removeItem(PIN_KEY);
  await AsyncStorage.setItem(APP_LOCK_KEY, "false");
};

export const verifyAppLockPin = async (pin: string) => {
  const savedPin = await AsyncStorage.getItem(PIN_KEY);

  return savedPin === pin;
};
