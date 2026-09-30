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
    <View style={styles.container}>
      <Text style={styles.icon}>🔒</Text>

      <Text style={styles.title}>App Lock</Text>

      <Text style={styles.label}>Enter PIN</Text>

      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry
        placeholder="* * * *"
      />

      <Text style={styles.label}>Confirm PIN</Text>

      <TextInput
        style={styles.input}
        value={confirmPin}
        onChangeText={setConfirmPin}
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry
        placeholder="* * * *"
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
    backgroundColor: "#F9FAFB",
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
    color: "#111827",
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
    color: "#111827",
    marginBottom: 8,
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#D1D5D8",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
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
