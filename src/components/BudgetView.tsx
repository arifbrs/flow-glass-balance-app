import { useState } from 'react';
import { Target, Edit2, Check, X, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

interface BudgetViewProps {
  transactions: Transaction[];
  monthlyBudget: number;
  onUpdateBudget: (budget: number) => void;
}

const BudgetView = ({ transactions, monthlyBudget, onUpdateBudget }: BudgetViewProps) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [displayBudget, setDisplayBudget] = useState('');

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetRemaining = monthlyBudget - totalExpenses;
  const budgetUsedPercentage = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;

  // Category breakdown
  const categoryExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryExpenses)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const formatCurrencyInput = (value: string) => {
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(parseInt(number) || 0);
  };

  const handleBudgetInputChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setBudgetInput(numericValue);
    setDisplayBudget(formatCurrencyInput(numericValue));
  };

  const handleBudgetSave = () => {
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      onUpdateBudget(newBudget);
      setIsEditingBudget(false);
      setBudgetInput('');
      setDisplayBudget('');
    }
  };

  const handleBudgetCancel = () => {
    setBudgetInput('');
    setDisplayBudget('');
    setIsEditingBudget(false);
  };

  const handleSetBudget = () => {
    setIsEditingBudget(true);
    setBudgetInput(monthlyBudget.toString());
    setDisplayBudget(formatCurrency(monthlyBudget));
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-2xl font-bold gradient-text">Anggaran Bulanan</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Budget Setting Card */}
      <Card className="glass p-6 border-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-accent" />
              <span className="font-medium">Anggaran Bulanan</span>
            </div>
            {!isEditingBudget && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSetBudget}
                className="p-2"
              >
                {monthlyBudget > 0 ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </Button>
            )}
          </div>

          {isEditingBudget ? (
            <div className="space-y-3">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
                  <Input
                    type="text"
                    value={displayBudget}
                    onChange={(e) => handleBudgetInputChange(e.target.value)}
                    placeholder="Masukkan jumlah anggaran"
                    className="pl-10 glass text-lg h-12 border-0"
                  />
                </div>
                <Button
                  onClick={handleBudgetSave}
                  size="sm"
                  className="px-4 bg-primary hover:bg-primary/90 h-12"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleBudgetCancel}
                  variant="ghost"
                  size="sm"
                  className="px-4 h-12"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              {monthlyBudget > 0 ? (
                <>
                  <p className="text-3xl font-bold text-accent">
                    Rp{formatCurrency(monthlyBudget)}
                  </p>
                  <p className={`text-sm ${budgetRemaining >= 0 ? 'text-income' : 'text-expense'}`}>
                    Rp{formatCurrency(Math.abs(budgetRemaining))} {budgetRemaining >= 0 ? 'tersisa' : 'melebihi anggaran'}
                  </p>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="font-medium text-muted-foreground">Belum ada anggaran</p>
                  <p className="text-sm text-muted-foreground mt-1">Klik tombol + untuk menambahkan anggaran bulanan</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Budget Progress - Only show if budget is set */}
      {monthlyBudget > 0 && (
        <Card className="glass p-6 border-0">
          <div className="space-y-4">
            <h3 className="font-medium">Progress Anggaran</h3>
            
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
              
              <div className="text-center">
                <p className={`text-lg font-semibold ${
                  budgetUsedPercentage > 100 
                    ? 'text-expense' 
                    : budgetUsedPercentage > 80 
                      ? 'text-yellow-500' 
                      : 'text-savings'
                }`}>
                  {budgetUsedPercentage.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">dari anggaran terpakai</p>
              </div>
            </div>

            {budgetUsedPercentage > 90 && (
              <div className={`p-3 rounded-xl ${
                budgetUsedPercentage > 100 ? 'bg-expense/10' : 'bg-yellow-500/10'
              }`}>
                <div className="flex items-center space-x-2">
                  <TrendingUp className={`w-4 h-4 ${
                    budgetUsedPercentage > 100 ? 'text-expense' : 'text-yellow-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    budgetUsedPercentage > 100 ? 'text-expense' : 'text-yellow-500'
                  }`}>
                    {budgetUsedPercentage > 100 ? 'Anggaran Terlampaui!' : 'Peringatan Anggaran!'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {budgetUsedPercentage > 100 
                    ? 'Anda telah melampaui anggaran bulanan.'
                    : 'Anda hampir melampaui anggaran bulanan.'
                  }
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Category Breakdown - Only show if there are expenses */}
      {sortedCategories.length > 0 && (
        <Card className="glass p-6 border-0">
          <div className="space-y-4">
            <h3 className="font-medium">Kategori Pengeluaran Teratas</h3>
            
            <div className="space-y-3">
              {sortedCategories.map(([category, amount]) => {
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-expense">Rp{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className="h-2 rounded-full expense-gradient transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}% dari total pengeluaran
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Budget Tips */}
      <Card className="glass p-6 border-0">
        <div className="space-y-4">
          <h3 className="font-medium">Tips Mengelola Anggaran</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full savings-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingDown className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Catat setiap pengeluaran</p>
                <p className="text-xs text-muted-foreground">Rekam setiap transaksi untuk memahami pola pengeluaran Anda</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full income-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Tetapkan target realistis</p>
                <p className="text-xs text-muted-foreground">Buat target anggaran yang dapat dicapai berdasarkan pendapatan Anda</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BudgetView;