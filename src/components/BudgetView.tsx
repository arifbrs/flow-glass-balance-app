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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header - Consistent with Dashboard */}
      <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Budget</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 pb-32 space-y-6">
        {/* Budget Setting - Better spacing and layout */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-gray-900 dark:text-white">Monthly Budget</span>
              </div>
              {!isEditingBudget && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSetBudget}
                  className="rounded-full h-10 w-10 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  {monthlyBudget > 0 ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
              )}
            </div>

            {isEditingBudget ? (
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Rp
                    </span>
                    <Input
                      type="text"
                      value={displayBudget}
                      onChange={(e) => handleBudgetInputChange(e.target.value)}
                      placeholder="Enter budget amount"
                      className="pl-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white h-12"
                    />
                  </div>
                  <Button
                    onClick={handleBudgetSave}
                    size="sm"
                    className="rounded-xl h-12 px-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleBudgetCancel}
                    variant="ghost"
                    size="sm"
                    className="rounded-xl h-12 px-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                {monthlyBudget > 0 ? (
                  <>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      Rp{formatCurrency(monthlyBudget)}
                    </p>
                    <p className={`text-sm font-semibold ${budgetRemaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      Rp{formatCurrency(Math.abs(budgetRemaining))} {budgetRemaining >= 0 ? 'remaining' : 'over budget'}
                    </p>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">No budget set</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Tap + to set your monthly budget
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Budget Progress - Better visual design */}
        {monthlyBudget > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900 dark:text-white">Budget Progress</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Spent: <span className="font-semibold text-red-600 dark:text-red-400">Rp{formatCurrency(totalExpenses)}</span></span>
                  <span className="text-gray-600 dark:text-gray-400">Budget: <span className="font-semibold text-blue-600 dark:text-blue-400">Rp{formatCurrency(monthlyBudget)}</span></span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      budgetUsedPercentage > 100 
                        ? 'bg-red-600 dark:bg-red-500' 
                        : budgetUsedPercentage > 80 
                          ? 'bg-yellow-500 dark:bg-yellow-400' 
                          : 'bg-green-600 dark:bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="text-center">
                  <p className={`text-2xl font-bold ${
                    budgetUsedPercentage > 100 
                      ? 'text-red-600 dark:text-red-400' 
                      : budgetUsedPercentage > 80 
                        ? 'text-yellow-500 dark:text-yellow-400' 
                        : 'text-green-600 dark:text-green-400'
                  }`}>
                    {budgetUsedPercentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">of budget used</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown - Better spacing */}
        {sortedCategories.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900 dark:text-white">Top Spending Categories</h3>
              
              <div className="space-y-5">
                {sortedCategories.map(([category, amount]) => {
                  const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  
                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{category}</span>
                        <span className="text-sm text-red-600 dark:text-red-400 font-bold">Rp{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-red-600 dark:bg-red-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
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