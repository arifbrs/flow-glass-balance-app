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
  const [monthlyBudget, setMonthlyBudget] = useState(0); // Start with no budget
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
      title: "Transaksi Berhasil Ditambahkan! 🎉",
      description: `${transactionData.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} sebesar Rp${new Intl.NumberFormat('id-ID').format(transactionData.amount)} berhasil disimpan`,
    });

    setActiveTab('home');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transaksi Dihapus",
      description: "Transaksi berhasil dihapus dari catatan",
    });
  };

  const handleUpdateBudget = (budget: number) => {
    setMonthlyBudget(budget);
    toast({
      title: "Anggaran Berhasil Diperbarui! 💰", 
      description: `Anggaran bulanan diatur ke Rp${new Intl.NumberFormat('id-ID').format(budget)}`,
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Dashboard 
            transactions={transactions} 
            monthlyBudget={monthlyBudget}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
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
              <p className="text-lg font-medium">Kalender Transaksi</p>
              <p className="text-sm">Segera hadir...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">Pengaturan</p>
              <p className="text-sm">Segera hadir...</p>
            </div>
          </div>
        );
      default:
        return (
          <Dashboard 
            transactions={transactions} 
            monthlyBudget={monthlyBudget}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
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