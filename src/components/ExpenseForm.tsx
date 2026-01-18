import React, { useState } from 'react';
import { DollarSign, Calendar, Users, Tag } from 'lucide-react';
import { Expense, User } from '../types';
import { generateId } from '../utils';

interface ExpenseFormProps {
  users: User[];
  currentUserId: string;
  onSubmit: (expense: Expense) => void;
  onCancel: () => void;
}

export function ExpenseForm({ users, currentUserId, onSubmit, onCancel }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [splitBetween, setSplitBetween] = useState<string[]>([currentUserId]);
  const [category, setCategory] = useState('general');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transportation' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Healthcare' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || splitBetween.length === 0) {
      return;
    }

    const expense: Expense = {
      id: generateId(),
      description,
      amount: parseFloat(amount),
      currency: 'USD',
      paidBy,
      splitBetween,
      group: 'default',
      date: new Date(date),
      category,
    };

    onSubmit(expense);
  };

  const toggleUserSelection = (userId: string) => {
    setSplitBetween(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6">Add Expense</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
            placeholder="What's this expense for?"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <DollarSign className="inline w-4 h-4 mr-1" />
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline w-4 h-4 mr-1" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag className="inline w-4 h-4 mr-1" />
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paid by
          </label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="input"
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Users className="inline w-4 h-4 mr-1" />
            Split between
          </label>
          <div className="space-y-2">
            {users.map(user => (
              <label key={user.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={splitBetween.includes(user.id)}
                  onChange={() => toggleUserSelection(user.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">{user.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button type="submit" className="btn btn-primary flex-1">
            Add Expense
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
