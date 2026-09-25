import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

import { getAccounts, updateAccount } from "@/utils/accountStorage";

import { Account } from "@/types/account";

const accountTypes: {
  type: Account["type"];
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    type: "cash",
    label: "Cash",
    icon: "cash-outline",
  },
  {
    type: "bank",
    label: "Bank",
    icon: "business-outline",
  },
  {
    type: "upi",
    label: "UPI",
    icon: "phone-portrait-outline",
  },
  {
    type: "credit",
    label: "Credit Card",
    icon: "card-outline",
  },
];

export default function EditAccountScreen() {
  const router = useRouter();

  const { accountId } = useLocalSearchParams<{
    accountId: string;
  }>();

  const [account, setAccount] = useState<Account | null>(null);

  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState<Account["type"]>("cash");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccount();
  }, [accountId]);

  const loadAccount = async () => {
    try {
      const accounts = await getAccounts();

      const foundAccount = accounts.find((item) => item.id === accountId);

      if (!foundAccount) {
        Alert.alert("Error", "Account not found.", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);

        return;
      }

      setAccount(foundAccount);
      setName(foundAccount.name);
      setBalance(foundAccount.balance.toString());
      setType(foundAccount.type);
    } catch (error) {
      console.log("Error loading account:", error);

      Alert.alert("Error", "Unable to load account.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!account) {
      return;
    }

    const trimmedName = name.trim();
    const numericBalance = Number(balance);

    if (!trimmedName) {
      Alert.alert("Required", "Please enter account name.");
      return;
    }

    if (!balance.trim()) {
      Alert.alert("Required", "Please enter account balance.");
      return;
    }

    if (isNaN(numericBalance) || numericBalance < 0) {
      Alert.alert("Invalid Balance", "Please enter a valid balance.");
      return;
    }

    try {
      await updateAccount({
        ...account,
        name: trimmedName,
        balance: numericBalance,
        type,
      });

      Alert.alert("Success", "Account updated successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.log("Error updating account:", error);

      Alert.alert("Error", "Unable to update account.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading account...</Text>
      </View>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit Account</Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Account Name */}
        <Text style={styles.label}>Account Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Account name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

        {/* Balance */}
        <Text style={styles.label}>Current Balance</Text>

        <View style={styles.amountInput}>
          <Text style={styles.currency}>₹</Text>

          <TextInput
            style={styles.amountTextInput}
            placeholder="0"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={balance}
            onChangeText={setBalance}
          />
        </View>

        {/* Account Type */}
        <Text style={styles.label}>Account Type</Text>

        <View style={styles.typeContainer}>
          {accountTypes.map((item) => {
            const selected = type === item.type;

            return (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.typeButton,
                  selected && styles.selectedTypeButton,
                ]}
                onPress={() => setType(item.type)}
              >
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={selected ? "#FFFFFF" : "#2563EB"}
                />

                <Text
                  style={[styles.typeText, selected && styles.selectedTypeText]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Update */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />

          <Text style={styles.updateText}>Update Account</Text>
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

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  headerSpace: {
    width: 42,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginTop: 22,
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#111827",
  },

  amountInput: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  currency: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563EB",
    marginRight: 8,
  },

  amountTextInput: {
    flex: 1,
    fontSize: 18,
    color: "#111827",
  },

  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  typeButton: {
    width: "47%",
    minHeight: 90,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  selectedTypeButton: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  typeText: {
    marginTop: 7,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  selectedTypeText: {
    color: "#FFFFFF",
  },

  updateButton: {
    height: 55,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  updateText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
});
