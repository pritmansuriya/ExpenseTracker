import { Ionicons } from "@expo/vector-icons";
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

export default function EnterPinScreen() {
  const [pin, setPin] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleVerifyPin = async () => {
    if (pin.length !== 4) {
      Alert.alert("Invalid PIN", "Please enter your 4-digit PIN.");
      return;
    }

    try {
      setIsChecking(true);

      const savedPin = await AsyncStorage.getItem("appLockPin");

      if (!savedPin) {
        router.replace("/(tabs)");
        return;
      }

      if (pin === savedPin) {
        router.replace("/(tabs)");
      } else {
        Alert.alert("Incorrect PIN", "The PIN you entered is incorrect.");

        setPin("");
      }
    } catch (error) {
      console.log("Error verifying PIN:", error);

      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Lock Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={40} color="#2563EB" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Enter PIN</Text>

        <Text style={styles.subtitle}>
          Enter your 4-digit PIN to unlock Expense Tracker
        </Text>

        {/* PIN Input */}
        <TextInput
          style={styles.pinInput}
          value={pin}
          onChangeText={(value) => {
            const numbersOnly = value.replace(/[^0-9]/g, "");

            if (numbersOnly.length <= 4) {
              setPin(numbersOnly);
            }
          }}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
          placeholder="Enter PIN"
          placeholderTextColor="#9CA3AF"
        />

        {/* Unlock Button */}
        <TouchableOpacity
          style={[
            styles.unlockButton,
            pin.length !== 4 && styles.disabledButton,
          ]}
          onPress={handleVerifyPin}
          disabled={pin.length !== 4 || isChecking}
        >
          <Ionicons name="lock-open-outline" size={20} color="#FFFFFF" />

          <Text style={styles.unlockText}>
            {isChecking ? "Checking..." : "Unlock"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  iconContainer: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  pinInput: {
    width: "85%",
    height: 55,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 22,
    textAlign: "center",
    letterSpacing: 8,
    color: "#111827",
  },

  unlockButton: {
    width: "85%",
    height: 52,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },

  disabledButton: {
    backgroundColor: "#93C5FD",
  },

  unlockText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
