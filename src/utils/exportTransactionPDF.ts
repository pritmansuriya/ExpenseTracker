import { Transaction } from "@/types/transaction";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const exportTransactionsToPDF = async (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    throw new Error("No transactions available to export.");
  }

  const rows = transactions
    .map(
      (transaction) => `
        <tr>
          <td>${transaction.title}</td>
          <td>${transaction.category}</td>
          <td>₹${transaction.amount}</td>
          <td>${transaction.type}</td>
          <td>${transaction.date}</td>
        </tr>
      `,
    )
    .join("");

  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial;
            padding: 20px;
          }

          h1 {
            text-align: center;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            font-size: 12px;
          }

          th {
            background: #eeeeee;
          }
        </style>
      </head>

      <body>
        <h1>Expense Tracker</h1>

        <h2>Transaction Report</h2>

        <p>
          Total Transactions:
          ${transactions.length}
        </p>

        <table>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
          </tr>

          ${rows}
        </table>
      </body>
    </html>
  `;

  const { base64 } = await Print.printToFileAsync({
    html,
    base64: true,
  });

  if (await Sharing.isAvailableAsync()) {
    if (!base64) {
      throw new Error("Unable to read the generated PDF data.");
    }

    const fileUri = `${FileSystem.documentDirectory}expense-transactions.pdf`;
    const existingFile = await FileSystem.getInfoAsync(fileUri);

    if (existingFile.exists) {
      await FileSystem.deleteAsync(fileUri);
    }

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: "application/pdf",
      dialogTitle: "Export Transactions as PDF",
      UTI: "com.adobe.pdf",
    });
  }
};
