import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
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
    </ThemeProvider>
  );
}
