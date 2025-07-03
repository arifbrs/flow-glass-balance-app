import { TrendingUp, TrendingDown, Wallet, Target, Edit2, Trash2 } from 'lucide-react';
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
    "Selamat Pagi! Setiap rupiah yang kamu kelola hari ini adalah investasi untuk masa depan yang lebih baik!",
    "Selamat Siang! Keuangan yang sehat dimulai dari kebiasaan kecil yang konsisten!",
    "Selamat Sore! Jangan biarkan uang mengendalikan hidupmu, tapi kendalikan uangmu untuk hidup yang lebih baik!",
    "Selamat Malam! Setiap pengeluaran yang bijak adalah langkah menuju kebebasan finansial!",
    "Budgeting bukan tentang membatasi, tapi tentang memberikan kebebasan pada masa depanmu!",
    "Mulai hari ini dengan keputusan finansial yang cerdas!",
    "Kekayaan sejati bukan dari berapa yang kamu hasilkan, tapi berapa yang kamu simpan!"
  ];

  const getTimeBasedMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return motivationalMessages[0]; // Morning
    if (hour < 15) return motivationalMessages[1]; // Afternoon
    if (hour < 18) return motivationalMessages[2]; // Evening
    return motivationalMessages[3]; // Night
  };

  useEffect(() => {
    // Start with time-based message
    const timeBasedIndex = motivationalMessages.findIndex(msg => msg === getTimeBasedMessage());
    setCurrentMessageIndex(timeBasedIndex);

    // Rotate through all messages every 5 seconds
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % motivationalMessages.length);
    }, 5000);

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
  const budgetRemaining = monthlyBudget - totalExpenses;
  const budgetUsedPercentage = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Compact Header with Single Rotating Message */}
      <div className="text-center py-4">
        <div className="overflow-hidden h-12 flex items-center justify-center">
          <div 
            key={currentMessageIndex}
            className="animate-fade-in px-4"
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              {motivationalMessages[currentMessageIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Balance Card */}
      <Card className="glass p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
        <div className="relative space-y-3">
          <p className="text-muted-foreground text-sm font-medium">Saldo Saat Ini</p>
          <p className={`text-4xl font-bold ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
            Rp{formatCurrency(Math.abs(balance))}
          </p>
          <div className="flex items-center justify-center space-x-2">
            {balance >= 0 ? (
              <TrendingUp className="w-5 h-5 text-income" />
            ) : (
              <TrendingDown className="w-5 h-5 text-expense" />
            )}
            <span className={`text-sm font-medium ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
              {balance >= 0 ? 'Surplus' : 'Defisit'}
            </span>
          </div>
        </div>
      </Card>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass p-5 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl income-gradient flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-xs font-medium">Pemasukan</p>
              <p className="font-bold text-income text-lg">Rp{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </Card>

        <Card className="glass p-5 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl expense-gradient flex items-center justify-center shadow-lg">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-xs font-medium">Pengeluaran</p>
              <p className="font-bold text-expense text-lg">Rp{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Budget Progress - Only show if budget is set */}
      {monthlyBudget > 0 && (
        <Card className="glass p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-accent" />
                <span className="font-medium">Anggaran Bulanan</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Rp{formatCurrency(Math.abs(budgetRemaining))} {budgetRemaining >= 0 ? 'tersisa' : 'melebihi'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Terpakai: Rp{formatCurrency(totalExpenses)}</span>
                <span>Anggaran: Rp{formatCurrency(monthlyBudget)}</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    budgetUsedPercentage > 100 
                      ? 'expense-gradient' 
                      : budgetUsedPercentage > 80 
                        ? 'bg-yellow-500' 
                        : 'savings-gradient'
                  }`}
                  style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                ></div>
              </div>
              <p className={`text-sm text-center font-medium ${
                budgetUsedPercentage > 100 
                  ? 'text-expense' 
                  : budgetUsedPercentage > 80 
                    ? 'text-yellow-500' 
                    : 'text-savings'
              }`}>
                {budgetUsedPercentage.toFixed(1)}% dari anggaran terpakai
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Recent Transactions */}
      <Card className="glass p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-accent" />
              <span className="font-medium">Transaksi Terbaru</span>
            </div>
            {recentTransactions.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {recentTransactions.length} transaksi
              </span>
            )}
          </div>
          
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="group relative">
                  <div className="flex items-center justify-between p-4 rounded-2xl glass hover:bg-muted/20 transition-all duration-200">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        transaction.type === 'income' ? 'income-gradient' : 'expense-gradient'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-5 h-5 text-white" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">{transaction.category}</span>
                          <span className={`font-bold text-sm ${
                            transaction.type === 'income' ? 'text-income' : 'text-expense'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}Rp{formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        {transaction.description && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">{transaction.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(transaction.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    {onDeleteTransaction && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-destructive hover:text-destructive"
                        onClick={() => onDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 opacity-50" />
              </div>
              <p className="font-medium">Belum ada transaksi</p>
              <p className="text-sm mt-1">Mulai dengan menambahkan transaksi pertama Anda</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;