import { useTheme } from "@/context/ThemeContext";
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

import { setAppLockPin } from "@/utils/appLockStorage";

export default function AppLockScreen() {
  const { isDarkMode } = useTheme();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleSavePin = async () => {
    if (pin.length !== 4) {
      Alert.alert("Invalid PIN", "PIN must contain 4 digits.");
      return;
    }

    try {
      await setAppLockPin(pin);

      Alert.alert("Success", "App Lock PIN has been enabled.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.log("Error saving PIN:", error);
      Alert.alert("Error", "Failed to save PIN.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <Text style={styles.icon}>🔒</Text>

      <Text
        style={[styles.title, { color: isDarkMode ? "#F9FAFB" : "#111827" }]}
      >
        App Lock
      </Text>

      <Text
        style={[styles.label, { color: isDarkMode ? "#E5E7EB" : "#111827" }]}
      >
        Enter PIN
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            borderColor: isDarkMode ? "#374151" : "#D1D5D8",
            color: isDarkMode ? "#F9FAFB" : "#111827",
          },
        ]}
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry
        placeholder="* * * *"
        placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
      />

      <Text
        style={[styles.label, { color: isDarkMode ? "#E5E7EB" : "#111827" }]}
      >
        Confirm PIN
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            borderColor: isDarkMode ? "#374151" : "#D1D5D8",
            color: isDarkMode ? "#F9FAFB" : "#111827",
          },
        ]}
        value={confirmPin}
        onChangeText={setConfirmPin}
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry
        placeholder="* * * *"
        placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
      />

      <TouchableOpacity style={styles.button} onPress={handleSavePin}>
        <Text style={styles.buttonText}>Enable App Lock</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  icon: {
    fontSize: 50,
    textAlign: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 10,
    marginBottom: 18,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
