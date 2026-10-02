import ScreenBackdrop from "@/components/ScreenBackdrop";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}

function AppNavigator() {
  const { colors } = useTheme();

  return (
    <View style={[styles.shell, { backgroundColor: colors.background }]}>
      <ScreenBackdrop />
      <Stack
        screenOptions={{ contentStyle: { backgroundColor: "transparent" } }}
      >
        {/* App Entry */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        {/* App Lock */}
        <Stack.Screen
          name="enter-pin"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="forgot-pin"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="app-lock"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="change-pin"
          options={{
            headerShown: false,
          }}
        />

        {/* Main Application */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="add-transactions"
          options={{
            title: "Add Transaction",
          }}
        />

        <Stack.Screen
          name="export-transaction"
          options={{
            title: "Export Transaction",
          }}
        />

        <Stack.Screen
          name="add-savings-goals"
          options={{
            title: "Add Goals",
          }}
        />

        <Stack.Screen
          name="add-money"
          options={{
            title: "Add Money",
          }}
        />

        <Stack.Screen
          name="edit-profile"
          options={{
            title: "Edit Profile",
          }}
        />

        <Stack.Screen
          name="change-password"
          options={{
            title: "Change Password",
          }}
        />

        <Stack.Screen
          name="help-support"
          options={{
            title: "Help & Support",
          }}
        />

        <Stack.Screen
          name="privacy-policy"
          options={{
            title: "Privacy Policy",
          }}
        />

        <Stack.Screen
          name="about-expense-tracker"
          options={{
            title: "About Expense Tracker",
          }}
        />

        {/* Accounts */}
        <Stack.Screen
          name="accounts"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="add-account"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="edit-account"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
});
