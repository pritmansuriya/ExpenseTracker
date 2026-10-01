import { Transaction } from "@/types/transaction";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export const exportTrasnactionToCSV = async (transactions: Transaction[]) => {
  try {
    if (transactions.length === 0) {
      throw new Error("No transactions available to export.");
    }

    const header = ["Title", "Category", "Amount", "Type", "Date"].join(",");

    const rows = transactions.map((transaction) => {
      return [
        `"${transaction.title.replace(/"/g, '""')}"`,
        `"${transaction.category.replace(/"/g, '""')}"`,
        transaction.amount,
        transaction.type,
        `"${transaction.date}"`,
      ].join(",");
    });

    const csv = [header, ...rows].join("\n");

    const fileUri = FileSystem.documentDirectory + "expense-transactions.csv";

    await FileSystem.writeAsStringAsync(fileUri, csv);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Export Tranactions",
        UTI: "public.comma-seprated-values-text",
      });
    }
  } catch (error) {
    console.log("CSV export error:", error);
    throw error;
  }
};
