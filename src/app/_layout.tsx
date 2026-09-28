import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

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
