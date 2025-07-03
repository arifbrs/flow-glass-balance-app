import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
}

const Dashboard = ({ transactions, monthlyBudget }: DashboardProps) => {
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

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text">Budget Tracker</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Balance Card */}
      <Card className="glass p-6 text-center">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">Current Balance</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
            ${balance.toFixed(2)}
          </p>
          <div className="flex items-center justify-center space-x-1">
            {balance >= 0 ? (
              <TrendingUp className="w-4 h-4 text-income" />
            ) : (
              <TrendingDown className="w-4 h-4 text-expense" />
            )}
            <span className={`text-sm ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
              {balance >= 0 ? 'Positive' : 'Negative'} balance
            </span>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl income-gradient flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Income</p>
              <p className="font-semibold text-income">${totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl expense-gradient flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Expenses</p>
              <p className="font-semibold text-expense">${totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Budget Progress */}
      {monthlyBudget > 0 && (
        <Card className="glass p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-accent" />
                <span className="font-medium">Monthly Budget</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ${budgetRemaining.toFixed(2)} remaining
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: ${totalExpenses.toFixed(2)}</span>
                <span>Budget: ${monthlyBudget.toFixed(2)}</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    budgetUsedPercentage > 100 
                      ? 'expense-gradient' 
                      : budgetUsedPercentage > 80 
                        ? 'bg-yellow-500' 
                        : 'savings-gradient'
                  }`}
                  style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                ></div>
              </div>
              <p className={`text-xs text-center ${
                budgetUsedPercentage > 100 
                  ? 'text-expense' 
                  : budgetUsedPercentage > 80 
                    ? 'text-yellow-500' 
                    : 'text-savings'
              }`}>
                {budgetUsedPercentage.toFixed(1)}% of budget used
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="glass p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-accent" />
            <span className="font-medium">Recent Transactions</span>
          </div>
          
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-xl glass">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{transaction.category}</span>
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-income' : 'text-expense'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                    {transaction.description && (
                      <p className="text-xs text-muted-foreground mt-1">{transaction.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Start by adding your first transaction</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;