import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Bell, Plus, Home, BarChart3, CreditCard, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

interface DashboardProps {
  transactions: Transaction[];
  monthlyBudget: number;
  onDeleteTransaction?: (id: string) => void;
}

const Dashboard = ({ transactions, monthlyBudget, onDeleteTransaction }: DashboardProps) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Group transactions by category for the card view
  const categoryGroups = currentMonthTransactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = {
        category,
        total: 0,
        type: transaction.type,
        transactions: []
      };
    }
    acc[category].total += transaction.amount;
    acc[category].transactions.push(transaction);
    return acc;
  }, {} as Record<string, { category: string; total: number; type: 'income' | 'expense'; transactions: Transaction[] }>);

  const categoryCards = Object.values(categoryGroups).slice(0, 4);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    const firstLetter = category.charAt(0).toUpperCase();
    return firstLetter;
  };

  const getCardGradient = (index: number) => {
    const gradients = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600', 
      'from-green-500 to-green-600',
      'from-orange-500 to-red-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <div>
              <p className="text-gray-900 font-semibold">Greetings! 👋</p>
              <p className="text-gray-500 text-sm">Manage your finances</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 rounded-full w-9 h-9">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 rounded-full w-9 h-9">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-gray-400 text-sm mb-2">Total Balance</p>
            <h1 className="text-3xl font-bold mb-6">{formatCurrency(balance)}</h1>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-2 backdrop-blur-sm">
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-gray-300">Send</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-2 backdrop-blur-sm">
                  <ArrowDownLeft className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-gray-300">Receive</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-2 backdrop-blur-sm">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-gray-300">Invest</p>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Statistics</h2>
          <button className="text-gray-500 text-sm">See all</button>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-900 font-semibold">Total</span>
            <span className="text-gray-500 text-sm">This month</span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{formatCurrency(Math.abs(balance))}</h3>
          
          {/* Donut Chart Placeholder */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
              <div className="absolute inset-0 w-32 h-32 rounded-full border-8 border-blue-500 border-t-transparent transform rotate-45"></div>
              <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {categoryCards.slice(0, 3).map((group, index) => (
              <div key={group.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getCardGradient(index)} flex items-center justify-center`}>
                    <span className="text-white font-bold text-xs">{getCategoryIcon(group.category)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{group.category}</p>
                    <p className="text-gray-500 text-xs">
                      {group.transactions.length} transaction{group.transactions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-gray-900 text-sm">
                  {group.type === 'expense' ? '-' : '+'}{formatCurrency(group.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Sales</h3>
            <button className="text-gray-500 text-sm">View all</button>
          </div>

          {currentMonthTransactions.slice(0, 3).map((transaction, index) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="font-bold text-gray-600 text-sm">{getCategoryIcon(transaction.category)}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{transaction.category}</p>
                  <p className="text-gray-500 text-xs">{transaction.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}

          {currentMonthTransactions.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No transactions yet</p>
              <p className="text-gray-400 text-sm mt-1">Start by adding your first transaction</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-6 right-6">
        <div className="bg-gray-900 rounded-full px-4 py-3 flex items-center justify-center">
          <div className="flex items-center space-x-8">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full w-10 h-10">
              <Home className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full w-10 h-10">
              <BarChart3 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full w-10 h-10">
              <CreditCard className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full w-10 h-10">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-24"></div>
    </div>
  );
};

export default Dashboard;