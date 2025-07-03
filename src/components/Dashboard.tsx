import { TrendingUp, TrendingDown, Wallet, Plus, MoreHorizontal } from 'lucide-react';
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
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const motivationalMessages = [
    "Setiap rupiah yang kamu kelola hari ini adalah investasi untuk masa depan yang lebih baik",
    "Keuangan yang sehat dimulai dari kebiasaan kecil yang konsisten",
    "Jangan biarkan uang mengendalikan hidupmu, tapi kendalikan uangmu untuk hidup yang lebih baik",
    "Setiap pengeluaran yang bijak adalah langkah menuju kebebasan finansial",
    "Budgeting bukan tentang membatasi, tapi tentang memberikan kebebasan pada masa depanmu"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % motivationalMessages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

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

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header - Fixed spacing and typography */}
      <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-10">
        {/* REMOVED: Header container div */}
      </div>

      <div className="max-w-md mx-auto px-6 pb-32 space-y-6">
        {/* Motivational Message - Better spacing */}
        <div className="py-6">
          <div className="overflow-hidden">
            <div key={currentMessageIndex} className="fade-in">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed px-4">
                {motivationalMessages[currentMessageIndex]}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Card - Improved design */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Balance</p>
            <div className="space-y-2">
              <p className={`text-4xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                Rp{formatCurrency(Math.abs(balance))}
              </p>
              <div className="flex items-center justify-center space-x-2">
                {balance >= 0 ? (
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Surplus</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-medium">Deficit</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row - Better spacing and alignment */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Income</span>
              </div>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                Rp{formatCurrency(totalIncome)}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Expenses</span>
              </div>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                Rp{formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions - Better layout */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            {recentTransactions.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {recentTransactions.length} transactions
              </span>
            )}
          </div>

          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 dark:bg-green-950' 
                          : 'bg-red-100 dark:bg-red-950'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{transaction.category}</p>
                          <p className={`font-bold text-sm ${
                            transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}Rp{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        {transaction.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                            {transaction.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(transaction.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">No transactions yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Start by adding your first transaction
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;