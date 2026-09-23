import { Stack } from "expo-router";
// import { TransactionProvider } from "../context/TransactionContext";

export default function RootLayout() {
  return (
    // <TransactionProvider>
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
    // </TransactionProvider>
  );
}
