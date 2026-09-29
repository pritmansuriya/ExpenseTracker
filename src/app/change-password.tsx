import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPasswprd, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (loading) return;

    if (!currentPassword || !newPasswprd || !confirmPassword) {
      Alert.alert("Missing Information", "Please fill in all password fields.");
      return;
    }

    if (newPasswprd !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "New pasword and confirm password do not match.",
      );
      return;
    }

    if (currentPassword === newPasswprd) {
      Alert.alert(
        "Invalid Password",
        "New pasword must be different from your current password.",
      );
      return;
    }

    try {
      setLoading(true);

      const storeduser = await AsyncStorage.getItem("user");

      if (!storeduser) {
        Alert.alert(
          "Error",
          "User information was not found. Please login again.",
        );

        router.replace("/login");
        return;
      }

      const user = JSON.parse(storeduser);

      if (user.password !== currentPassword) {
        Alert.alert(
          "Incorrect Password",
          "Your current password is incorrect.",
        );
        return;
      }

      const updateUser = {
        ...user,
        password: newPasswprd,
      };

      await AsyncStorage.setItem("user", JSON.stringify(updateUser));

      await AsyncStorage.removeItem("LoggedIN");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      Alert.alert(
        "Password Changed",
        "Your password has been chnaged successfully. Please login again with your new password.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/login");
            },
          },
        ],
      );
    } catch (error) {
      console.log("Change password error:", error);

      Alert.alert(
        "Error",
        "Something went wrong while changing your password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={45} color="#2563EB" />
        </View>

        <Text style={styles.title}>Update Your Password</Text>

        <Text style={styles.description}>
          Enter your current password and choose a new password to secure your
          account.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />

            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              placeholderTextColor="#9CA3AF"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <Ionicons
                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                size={21}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-open-outline" size={20} color="#6B7280" />

            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              value={newPasswprd}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons
                name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                size={21}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>
            Password must contain at least 6 characters.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#6B7280"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={21}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#2563EB"
          />

          <Text style={styles.infoText}>
            After chnaging your password, you will be logged out and need to
            login agian using your new password.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" />

          <Text style={styles.buttonText}>
            {loading ? "Chnaging Password..." : "Chnage Password"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  backButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  headerSpace: {
    width: 35,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  inputContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    marginLeft: 10,
    paddingVertical: 0,
  },

  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 14,
    marginTop: 5,
    marginBottom: 25,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: "#374151",
    marginLeft: 10,
  },

  button: {
    height: 52,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
