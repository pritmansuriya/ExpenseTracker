import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Transaction } from "@/types/transaction";
import { exportTrasnactionToCSV } from "@/utils/exportTransactions";

const STORAGE_KEY = "transactions";

export default function ExportTransactionScreen() {
  const { colors } = useTheme();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        setTransactions(JSON.parse(data));
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.log("Error loading transactions:", error);

      Alert.alert("Error", "Unable to load your transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleCSVExport = async () => {
    if (transactions.length === 0) {
      Alert.alert("No Transactions", "There are no transactions to export.");
      return;
    }

    try {
      setExporting(true);

      await exportTrasnactionToCSV(transactions);
    } catch (error) {
      console.log("CSV export error", error);

      Alert.alert("Export Failed.", "Unable to export your transactions.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" />

        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading transactions...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={[styles.backText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>
          Export Tranasactions
        </Text>

        <View style={styles.headerSpace}></View>
      </View>
      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          Total Transactions
        </Text>

        <Text style={[styles.summaryValue, { color: colors.text }]}>
          {transactions.length}
        </Text>
      </View>

      {/* Section Title */}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Export Format
      </Text>

      {/* CSV */}

      <TouchableOpacity
        style={[
          styles.exportCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={handleCSVExport}
        disabled={exporting}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📊</Text>
        </View>

        <View style={styles.optionContent}>
          <Text style={[styles.optionTitle, { color: colors.text }]}>CSV</Text>

          <Text
            style={[styles.optionDescription, { color: colors.textSecondary }]}
          >
            Export all your transactions as a CSV file
          </Text>
        </View>

        <Text style={[styles.arrow, { color: colors.textSecondary }]}>→</Text>
      </TouchableOpacity>

      {/* Exporting */}

      {exporting && (
        <View style={styles.exportingContainer}>
          <ActivityIndicator />

          <Text style={[styles.exportingText, { color: colors.textSecondary }]}>
            Preparing your CSV file...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  backText: {
    fontSize: 28,
  },

  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  headerSpace: {
    width: 40,
  },

  summaryCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },

  summaryLabel: {
    fontSize: 14,
  },

  summaryValue: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  exportCard: {
    minHeight: 90,
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 30,
  },

  optionContent: {
    flex: 1,
    marginLeft: 14,
  },

  optionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  optionDescription: {
    fontSize: 13,
    marginTop: 5,
    lineHeight: 19,
  },

  arrow: {
    fontSize: 24,
    marginLeft: 10,
  },

  exportingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  exportingText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
