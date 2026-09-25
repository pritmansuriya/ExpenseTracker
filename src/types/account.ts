export type AccountType = "cash" | "bank" | "upi" | "credit";

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  createdAt: string;
};
