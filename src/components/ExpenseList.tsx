import { Expense, User } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { Trash2, Edit, Users } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  users: User[];
  currentUserId: string;
  onDelete?: (expenseId: string) => void;
  onEdit?: (expense: Expense) => void;
}

export function ExpenseList({ expenses, users, currentUserId, onDelete, onEdit }: ExpenseListProps) {
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      food: '🍕',
      transport: '🚗',
      entertainment: '🎬',
      utilities: '💡',
      shopping: '🛍️',
      health: '🏥',
      general: '📝',
      other: '📌',
    };
    return icons[category] || '📝';
  };

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (expenses.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">No expenses yet. Add your first expense!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Expenses</h2>
      
       {sortedExpenses.map(expense => {
         const splitAmount = expense.amount / expense.splitBetween.length;
        const isCurrentUserExpense = expense.paidBy === currentUserId;
        
        return (
          <div key={expense.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getCategoryIcon(expense.category)}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{expense.description}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(expense.date)} • {getUserName(expense.paidBy)} paid
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </span>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      Split between {expense.splitBetween.length} people
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">You owe</p>
                    <p className="font-medium text-primary-600">
                      {expense.splitBetween.includes(currentUserId) 
                        ? formatCurrency(splitAmount)
                        : formatCurrency(0)
                      }
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {expense.splitBetween.map(userId => (
                    <span 
                      key={userId}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        userId === currentUserId
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {getUserName(userId)}
                    </span>
                  ))}
                </div>
              </div>
              
              {(isCurrentUserExpense || onDelete) && (
                <div className="flex space-x-2 ml-4">
                  {onEdit && isCurrentUserExpense && (
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edit expense"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
