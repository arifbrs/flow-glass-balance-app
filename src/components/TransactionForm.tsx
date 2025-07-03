import { useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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
  const [date, setDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [displayAmount, setDisplayAmount] = useState('0');

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(parseInt(number) || 0);
  };

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setAmount(numericValue);
    setDisplayAmount(formatCurrency(numericValue));
  };

  const handleNumberPad = (num: string) => {
    if (num === 'clear') {
      setAmount('');
      setDisplayAmount('0');
    } else if (num === 'backspace') {
      const newAmount = amount.slice(0, -1);
      setAmount(newAmount);
      setDisplayAmount(formatCurrency(newAmount));
    } else {
      const newAmount = amount + num;
      setAmount(newAmount);
      setDisplayAmount(formatCurrency(newAmount));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSubmit({
      amount: parseFloat(amount),
      category,
      description,
      date: date.toISOString().split('T')[0],
      type
    });

    onClose();
  };

  return (
    <div className="min-h-screen bg-background threads-text">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">
              {type === 'income' ? 'Add Income' : 'Add Expense'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'income' ? (
            <>
              {/* Income Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Monthly salary, Freelance work"
                    className="threads-input mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="amount" className="text-sm font-medium text-muted-foreground">
                    Amount
                  </Label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      id="amount"
                      type="text"
                      value={displayAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0"
                      className="pl-10 threads-input text-lg font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal threads-input mt-2 border-0"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, 'dd MMMM yyyy', { locale: id }) : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border border-border" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            setDate(selectedDate);
                            setIsCalendarOpen(false);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-muted-foreground">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Salary, Freelance, Investment"
                    className="threads-input mt-2"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Expense Form with Calculator */}
              <div className="text-center space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                  <div className="threads-card mt-2 p-6">
                    <div className="text-2xl font-bold text-red-600">
                      Rp{displayAmount}
                    </div>
                  </div>
                </div>

                {/* Number Pad */}
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleNumberPad(num.toString())}
                      className="h-12 rounded-xl bg-muted hover:bg-muted/80 transition-colors font-medium"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleNumberPad('0')}
                    className="h-12 rounded-xl bg-muted hover:bg-muted/80 transition-colors font-medium col-span-2"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNumberPad('backspace')}
                    className="h-12 rounded-xl bg-muted hover:bg-muted/80 transition-colors font-medium"
                  >
                    ⌫
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleNumberPad('clear')}
                  className="w-full h-10 rounded-xl bg-muted hover:bg-muted/80 transition-colors font-medium text-sm"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="expense-description" className="text-sm font-medium text-muted-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="expense-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What did you spend on?"
                    className="threads-input mt-2 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="expense-category" className="text-sm font-medium text-muted-foreground">
                    Category
                  </Label>
                  <Input
                    id="expense-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Food, Transport, Shopping"
                    className="threads-input mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal threads-input mt-2 border-0"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, 'dd MMMM yyyy', { locale: id }) : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border border-border" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            setDate(selectedDate);
                            setIsCalendarOpen(false);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className={`w-full py-3 font-semibold rounded-full ${
                type === 'income' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              disabled={!amount || !category}
            >
              {type === 'income' ? 'Add Income' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;