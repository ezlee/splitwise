import { Balance, User } from '../types';
import { formatCurrency } from '../utils';
import { ArrowUpRight, ArrowDownRight, Users } from 'lucide-react';

interface BalanceSummaryProps {
  balances: Balance[];
  users: User[];
  currentUserId: string;
}

export function BalanceSummary({ balances, users, currentUserId }: BalanceSummaryProps) {
  const currentBalance = balances.find(b => b.userId === currentUserId);
  const otherBalances = balances.filter(b => b.userId !== currentUserId);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const totalOwed = balances
    .filter(b => b.isOwed)
    .reduce((sum, b) => sum + b.amount, 0);

  const totalOwing = balances
    .filter(b => !b.isOwed)
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Your Balance</h2>
        
        {currentBalance && (
          <div className={`text-center py-6 px-4 rounded-lg ${
            currentBalance.isOwed 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center justify-center mb-2">
              {currentBalance.isOwed ? (
                <ArrowUpRight className="w-8 h-8 text-green-600" />
              ) : (
                <ArrowDownRight className="w-8 h-8 text-red-600" />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {currentBalance.isOwed ? 'You are owed' : 'You owe'}
            </p>
            <p className={`text-3xl font-bold ${
              currentBalance.isOwed ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(currentBalance.amount)}
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Group Summary
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
             <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Owed</p>
             <p className="text-xl font-semibold text-green-600">
               {formatCurrency(totalOwed)}
             </p>
           </div>
           <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
             <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Owing</p>
             <p className="text-xl font-semibold text-red-600">
               {formatCurrency(totalOwing)}
             </p>
           </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Individual Balances</h4>
          {otherBalances.map(balance => {
            const userName = getUserName(balance.userId);
            return (
              <div 
                key={balance.userId} 
                 className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    balance.isOwed ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium">{userName}</span>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    balance.isOwed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {balance.isOwed ? '+' : '-'}{formatCurrency(balance.amount)}
                  </p>
                   <p className="text-xs text-gray-500 dark:text-gray-400">
                     {balance.isOwed ? 'is owed' : 'owes'}
                   </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
