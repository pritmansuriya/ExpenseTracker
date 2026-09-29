import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function HelpSupportScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Help & Support</Text>

        <View style={{ width: 26 }} />
      </View> */}

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="help-circle" size={55} color="#2563EB" />
        </View>

        <Text style={styles.title}>How can we hwlp?</Text>

        <Text style={styles.description}>
          Find answer to common questions and get help using the Expense Tracker
          applicaion.
        </Text>

        <View style={styles.card}>
          <Ionicons name="wallet-outline" size={28} color="#2563EB" />

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Managing Transactions</Text>
            <Text style={styles.cardText}>
              Add income and expenses, edit your transactions, and remove
              transactions you no longer need.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="trending-up-outline" size={28} color="#2563EB" />

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Savings Goals</Text>
            <Text style={styles.cardText}>
              Create savings goals and track how much money you have saved
              toward each goal.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="card-outline" size={28} color="#2563EB" />

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Accounts</Text>
            <Text style={styles.cardText}>
              Manage your cash, bank accounts, UPI accounts, and credit cards
              from the Accounts section.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="notifications-outline" size={28} color="#2563EB" />

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Notifications</Text>
            <Text style={styles.cardText}>
              Check reminders and important notifications related to your
              expenses, budgets, and savings.
            </Text>
          </View>
        </View>

        <View style={styles.contactBox}>
          <Ionicons name="mail-outline" size={30} color="#2563EB" />

          <Text style={styles.contactTitle}>Need more help?</Text>

          <Text style={styles.contactText}>
            If you have any problems while using the application, please contact
            our support team.
          </Text>

          <Text style={styles.email}>support@gmail.com</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  iconContainer: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  description: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 20,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardContent: {
    flex: 1,
    marginLeft: 14,
  },

  cardTitle: {
    fontSize: 16,
    lineHeight: 20,
    color: "#6B7280",
  },

  cardText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },

  contactBox: {
    backgroundColor: "#EFF6FF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },

  contactTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 10,
  },

  contactText: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    marginTop: 6,
  },

  email: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
  },
});
