import { useTheme } from "@/context/ThemeContext";
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

export default function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      const userData = await AsyncStorage.getItem("user");

      if (!userData) {
        Alert.alert(
          "No Account",
          "No registered account found. Please register first.",
        );
        return;
      }

      const user = JSON.parse(userData);

      if (
        user.email.toLowerCase() !== email.trim().toLowerCase() ||
        user.password !== password
      ) {
        Alert.alert("Login Failed", "Invalid email or password");
        return;
      }

      // Save login state
      await AsyncStorage.setItem("loggedIn", "true");

      // Move to Home
      router.replace("/(tabs)");
    } catch (error) {
      console.log("Login Error:", error);
      Alert.alert("Error", "Something went wrong during login");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.formContainer,
          { backgroundColor: colors.card, borderColor: colors.cardBorder },
        ]}
      >
        <Text style={styles.logo}>💰</Text>

        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Login to manage your expenses
        </Text>

        <Text style={[styles.label, { color: colors.text }]}>Email</Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Enter your email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={[styles.label, { color: colors.text }]}>Password</Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Enter your password"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={[styles.accountText, { color: colors.textSecondary }]}>
            Don&apos;t have an account?
          </Text>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.registerText}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  formContainer: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
  },

  logo: {
    fontSize: 50,
    textAlign: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#111827",
    marginBottom: 18,
    backgroundColor: "#F9FAFB",
  },

  loginButton: {
    height: 52,
    backgroundColor: "#2563EB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  accountText: {
    color: "#6B7280",
    fontSize: 14,
  },

  registerText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "bold",
  },
});
