import { useState } from 'react';
import { Target, Edit2, Check, X, TrendingUp, TrendingDown } from 'lucide-react';
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
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());

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

  const handleBudgetSave = () => {
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      onUpdateBudget(newBudget);
      setIsEditingBudget(false);
    }
  };

  const handleBudgetCancel = () => {
    setBudgetInput(monthlyBudget.toString());
    setIsEditingBudget(false);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text">Monthly Budget</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Budget Setting Card */}
      <Card className="glass p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-accent" />
              <span className="font-medium">Monthly Budget</span>
            </div>
            {!isEditingBudget && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingBudget(true)}
                className="p-2"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {isEditingBudget ? (
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Enter budget amount"
                  className="glass"
                  step="0.01"
                />
                <Button
                  onClick={handleBudgetSave}
                  size="sm"
                  className="px-3 bg-primary hover:bg-primary/90"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleBudgetCancel}
                  variant="ghost"
                  size="sm"
                  className="px-3"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-3xl font-bold text-accent">
                ${monthlyBudget.toFixed(2)}
              </p>
              {monthlyBudget > 0 && (
                <p className={`text-sm ${budgetRemaining >= 0 ? 'text-income' : 'text-expense'}`}>
                  ${Math.abs(budgetRemaining).toFixed(2)} {budgetRemaining >= 0 ? 'remaining' : 'over budget'}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Budget Progress */}
      {monthlyBudget > 0 && (
        <Card className="glass p-6">
          <div className="space-y-4">
            <h3 className="font-medium">Budget Progress</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Spent: ${totalExpenses.toFixed(2)}</span>
                <span>Budget: ${monthlyBudget.toFixed(2)}</span>
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
                <p className="text-xs text-muted-foreground">of budget used</p>
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
                    {budgetUsedPercentage > 100 ? 'Budget Exceeded!' : 'Budget Warning!'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {budgetUsedPercentage > 100 
                    ? 'You have exceeded your monthly budget.'
                    : 'You are close to exceeding your monthly budget.'
                  }
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Category Breakdown */}
      {sortedCategories.length > 0 && (
        <Card className="glass p-6">
          <div className="space-y-4">
            <h3 className="font-medium">Top Spending Categories</h3>
            
            <div className="space-y-3">
              {sortedCategories.map(([category, amount]) => {
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-expense">${amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className="h-2 rounded-full expense-gradient transition-all duration-300"
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
        </Card>
      )}

      {/* Budget Tips */}
      <Card className="glass p-6">
        <div className="space-y-4">
          <h3 className="font-medium">Budget Tips</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full savings-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingDown className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Track daily expenses</p>
                <p className="text-xs text-muted-foreground">Record every transaction to stay aware of your spending habits</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full income-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Set realistic goals</p>
                <p className="text-xs text-muted-foreground">Create achievable budget targets based on your income</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BudgetView;