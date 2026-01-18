import React, { useState } from 'react';
import { User, Expense } from '../types';
import { Plus, Trash2, User as UserIcon } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  setUsers: (users: User[]) => void;
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
}

export function UserManagement({ 
  users, 
  setUsers, 
  currentUserId, 
  setCurrentUserId,
  expenses,
  setExpenses
}: UserManagementProps) {
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim() || `${newUserName.toLowerCase().replace(/\s+/g, '.')}@example.com`
    };

    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setIsAddingUser(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (users.length <= 1) {
      alert('You cannot delete the last user.');
      return;
    }

    if (userId === currentUserId) {
      alert('You cannot delete the currently active user. Please switch users first.');
      return;
    }

    // Remove user from expenses
    const updatedExpenses = expenses.map(expense => ({
      ...expense,
      paidBy: expense.paidBy === userId ? currentUserId : expense.paidBy,
      splitBetween: expense.splitBetween.filter(id => id !== userId)
    })).filter(expense => 
      // Remove expenses that would have no one to split with
      expense.splitBetween.length > 0
    );

    setExpenses(updatedExpenses);
    setUsers(users.filter(user => user.id !== userId));
  };

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    setEditFormData({ name: user.name, email: user.email });
  };

  const saveEdit = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, name: editFormData.name, email: editFormData.email }
        : user
    ));
    setEditingUserId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">People</h2>
        <button
          onClick={() => setIsAddingUser(true)}
          className="btn btn-primary flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add Person</span>
        </button>
      </div>

      {isAddingUser && (
        <div className="card p-4 mb-6">
          <h3 className="font-medium mb-3">Add New Person</h3>
          <form onSubmit={handleAddUser} className="space-y-3">
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Name *
               </label>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="input w-full"
                placeholder="Enter name"
                required
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Email
               </label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="input w-full"
                placeholder="Enter email (optional)"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button type="submit" className="btn btn-primary flex-1">
                Add Person
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsAddingUser(false);
                  setNewUserName('');
                  setNewUserEmail('');
                }}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        {users.map(user => (
          <div 
            key={user.id} 
            className={`card p-4 flex items-center justify-between ${
              user.id === currentUserId ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                 <UserIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                {editingUserId === user.id ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="input input-sm"
                    />
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="input input-sm mt-1"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">
                      {user.name} {user.id === currentUserId && '(You)'}
                    </p>
                     <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              {editingUserId === user.id ? (
                <>
                   <button
                     onClick={() => saveEdit(user.id)}
                     className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-full"
                     title="Save"
                   >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                   <button
                     onClick={() => setEditingUserId(null)}
                     className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                     title="Cancel"
                   >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  {user.id !== currentUserId && (
                     <button
                       onClick={() => setCurrentUserId(user.id)}
                       className="text-sm text-primary-600 hover:text-primary-800 px-3 py-1 border border-primary-200 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900"
                     >
                      Switch
                    </button>
                  )}
                   <button
                     onClick={() => startEditing(user)}
                     className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                     title="Edit"
                   >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  {users.length > 1 && (
                     <button
                       onClick={() => handleDeleteUser(user.id)}
                       className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-full"
                       title="Delete"
                     >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
