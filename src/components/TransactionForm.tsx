import { useState } from 'react';
import { X, DollarSign, Tag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TransactionFormProps {
  type: 'income' | 'expense';
  onClose: () => void;
  onSubmit: (transaction: {
    amount: number;
    category: string;
    description: string;
    date: string;
    type: 'income' | 'expense';
  }) => void;
}

const TransactionForm = ({ type, onClose, onSubmit }: TransactionFormProps) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'];
  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];
  
  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSubmit({
      amount: parseFloat(amount),
      category,
      description,
      date,
      type
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card/95 backdrop-blur-lg rounded-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${type === 'income' ? 'text-income' : 'text-expense'}`}>
            Add {type === 'income' ? 'Income' : 'Expense'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="pl-10 glass text-lg"
                step="1000"
                required
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                    category === cat
                      ? type === 'income'
                        ? 'income-gradient text-white border-income'
                        : 'expense-gradient text-white border-expense'
                      : 'glass border-glass-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Tag className="w-4 h-4 mx-auto mb-1" />
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 glass"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note about this transaction..."
              className="glass resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full py-3 text-lg font-semibold ${
              type === 'income' 
                ? 'income-gradient hover:opacity-90' 
                : 'expense-gradient hover:opacity-90'
            }`}
            disabled={!amount || !category}
          >
            Add {type === 'income' ? 'Income' : 'Expense'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;