import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  useEffect(() => {
    checkAppLock();
  }, []);

  const checkAppLock = async () => {
    try {
      const pin = await AsyncStorage.getItem("appLockPin");

      console.log("Saved App Lock PIN:", pin);

      if (pin) {
        console.log("PIN FOUND");
        console.log("Going to Enter PIN...");

        setTimeout(() => {
          router.replace("/enter-pin");
        }, 100);
      } else {
        console.log("No PIN found");
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("Error checking App Lock:", error);

      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
