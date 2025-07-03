import { useState, useEffect } from 'react';
import FloatingNavbar from '@/components/FloatingNavbar';
import Dashboard from '@/components/Dashboard';
import BudgetView from '@/components/BudgetView';
import TransactionForm from '@/components/TransactionForm';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(2000); // Default budget
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-tracker-transactions');
    const savedBudget = localStorage.getItem('budget-tracker-budget');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    if (savedBudget) {
      setMonthlyBudget(parseFloat(savedBudget));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('budget-tracker-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budget-tracker-budget', monthlyBudget.toString());
  }, [monthlyBudget]);

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    toast({
      title: "Transaction Added",
      description: `${transactionData.type === 'income' ? 'Income' : 'Expense'} of $${transactionData.amount} added successfully`,
    });

    setActiveTab('home');
  };

  const handleUpdateBudget = (budget: number) => {
    setMonthlyBudget(budget);
    toast({
      title: "Budget Updated",
      description: `Monthly budget set to $${budget.toFixed(2)}`,
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard transactions={transactions} monthlyBudget={monthlyBudget} />;
      case 'budget':
        return (
          <BudgetView 
            transactions={transactions} 
            monthlyBudget={monthlyBudget}
            onUpdateBudget={handleUpdateBudget}
          />
        );
      case 'add-income':
        return (
          <TransactionForm
            type="income"
            onClose={() => setActiveTab('home')}
            onSubmit={handleAddTransaction}
          />
        );
      case 'add-expense':
        return (
          <TransactionForm
            type="expense"
            onClose={() => setActiveTab('home')}
            onSubmit={handleAddTransaction}
          />
        );
      case 'calendar':
        return (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">Calendar View</p>
              <p className="text-sm">Coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">Settings</p>
              <p className="text-sm">Coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard transactions={transactions} monthlyBudget={monthlyBudget} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-4">
        {renderContent()}
        
        <FloatingNavbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default Index;
