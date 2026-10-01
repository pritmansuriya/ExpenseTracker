import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EnterPinScreen() {
  const [pin, setPin] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [biometricType, setBiometricType] = useState<
    "fingerprint" | "face" | null
  >(null);
  const inputRef = useRef<TextInput>(null);
  const keyboardVisible = useRef(false);

  const pinDigits = Array.from({ length: 4 }, (_, index) => pin[index] || "");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      keyboardVisible.current = true;
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      keyboardVisible.current = false;
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const focusPinInput = () => {
    if (keyboardVisible.current) {
      inputRef.current?.focus();
      return;
    }

    inputRef.current?.blur();
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  useEffect(() => {
    let isMounted = true;

    const checkBiometrics = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
          return;
        }

        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        const type = types.includes(
          LocalAuthentication.AuthenticationType.FINGERPRINT,
        )
          ? "fingerprint"
          : types.includes(
                LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
              )
            ? "face"
            : null;

        if (isMounted) {
          setBiometricType(type);
        }
      } catch (error) {
        console.log("Error checking biometric support:", error);
      }
    };

    checkBiometrics();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBiometricUnlock = async () => {
    if (isChecking) {
      return;
    }

    try {
      setIsChecking(true);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock Expense Tracker",
        cancelLabel: "Use PIN",
        disableDeviceFallback: true,
        biometricsSecurityLevel: "strong",
      });

      if (result.success) {
        router.replace("/(tabs)");
      } else if (
        result.error !== "user_cancel" &&
        result.error !== "app_cancel"
      ) {
        Alert.alert(
          "Biometric Unlock Failed",
          "Please try again or enter your PIN.",
        );
      }
    } catch (error) {
      console.log("Error authenticating biometrics:", error);
      Alert.alert(
        "Error",
        "Biometric unlock is unavailable. Please enter your PIN.",
      );
    } finally {
      setIsChecking(false);
    }
  };

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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.backgroundGlow1} />
        <View style={styles.backgroundGlow2} />

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={34} color="#2563EB" />
            </View>

            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Enter your 4-digit PIN to unlock Expense Tracker
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={focusPinInput}
              style={styles.pinInputWrap}
            >
              {pinDigits.map((digit, index) => (
                <View
                  key={index}
                  style={[styles.pinBox, digit ? styles.pinBoxFilled : null]}
                >
                  <Text style={styles.pinDigit}>{digit}</Text>
                </View>
              ))}
            </TouchableOpacity>

            <TextInput
              ref={inputRef}
              style={styles.hiddenInput}
              value={pin}
              onChangeText={(value) => {
                const numbersOnly = value.replace(/[^0-9]/g, "");

                if (numbersOnly.length <= 4) {
                  setPin(numbersOnly);
                }
              }}
              keyboardType="number-pad"
              showSoftInputOnFocus
              secureTextEntry
              maxLength={4}
              textContentType="oneTimeCode"
              blurOnSubmit={false}
              caretHidden
            />

            <TouchableOpacity
              style={[
                styles.unlockButton,
                (pin.length !== 4 || isChecking) && styles.disabledButton,
              ]}
              onPress={handleVerifyPin}
              disabled={pin.length !== 4 || isChecking}
            >
              <Ionicons name="lock-open-outline" size={18} color="#FFFFFF" />
              <Text style={styles.unlockText}>
                {isChecking ? "Checking..." : "Unlock"}
              </Text>
            </TouchableOpacity>

            {biometricType && (
              <TouchableOpacity
                style={styles.secondaryAction}
                onPress={handleBiometricUnlock}
                disabled={isChecking}
              >
                <Ionicons
                  name={
                    biometricType === "fingerprint"
                      ? "finger-print"
                      : "scan-outline"
                  }
                  size={20}
                  color="#2563EB"
                />
                <Text style={styles.secondaryActionText}>
                  {biometricType === "fingerprint"
                    ? "Use Fingerprint"
                    : "Use Face ID"}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.forgotPinButton}
              onPress={() => router.push("/forgot-pin")}
              disabled={isChecking}
            >
              <Text style={styles.forgotPinText}>Forgot PIN?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EFF6FF",
  },

  container: {
    flex: 1,
    backgroundColor: "#EFF6FF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  backgroundGlow1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(96, 165, 250, 0.26)",
    top: -60,
    left: -40,
  },

  backgroundGlow2: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    right: -80,
    bottom: 40,
  },

  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: 28,
    paddingHorizontal: 26,
    paddingVertical: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 26,
    elevation: 8,
  },

  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 28,
    lineHeight: 22,
    paddingHorizontal: 12,
  },

  pinInputWrap: {
    width: "100%",
    maxWidth: 320,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  pinBox: {
    width: 58,
    height: 62,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },

  pinBoxFilled: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  pinDigit: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },

  unlockButton: {
    width: "100%",
    maxWidth: 320,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },

  disabledButton: {
    backgroundColor: "#93C5FD",
    shadowOpacity: 0,
    elevation: 0,
  },

  unlockText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryAction: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 12,
  },

  secondaryActionText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
  },

  forgotPinButton: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },

  forgotPinText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
