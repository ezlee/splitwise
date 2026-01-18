import { Expense, Balance, User, ExpenseSplit } from './types';

export function calculateBalances(expenses: Expense[], users: User[]): Balance[] {
  const balances: { [userId: string]: number } = {};
  
  users.forEach(user => {
    balances[user.id] = 0;
  });

  expenses.forEach(expense => {
    const paidBy = expense.paidBy;
    const splitAmount = expense.amount / expense.splitBetween.length;
    
    balances[paidBy] += expense.amount;
    
    expense.splitBetween.forEach(userId => {
      balances[userId] -= splitAmount;
    });
  });

  return Object.entries(balances).map(([userId, amount]) => ({
    userId,
    amount: Math.abs(amount),
    isOwed: amount >= 0,
  }));
}

export function calculateSettlements(balances: Balance[]): Array<{
  from: string;
  to: string;
  amount: number;
}> {
  const debtors = balances.filter(b => !b.isOwed).sort((a, b) => b.amount - a.amount);
  const creditors = balances.filter(b => b.isOwed).sort((a, b) => b.amount - a.amount);
  
  const settlements: Array<{ from: string; to: string; amount: number }> = [];
  
  let i = 0, j = 0;
  
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const amount = Math.min(debtor.amount, creditor.amount);
    
    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount,
    });
    
    debtor.amount -= amount;
    creditor.amount -= amount;
    
    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }
  
  return settlements;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function splitExpenseEqually(expense: Expense, users: User[]): ExpenseSplit[] {
  const splitAmount = expense.amount / users.length;
  return users.map(user => ({
    userId: user.id,
    amount: splitAmount,
  }));
}

export function splitExpenseByPercentage(
  expense: Expense,
  percentages: { userId: string; percentage: number }[]
): ExpenseSplit[] {
  return percentages.map(({ userId, percentage }) => ({
    userId,
    amount: (expense.amount * percentage) / 100,
    percentage,
  }));
}
