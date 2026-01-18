import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Plus, Home, CreditCard, User as UserIcon, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { BalanceSummary } from './components/BalanceSummary';
import { UserManagement } from './components/UserManagement';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Expense, User, Balance } from './types';
import { calculateBalances, generateId } from './utils';

type Tab = 'expenses' | 'balance' | 'people';

function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('splitwise-expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  // Initialize with the authenticated user if none exists in localStorage
  const initialUsers: User[] = user ? [
    {
      id: generateId(),
      name: user.name,
      email: user.email,
      avatar: undefined
    }
  ] : [];

  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('splitwise-users');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      // Ensure the authenticated user is in the list
      if (user && !parsedUsers.some((u: User) => u.email === user.email)) {
        return [initialUsers[0], ...parsedUsers];
      }
      return parsedUsers;
    }
    return initialUsers;
  });
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const savedUserId = localStorage.getItem('splitwise-current-user');
    if (savedUserId) {
      // Check if the saved user still exists
      const userExists = users.some((u: User) => u.id === savedUserId);
      if (userExists) return savedUserId;
    }
    return users[0]?.id || '';
  });
  const [activeTab, setActiveTab] = useState<Tab>('expenses');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [balances, setBalances] = useState<Balance[]>([]);

  // Save expenses, users and current user ID to localStorage when they change
  useEffect(() => {
    localStorage.setItem('splitwise-users', JSON.stringify(users));
    localStorage.setItem('splitwise-current-user', currentUserId);
    localStorage.setItem('splitwise-expenses', JSON.stringify(expenses));

    const calculatedBalances = calculateBalances(expenses, users);
    setBalances(calculatedBalances);
  }, [expenses, users, currentUserId]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses((prev: Expense[]) => [...prev, expense]);
    setShowExpenseForm(false);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((prev: Expense[]) => prev.filter((e: Expense) => e.id !== expenseId));
  };
  
  const handleEditExpense = (updatedExpense: Expense) => {
    setExpenses((prev: Expense[]) => 
      prev.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const renderContent = () => {
    if (showExpenseForm) {
      return (
        <ExpenseForm
          users={users}
          currentUserId={currentUserId}
          onSubmit={handleAddExpense}
          onCancel={() => setShowExpenseForm(false)}
        />
      );
    }

    switch (activeTab) {
      case 'expenses':
        return (
          <div className="space-y-6">
            <ExpenseList
              expenses={expenses}
              users={users}
              currentUserId={currentUserId}
              onDelete={handleDeleteExpense}
              onEdit={handleEditExpense}
            />
          </div>
        );
      case 'balance':
        return (
          <BalanceSummary
            balances={balances}
            users={users}
            currentUserId={currentUserId}
          />
        );
      case 'people':
        return (
          <UserManagement
            users={users}
            setUsers={setUsers}
            currentUserId={currentUserId}
            setCurrentUserId={setCurrentUserId}
            expenses={expenses}
            setExpenses={setExpenses}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-primary-600">Splitwise</h1>
              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome, {user.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="btn btn-secondary flex items-center"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              <button
                onClick={logout}
                className="btn btn-secondary flex items-center space-x-2"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowExpenseForm(true)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <nav className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'expenses'
                ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Expenses</span>
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'balance'
                ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Balance</span>
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'people'
                ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>People</span>
          </button>
        </nav>

        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
