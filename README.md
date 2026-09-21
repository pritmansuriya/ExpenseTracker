# 💰 Expense Tracker Mobile Application

A modern and user-friendly **Expense Tracker Mobile Application** built with **React Native and Expo**. The application helps users manage their daily expenses, track income, monitor spending habits, and maintain a clear overview of their financial activities.

## 📱 Features

* 🏠 **Dashboard**

  * View total balance
  * View total income
  * View total expenses
  * Quick financial summary

* 💸 **Expense Management**

  * Add new expenses
  * Edit expenses
  * Delete expenses
  * Categorize expenses
  * View expense history

* 💰 **Income Management**

  * Add income transactions
  * Track total income
  * View income history

* 📊 **Transaction Tracking**

  * View all transactions
  * Separate income and expenses
  * Display transaction date and category
  * Easy-to-read transaction list

* 👤 **Profile**

  * View user information
  * Manage profile details
  * Application settings

* 📈 **Financial Overview**

  * Monitor spending patterns
  * Track income vs expenses
  * Quickly understand current financial status

* 📱 **Mobile-Friendly UI**

  * Clean and responsive interface
  * Designed specifically for Android and iOS
  * Simple navigation and user experience

---

## 🛠️ Technologies Used

### Frontend

* **React Native**
* **Expo**
* **TypeScript**
* **Expo Router**
* **React Native Components**
* **JavaScript / TypeScript**

### Development Tools

* **Node.js**
* **npm**
* **VS Code**
* **Expo CLI**
* **Git & GitHub**

---

## 📂 Project Structure

```text
expense-tracker/
│
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── transactions.tsx
│   │   └── profile.tsx
│   │
│   ├── add-expense.tsx
│   ├── _layout.tsx
│   └── ...
│
├── components/
│   ├── BalanceCard.tsx
│   ├── SummaryCard.tsx
│   ├── TransactionItem.tsx
│   └── ...
│
├── constants/
│   ├── colors.ts
│   └── ...
│
├── data/
│   └── transactions.ts
│
├── assets/
│   ├── images/
│   └── ...
│
├── package.json
├── tsconfig.json
├── app.json
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/expense-tracker.git
```

### 2. Navigate to the Project

```bash
cd expense-tracker
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Expo Development Server

```bash
npx expo start
```

After starting the development server, Expo will provide options to run the application.

### 5. Run on Android

You can press:

```text
a
```

in the Expo terminal to open the application on an Android emulator.

You can also scan the QR code using **Expo Go** on your Android device.

### 6. Run on iOS

For macOS/iOS development:

```text
i
```

You can also use the Expo Go application on an iPhone.

---

## 🧭 Application Navigation

The application uses **Expo Router** for navigation.

```text
Home
│
├── Dashboard
│   ├── Balance
│   ├── Income
│   └── Expenses
│
├── Transactions
│   ├── Income Transactions
│   └── Expense Transactions
│
├── Add Expense
│   └── Expense Form
│
└── Profile
    └── User Information
```

---

## 💳 Example Transaction Data

Transactions can contain information such as:

```typescript
{
  id: "1",
  title: "Grocery Shopping",
  amount: 2500,
  type: "expense",
  category: "Food",
  date: "2026-09-21"
}
```

Income example:

```typescript
{
  id: "2",
  title: "Monthly Salary",
  amount: 50000,
  type: "income",
  category: "Salary",
  date: "2026-09-01"
}
```

---

## 🧮 Balance Calculation

The application calculates the available balance using:

```text
Balance = Total Income - Total Expenses
```

For example:

```text
Total Income      = ₹50,000
Total Expenses    = ₹15,000
----------------------------
Available Balance = ₹35,000
```

---

## 🎨 UI Design

The application focuses on:

* Simple and clean interface
* Mobile-first design
* Easy navigation
* Clear financial information
* Reusable React Native components
* Consistent colors and typography
* Card-based dashboard layout


## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git add .
git commit -m "Add your feature"
```

5. Push the branch.

```bash
git push origin feature/your-feature
```

6. Create a Pull Request.

---

## 📄 License

This project is created for **educational and personal development purposes**.

---

## 👨‍💻 Author

**Prit Mansuriya**

GitHub:
`https://github.com/your-username`

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
