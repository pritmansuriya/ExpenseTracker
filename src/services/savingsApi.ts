import api from "./api";

export const getSavingsGoals = async () => {
  const response = await api.get("/savings-goal");
  return response.data;
};

export const getSavingsGoalById = async (id: string) => {
  const response = await api.get(`/savings-goal/${id}`);
  return response.data;
};

export const addSavingsGoal = async (goal: {
  name: string;
  targetAmount: number;
}) => {
  const response = await api.post("/savings-goal", goal);
  return response.data;
};

export const addMoneyToGoal = async (id: string, amount: number) => {
  const response = await api.patch(`/savings-goal/${id}/add-money`, { amount });
  return response.data;
};

export const deleteSavingsGoal = async (id: string) => {
  const response = await api.delete(`/savings-goal/${id}`);
  return response.data;
};
