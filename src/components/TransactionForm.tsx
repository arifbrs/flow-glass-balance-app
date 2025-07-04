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
    return new Intl.NumberFormat('en-US').format(parseInt(number) || 0);
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
    <div className="min-h-screen bg-black text-white">
      {/* Header - Refined spacing */}
      <div className="flex items-center justify-between px-5 pt-14 pb-6 border-b border-gray-800">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-white">
          {type === 'income' ? 'Add Income' : 'Add Expense'}
        </h1>
        <div className="w-9"></div>
      </div>

      <div className="px-5 pt-6 pb-28">
        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'income' ? (
            <>
              {/* Income Form - Better spacing */}
              <div className="space-y-5">
                <div>
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-300 mb-3 block">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Monthly salary, Freelance work"
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="amount" className="text-sm font-semibold text-gray-300 mb-3 block">
                    Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-base">
                      $
                    </span>
                    <Input
                      id="amount"
                      type="text"
                      value={displayAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0"
                      className="pl-12 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 rounded-xl text-lg font-semibold h-14 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-300 mb-3 block">Date</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-gray-900 border-gray-700 text-white hover:bg-gray-800 rounded-xl h-12 text-base"
                      >
                        <Calendar className="mr-3 h-4 w-4" />
                        {date ? format(date, 'dd MMMM yyyy', { locale: id }) : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700 rounded-xl" align="start">
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
                        className="text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-300 mb-3 block">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Salary, Freelance, Investment"
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Expense Form with Calculator - Better spacing */}
              <div className="text-center space-y-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-300 mb-3 block">Amount</Label>
                  <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                    <div className="text-4xl font-bold text-white">
                      ${displayAmount}
                    </div>
                  </div>
                </div>

                {/* Number Pad - Better spacing */}
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleNumberPad(num.toString())}
                      className="h-12 rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800 transition-colors font-semibold text-white text-base"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleNumberPad('0')}
                    className="h-12 rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800 transition-colors font-semibold text-white col-span-2 text-base"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNumberPad('backspace')}
                    className="h-12 rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800 transition-colors font-semibold text-white text-base"
                  >
                    ⌫
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleNumberPad('clear')}
                  className="w-full h-11 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors font-medium text-sm text-gray-300"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="expense-description" className="text-sm font-semibold text-gray-300 mb-3 block">
                    Description
                  </Label>
                  <Textarea
                    id="expense-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What did you spend on?"
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 rounded-xl resize-none focus:border-blue-500 focus:ring-blue-500/20 text-base"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="expense-category" className="text-sm font-semibold text-gray-300 mb-3 block">
                    Category
                  </Label>
                  <Input
                    id="expense-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Food, Transport, Shopping"
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-300 mb-3 block">Date</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-gray-900 border-gray-700 text-white hover:bg-gray-800 rounded-xl h-12 text-base"
                      >
                        <Calendar className="mr-3 h-4 w-4" />
                        {date ? format(date, 'dd MMMM yyyy', { locale: id }) : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700 rounded-xl" align="start">
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
                        className="text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </>
          )}

          {/* Submit Button - Better proportions */}
          <div className="pt-6">
            <Button
              type="submit"
              className={`w-full py-4 font-bold rounded-2xl text-white h-13 text-base ${
                type === 'income' 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500' 
                  : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500'
              } transition-all duration-300 hover:scale-[1.02]`}
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