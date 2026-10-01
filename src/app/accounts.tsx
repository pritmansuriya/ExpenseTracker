import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Account } from "@/types/account";
import { deleteAccount, getAccounts } from "@/utils/accountStorage";

export default function AccountsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [accounts, setAccounts] = useState<Account[]>([]);

  const loadAccounts = useCallback(async () => {
    const data = await getAccounts();
    setAccounts(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
    }, [loadAccounts]),
  );
  const getIcon = (type: Account["type"]) => {
    switch (type) {
      case "cash":
        return "cash-outline";

      case "bank":
        return "business-outline";

      case "upi":
        return "phone-portrait-outline";

      case "credit":
        return "card-outline";

      default:
        return "wallet-outline";
    }
  };

  const getIconColor = (type: Account["type"]) => {
    switch (type) {
      case "cash":
        return "#16A34A";

      case "bank":
        return "#2563EB";

      case "upi":
        return "#7C3AED";

      case "credit":
        return "#DC2626";

      default:
        return "#6B7280";
    }
  };

  const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0,
  );

  const handleDelete = (account: Account) => {
    Alert.alert(
      "Delete Account",
      `Are you sure you want to delete "${account.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedAccounts = await deleteAccount(account.id);

            setAccounts(updatedAccounts);
          },
        },
      ],
    );
  };

  const renderAccount = ({ item }: { item: Account }) => {
    return (
      <TouchableOpacity
        style={[
          styles.accountCard,
          { backgroundColor: colors.card, borderColor: colors.cardBorder },
        ]}
        onPress={() =>
          router.push({
            pathname: "/edit-account",
            params: {
              accountId: item.id,
            },
          })
        }
        onLongPress={() => handleDelete(item)}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${getIconColor(item.type)}15`,
            },
          ]}
        >
          <Ionicons
            name={getIcon(item.type) as any}
            size={25}
            color={getIconColor(item.type)}
          />
        </View>

        <View style={styles.accountInfo}>
          <Text style={[styles.accountName, { color: colors.text }]}>
            {item.name}
          </Text>

          <Text style={[styles.accountType, { color: colors.textSecondary }]}>
            {item.type.toUpperCase()}
          </Text>
        </View>

        <Text
          style={[
            styles.balance,
            item.type === "credit" && styles.creditBalance,
          ]}
        >
          ₹{item.balance.toLocaleString("en-IN")}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            My Accounts
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Manage your money
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-account")}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Balance</Text>

        <Text style={styles.totalAmount}>
          ₹{totalBalance.toLocaleString("en-IN")}
        </Text>
      </View>

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={renderAccount}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="wallet-outline" size={55} color="#9CA3AF" />

            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No accounts found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 55,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },

  addButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  totalCard: {
    backgroundColor: "#2563EB",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
  },

  totalLabel: {
    color: "#DBEAFE",
    fontSize: 14,
  },

  totalAmount: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 5,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  accountInfo: {
    flex: 1,
    marginLeft: 14,
  },

  accountName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  accountType: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },

  balance: {
    fontSize: 16,
    fontWeight: "700",
    color: "#16A34A",
  },

  creditBalance: {
    color: "#DC2626",
  },

  empty: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyText: {
    marginTop: 10,
    color: "#6B7280",
    fontSize: 16,
  },
});
