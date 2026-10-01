import { useTheme } from "@/context/ThemeContext";
import { setAppLockPin } from "@/utils/appLockStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ForgotPinScreen() {
  const { colors } = useTheme();
  const [password, setPassword] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleResetPin = async () => {
    if (!password || !newPin || !confirmPin) {
      Alert.alert(
        "Required",
        "Enter your account password and choose a new PIN.",
      );
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      Alert.alert("Invalid PIN", "Your new PIN must contain exactly 4 digits.");
      return;
    }

    if (newPin !== confirmPin) {
      Alert.alert("PIN Mismatch", "The new PINs do not match.");
      return;
    }

    try {
      setIsSaving(true);

      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        Alert.alert(
          "Account Not Found",
          "Please sign in to your account first.",
        );
        return;
      }

      const user = JSON.parse(userData);
      if (user.password !== password) {
        Alert.alert("Incorrect Password", "The account password is incorrect.");
        return;
      }

      await setAppLockPin(newPin);
      Alert.alert("PIN Reset", "Your app lock PIN has been updated.", [
        { text: "Continue", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (error) {
      console.log("Error resetting app lock PIN:", error);
      Alert.alert("Error", "Unable to reset your PIN. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: "transparent" }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Reset App PIN
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Verify your account password to choose a new 4-digit PIN.
        </Text>

        <Text style={[styles.label, { color: colors.text }]}>
          Account Password
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your account password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
        />

        <Text style={[styles.label, { color: colors.text }]}>New PIN</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={newPin}
          onChangeText={(value) =>
            setNewPin(value.replace(/\D/g, "").slice(0, 4))
          }
          placeholder="Enter a new 4-digit PIN"
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          Confirm New PIN
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={confirmPin}
          onChangeText={(value) =>
            setConfirmPin(value.replace(/\D/g, "").slice(0, 4))
          }
          placeholder="Re-enter your new PIN"
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
        />

        <TouchableOpacity
          style={[styles.button, isSaving && styles.buttonDisabled]}
          onPress={handleResetPin}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? "Saving..." : "Reset PIN"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
            Back to PIN
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  button: {
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 12,
    marginTop: 26,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
