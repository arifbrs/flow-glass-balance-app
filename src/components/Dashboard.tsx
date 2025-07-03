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
    <div className="min-h-screen bg-background threads-text">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Finance</h1>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-24 space-y-6">
        {/* Motivational Message */}
        <div className="py-4">
          <div className="overflow-hidden">
            <div key={currentMessageIndex} className="fade-in">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                {motivationalMessages[currentMessageIndex]}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Card - Threads Style */}
        <div className="threads-card threads-shadow">
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground font-medium">Total Balance</p>
            <div className="space-y-1">
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Rp{formatCurrency(Math.abs(balance))}
              </p>
              <div className="flex items-center justify-center space-x-1">
                {balance >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {balance >= 0 ? 'Surplus' : 'Deficit'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="threads-card">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-muted-foreground">Income</span>
              </div>
              <p className="text-lg font-semibold text-green-600">
                Rp{formatCurrency(totalIncome)}
              </p>
            </div>
          </div>

          <div className="threads-card">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm text-muted-foreground">Expenses</span>
              </div>
              <p className="text-lg font-semibold text-red-600">
                Rp{formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            {recentTransactions.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {recentTransactions.length} transactions
              </span>
            )}
          </div>

          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div key={transaction.id} className="threads-card group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 dark:bg-green-950' 
                          : 'bg-red-100 dark:bg-red-950'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">{transaction.category}</p>
                          <p className={`font-semibold text-sm ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}Rp{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        {transaction.description && (
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {transaction.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(transaction.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="threads-card text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-medium text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-1">
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