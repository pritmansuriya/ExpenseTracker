export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
};

export const transactions: Transaction[] = [
  {
    id: "1",
    title: "Salary",
    amount: 50000,
    type: "income",
    date: "22 Sep 2026",
    category: "Salary",
  },
  {
    id: "2",
    title: "Grocery Shopping",
    amount: 2500,
    type: "expense",
    date: "21 Sep 2026",
    category: "Shopping",
  },
  {
    id: "3",
    title: "Freelance Payment",
    amount: 12000,
    type: "income",
    date: "20 Sep 2026",
    category: "Freelance",
  },
  {
    id: "4",
    title: "Electricity Bill",
    amount: 1800,
    type: "expense",
    date: "19 Sep 2026",
    category: "Bills",
  },
  {
    id: "5",
    title: "Restaurant",
    amount: 950,
    type: "expense",
    date: "18 Sep 2026",
    category: "Food",
  },
  {
    id: "6",
    title: "Bonus",
    amount: 5000,
    type: "income",
    date: "17 Sep 2026",
    category: "Bonus",
  },
];
