import { useState } from 'react';
import { Target, Edit2, Check, X, Plus, MoreHorizontal, ArrowLeft } from 'lucide-react';
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatCurrencyInput = (value: string) => {
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('en-US').format(parseInt(number) || 0);
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
    setDisplayBudget(formatCurrencyInput(monthlyBudget.toString()));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 rounded-full w-9 h-9">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Budget</h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 rounded-full w-9 h-9">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Budget Setting Card */}
        <div className="bg-white rounded-3xl p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900">Monthly Budget</span>
              </div>
              {!isEditingBudget && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSetBudget}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 p-0"
                >
                  {monthlyBudget > 0 ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
              )}
            </div>

            {isEditingBudget ? (
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                      $
                    </span>
                    <Input
                      type="text"
                      value={displayBudget}
                      onChange={(e) => handleBudgetInputChange(e.target.value)}
                      placeholder="Enter budget amount"
                      className="pl-12 rounded-xl border-gray-200 bg-white text-gray-900 h-12 focus:border-blue-500 focus:ring-blue-500/20"
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
                    className="rounded-xl h-12 px-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                {monthlyBudget > 0 ? (
                  <>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(monthlyBudget)}
                    </p>
                    <p className={`text-sm font-semibold ${budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(budgetRemaining))} {budgetRemaining >= 0 ? 'remaining' : 'over budget'}
                    </p>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="font-semibold text-gray-900">No budget set</p>
                    <p className="text-sm text-gray-500 mt-2">
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
          <div className="bg-white rounded-3xl p-6">
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900">Budget Progress</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent: <span className="font-semibold text-red-600">{formatCurrency(totalExpenses)}</span></span>
                  <span className="text-gray-600">Budget: <span className="font-semibold text-blue-600">{formatCurrency(monthlyBudget)}</span></span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      budgetUsedPercentage > 100 
                        ? 'bg-red-500' 
                        : budgetUsedPercentage > 80 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="text-center">
                  <p className={`text-2xl font-bold ${
                    budgetUsedPercentage > 100 
                      ? 'text-red-600' 
                      : budgetUsedPercentage > 80 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                  }`}>
                    {budgetUsedPercentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">of budget used</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {sortedCategories.length > 0 && (
          <div className="bg-white rounded-3xl p-6">
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900">Top Spending Categories</h3>
              
              <div className="space-y-4">
                {sortedCategories.map(([category, amount]) => {
                  const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  
                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-900">{category}</span>
                        <span className="text-sm text-red-600 font-bold">{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-red-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
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

      {/* Bottom spacing */}
      <div className="h-24"></div>
    </div>
  );
};

export default BudgetView;