import { useState } from 'react';
import { Target, Edit2, Check, X, Plus, MoreHorizontal } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Budget</h1>
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
        {/* Budget Setting */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-medium">Monthly Budget</span>
              </div>
              {!isEditingBudget && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSetBudget}
                  className="rounded-full h-8 w-8 p-0"
                >
                  {monthlyBudget > 0 ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
              )}
            </div>

            {isEditingBudget ? (
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                      Rp
                    </span>
                    <Input
                      type="text"
                      value={displayBudget}
                      onChange={(e) => handleBudgetInputChange(e.target.value)}
                      placeholder="Enter budget amount"
                      className="pl-10 rounded-xl border-border"
                    />
                  </div>
                  <Button
                    onClick={handleBudgetSave}
                    size="sm"
                    className="rounded-xl"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleBudgetCancel}
                    variant="ghost"
                    size="sm"
                    className="rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                {monthlyBudget > 0 ? (
                  <>
                    <p className="text-2xl font-bold text-primary">
                      Rp{formatCurrency(monthlyBudget)}
                    </p>
                    <p className={`text-sm font-medium ${budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Rp{formatCurrency(Math.abs(budgetRemaining))} {budgetRemaining >= 0 ? 'remaining' : 'over budget'}
                    </p>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-muted-foreground">No budget set</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tap + to set your monthly budget
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Budget Progress */}
        {monthlyBudget > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="space-y-4">
              <h3 className="font-medium">Budget Progress</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Spent: Rp{formatCurrency(totalExpenses)}</span>
                  <span>Budget: Rp{formatCurrency(monthlyBudget)}</span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      budgetUsedPercentage > 100 
                        ? 'bg-red-600' 
                        : budgetUsedPercentage > 80 
                          ? 'bg-yellow-500' 
                          : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="text-center">
                  <p className={`text-xl font-bold ${
                    budgetUsedPercentage > 100 
                      ? 'text-red-600' 
                      : budgetUsedPercentage > 80 
                        ? 'text-yellow-500' 
                        : 'text-green-600'
                  }`}>
                    {budgetUsedPercentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">of budget used</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {sortedCategories.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="space-y-4">
              <h3 className="font-medium">Top Spending Categories</h3>
              
              <div className="space-y-4">
                {sortedCategories.map(([category, amount]) => {
                  const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm text-red-600 font-semibold">Rp{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-red-600 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {percentage.toFixed(1)}% of total expenses
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetView;