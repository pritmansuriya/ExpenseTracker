import { Transaction } from "@/types/transaction";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";

export const exportTransactionsToExcel = async (
  transactions: Transaction[],
) => {
  if (transactions.length === 0) {
    throw new Error("No transactions available to export.");
  }

  const data = transactions.map((transaction) => ({
    Title: transaction.title,
    Category: transaction.category,
    Amount: transaction.amount,
    Type: transaction.type,
    Date: transaction.date,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  const excelBase64 = XLSX.write(workbook, {
    type: "base64",
    bookType: "xlsx",
  });

  const fileUri = FileSystem.documentDirectory + "expense-transactions.xlsx";

  await FileSystem.writeAsStringAsync(fileUri, excelBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Export Transactions as Excel",
      UTI: "com.microsoft.excel.xlsx",
    });
  }
};
