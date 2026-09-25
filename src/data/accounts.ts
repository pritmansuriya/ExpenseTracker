import { Account } from "@/types/account";

export const defaultAccounts: Account[] = [
  {
    id: "1",
    name: "Cash",
    type: "cash",
    balance: 3500,
    createdAt: new Date().toISOString(),
  },

  {
    id: "2",
    name: "Bank Account",
    type: "bank",
    balance: 25000,
    createdAt: new Date().toISOString(),
  },

  {
    id: "3",
    name: "UPI",
    type: "upi",
    balance: 8500,
    createdAt: new Date().toISOString(),
  },

  {
    id: "4",
    name: "Credit Card",
    type: "credit",
    balance: 12000,
    createdAt: new Date().toISOString(),
  },
];
