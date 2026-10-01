import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;

    const checkAppLock = async () => {
      try {
        const pin = await AsyncStorage.getItem("appLockPin");

        if (pin) {
          redirectTimer = setTimeout(() => {
            router.replace("/enter-pin");
          }, 100);
        } else {
          router.replace("/(tabs)");
        }
      } catch (error) {
        console.log("Error checking App Lock:", error);
        router.replace("/(tabs)");
      }
    };

    void checkAppLock();

    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, []);

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
