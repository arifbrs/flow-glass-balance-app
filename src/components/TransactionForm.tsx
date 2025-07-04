import { useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {type === 'income' ? 'Add Income' : 'Add Expense'}
          </h1>
          <div className="w-9"></div>
        </div>
      </div>

      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'income' ? (
            <>
              {/* Income Form */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-3 block">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Monthly salary, Freelance work"
                    className="border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 rounded-xl h-12 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="bg-white rounded-3xl p-6">
                  <Label htmlFor="amount" className="text-sm font-semibold text-gray-700 mb-3 block">
                    Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      $
                    </span>
                    <Input
                      id="amount"
                      type="text"
                      value={displayAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0"
                      className="pl-12 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 rounded-xl text-lg font-semibold h-14 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6">
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">Date</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100 rounded-xl h-12"
                      >
                        <Calendar className="mr-3 h-4 w-4" />
                        {date ? format(date, 'dd MMMM yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-gray-200 rounded-xl" align="start">
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

                <div className="bg-white rounded-3xl p-6">
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700 mb-3 block">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Salary, Freelance, Investment"
                    className="border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 rounded-xl h-12 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Expense Form with Calculator */}
              <div className="bg-white rounded-3xl p-6 text-center space-y-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">Amount</Label>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="text-4xl font-bold text-gray-900">
                      ${displayAmount}
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
                      className="h-12 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors font-semibold text-gray-900"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleNumberPad('0')}
                    className="h-12 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors font-semibold text-gray-900 col-span-2"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNumberPad('backspace')}
                    className="h-12 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors font-semibold text-gray-900"
                  >
                    ⌫
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleNumberPad('clear')}
                  className="w-full h-11 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-sm text-gray-600"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6">
                  <Label htmlFor="expense-description" className="text-sm font-semibold text-gray-700 mb-3 block">
                    Description
                  </Label>
                  <Textarea
                    id="expense-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What did you spend on?"
                    className="border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 rounded-xl resize-none focus:border-blue-500 focus:ring-blue-500/20"
                    rows={3}
                  />
                </div>

                <div className="bg-white rounded-3xl p-6">
                  <Label htmlFor="expense-category" className="text-sm font-semibold text-gray-700 mb-3 block">
                    Category
                  </Label>
                  <Input
                    id="expense-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Food, Transport, Shopping"
                    className="border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 rounded-xl h-12 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="bg-white rounded-3xl p-6">
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">Date</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100 rounded-xl h-12"
                      >
                        <Calendar className="mr-3 h-4 w-4" />
                        {date ? format(date, 'dd MMMM yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-gray-200 rounded-xl" align="start">
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
              className={`w-full py-4 font-bold rounded-2xl text-white h-14 ${
                type === 'income' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
              } transition-all duration-300 hover:scale-[1.02] shadow-lg`}
              disabled={!amount || !category}
            >
              {type === 'income' ? 'Add Income' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </div>

      {/* Bottom spacing */}
      <div className="h-24"></div>
    </div>
  );
};

export default TransactionForm;