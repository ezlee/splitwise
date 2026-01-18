export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  createdBy: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string;
  splitBetween: string[];
  group: string;
  date: Date;
  category: string;
  receipts?: string[];
}

export interface Balance {
  userId: string;
  amount: number;
  isOwed: boolean;
}

export interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: Date;
  status: 'pending' | 'completed';
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
  percentage?: number;
}
