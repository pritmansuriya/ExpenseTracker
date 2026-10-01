import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={55} color="#2563EB" />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Your Privacy Matters
        </Text>

        <Text style={[styles.updated, { color: colors.textSecondary }]}>
          Last updated: September 2026
        </Text>

        <Text style={[styles.intro, { color: colors.textSecondary }]}>
          Expenses Tracker is designed to help you manage your personal finances
          while keeping your information source.
        </Text>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            1. Information We Store
          </Text>

          <Text style={[styles.text, { color: colors.textSecondary }]}>
            The application may store information such as your profile details,
            transactions, savings goals, accounts, and notification preferences.
          </Text>
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            2. How We Use Your Data
          </Text>

          <Text style={[styles.text, { color: colors.textSecondary }]}>
            Your information is used to provie expense tracking, transaction
            managment, savings tracking, account managment,and other application
            features.
          </Text>
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            3. Local Storage
          </Text>

          <Text style={[styles.text, { color: colors.textSecondary }]}>
            Some application data may be stored locally on your device using
            local storage technology such as AsyncStorage. This allows the
            application to remember your data between sessions.
          </Text>
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            4. Data Security
          </Text>

          <Text style={[styles.text, { color: colors.textSecondary }]}>
            We take reasonable steps to protect the information handled by the
            application. You should also protect your device and avoid sharing
            your account credentials with others.
          </Text>
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            5. Your Responsibility
          </Text>

          <Text style={[styles.text, { color: colors.textSecondary }]}>
            Expense Tracker is a personal finance management tool. Please make
            sure the financial information you enter is accurate and keep your
            device secure.
          </Text>
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            6. Changes to This Policy
          </Text>

          <Text style={[styles.text, { color: colors.textSecondary }]}>
            This privacy policy may be updated when application features or data
            practices change. Any updated version will be displayed within the
            application.
          </Text>
        </View>

        <View
          style={[
            styles.footerBox,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Ionicons name="lock-closed-outline" size={28} color="#2563EB" />

          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            We respect your privacy and aim to keep your financial information
            protected.
          </Text>
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
    alignItems: "center",
    marginTop: 10,
  },

  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
  },

  updated: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 13,
    marginTop: 5,
    marginBottom: 20,
  },

  intro: {
    fontSize: 15,
    lineHeight: 23,
    color: "#4B5563",
    marginBottom: 20,
  },

  section: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
  },

  footerBox: {
    backgroundColor: "#EFF6FF",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  footerText: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: "#4B5563",
    marginTop: 8,
  },
});
