import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AboutExpenseTrackerScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logo}>
          <Ionicons name="wallet" size={55} color="#FFFFFF" />
        </View>

        <Text style={[styles.appName, { color: colors.text }]}>
          Expense Tracker
        </Text>

        <Text style={[styles.version, { color: colors.textSecondary }]}>
          Version 1.0.0
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Expense Tracker is a simple and user-friendly mobile application
          designed to help you manage your daily finances, track expenses,
          monitor income, and achieve your savings goals.
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            What You Can Do
          </Text>

          <Feature
            icon="wallet-outline"
            title="Track Transactions"
            text="Record your income and expenses in one place."
          />

          <Feature
            icon="trending-up-outline"
            title="Manage Savings"
            text="Create savings goals and monitor your progress."
          />

          <Feature
            icon="card-outline"
            title="Manage Accounts"
            text="Keep track of cash, bank, UPI, and credit accounts."
          />

          <Feature
            icon="notifications-outline"
            title="Stay Updated"
            text="Receive reminders and notifications about your finances."
          />

          <Feature
            icon="moon-outline"
            title="Dark Mode"
            text="Use the application comfortably in light or dark mode."
          />
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Built With
          </Text>

          <Text style={[styles.tech, { color: colors.textSecondary }]}>
            ⚛️ React Native
          </Text>
          <Text style={[styles.tech, { color: colors.textSecondary }]}>
            📱 Expo
          </Text>
          <Text style={[styles.tech, { color: colors.textSecondary }]}>
            🟦 TypeScript
          </Text>
          <Text style={[styles.tech, { color: colors.textSecondary }]}>
            💾 AsyncStorage
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Made with ❤️ for simple and better personal finance management.
          </Text>

          <Text style={[styles.copyright, { color: colors.textSecondary }]}>
            © 2026 Expense Tracker
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.feature}>
      <Ionicons name={icon} size={25} color="#2563EB" />

      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.featureText, { color: colors.textSecondary }]}>
          {text}
        </Text>
      </View>
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
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },

  appName: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginTop: 15,
  },

  version: {
    textAlign: "center",
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  description: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 23,
    color: "#6B7280",
    marginTop: 18,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 15,
  },

  feature: {
    flexDirection: "row",
    marginBottom: 17,
  },

  featureContent: {
    flex: 1,
    marginLeft: 13,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  featureText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
    marginTop: 3,
  },

  tech: {
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 12,
  },

  footer: {
    alignItems: "center",
    marginTop: 5,
  },

  footerText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },

  copyright: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 10,
  },
});
