import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Bell, Plus } from 'lucide-react';
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

  const getPercentageChange = () => {
    // Mock percentage for demo - in real app this would be calculated from previous period
    return balance > 0 ? "+6.96%" : "-2.34%";
  };

  const getCategoryIcon = (category: string) => {
    const firstLetter = category.charAt(0).toUpperCase();
    return firstLetter;
  };

  const gradientColors = [
    'from-blue-600 to-purple-600',
    'from-purple-600 to-pink-600', 
    'from-green-500 to-blue-500',
    'from-orange-500 to-red-500'
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header - Refined spacing */}
      <div className="flex items-center justify-between px-5 pt-14 pb-6">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-base">U</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full w-10 h-10">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full w-10 h-10">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Balance Section - Better typography hierarchy */}
      <div className="px-5 mb-8">
        <p className="text-gray-400 text-sm font-medium mb-3">Balance</p>
        <div className="flex items-center space-x-4 mb-8">
          <h1 className="text-[2.75rem] font-bold text-white leading-none tracking-tight">
            {formatCurrency(balance)}
          </h1>
          <div className="bg-blue-600 px-3 py-1.5 rounded-full">
            <span className="text-white text-sm font-semibold">{getPercentageChange()}</span>
          </div>
        </div>

        {/* Action Buttons - Refined spacing */}
        <div className="flex justify-center space-x-6 mb-10">
          <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
            <ArrowUpRight className="w-5 h-5 text-black" />
          </button>
          <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
            <ArrowDownLeft className="w-5 h-5 text-black" />
          </button>
          <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
            <TrendingUp className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      {/* My Transactions Section - Better spacing */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">My transactions</h2>
          <button className="text-gray-400 text-sm font-medium hover:text-white transition-colors">
            See all
          </button>
        </div>

        {/* Transaction Cards - Refined design */}
        <div className="space-y-3">
          {categoryCards.length > 0 ? (
            categoryCards.map((group, index) => (
              <div
                key={group.category}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${gradientColors[index % gradientColors.length]} p-5 hover:scale-[1.02] transition-transform cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 bg-black/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-base">
                        {getCategoryIcon(group.category)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-base leading-tight">{group.category}</h3>
                      <p className="text-white/70 text-sm font-medium mt-0.5">
                        {group.transactions.length} transaction{group.transactions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
                    <span className="text-white font-bold text-sm">
                      {formatCurrency(group.total)}
                    </span>
                  </div>
                </div>
                
                {/* Decorative background elements */}
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -right-3 -top-3 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-300 text-lg font-semibold">No transactions yet</p>
              <p className="text-gray-500 text-sm mt-2 font-medium">
                Start by adding your first transaction
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom spacing for navigation */}
      <div className="h-28"></div>
    </div>
  );
};

export default Dashboard;