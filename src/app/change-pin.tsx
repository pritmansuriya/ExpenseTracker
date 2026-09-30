import AsyncStorage from "@react-native-async-storage/async-storage";
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

const APP_LOCK_PIN = "appLockPin";

export default function ChangePinScreen() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleChangePin = async () => {
    if (!currentPin || !newPin || !confirmPin) {
      Alert.alert("Required", "Please fill all PIN fields.");
      return;
    }

    if (!/^\d{4}$/.test(currentPin)) {
      Alert.alert("Invalid PIN", "Current PIN must contain 4 digits.");
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      Alert.alert("Invalid PIN", "New PIN must contain 4 digits.");
      return;
    }

    if (newPin !== confirmPin) {
      Alert.alert("PIN Mismatch", "New PIN and Confirm PIN do not match.");
      return;
    }

    if (currentPin === newPin) {
      Alert.alert(
        "Invalid PIN",
        "New PIN must be different from your current PIN.",
      );
      return;
    }

    try {
      const savedPin = await AsyncStorage.getItem(APP_LOCK_PIN);

      if (!savedPin) {
        Alert.alert("No PIN Found", "Please set an App Lock PIN first.");
        return;
      }

      if (currentPin !== savedPin) {
        Alert.alert(
          "Incorrect PIN",
          "The current PIN you entered is incorrect.",
        );
        return;
      }

      await AsyncStorage.setItem(APP_LOCK_PIN, newPin);

      Alert.alert(
        "Success",
        "Your App Lock PIN has been changed successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      console.log("Error changing PIN:", error);

      Alert.alert("Error", "Something went wrong while changing your PIN.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change PIN</Text>

      <Text style={styles.subtitle}>Update your App Lock PIN</Text>

      {/* Current PIN */}
      <Text style={styles.label}>Current PIN</Text>

      <TextInput
        style={styles.input}
        value={currentPin}
        onChangeText={setCurrentPin}
        placeholder="Enter current PIN"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
      />

      {/* New PIN */}
      <Text style={styles.label}>New PIN</Text>

      <TextInput
        style={styles.input}
        value={newPin}
        onChangeText={setNewPin}
        placeholder="Enter new PIN"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
      />

      {/* Confirm PIN */}
      <Text style={styles.label}>Confirm New PIN</Text>

      <TextInput
        style={styles.input}
        value={confirmPin}
        onChangeText={setConfirmPin}
        placeholder="Confirm new PIN"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
      />

      {/* Change PIN Button */}
      <TouchableOpacity style={styles.button} onPress={handleChangePin}>
        <Text style={styles.buttonText}>Change PIN</Text>
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 35,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    letterSpacing: 4,
  },

  button: {
    height: 52,
    backgroundColor: "#2563EB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  cancelText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
});
