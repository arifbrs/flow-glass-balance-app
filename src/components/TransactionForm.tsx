import { useState } from 'react';
import { X, Calendar, User, DollarSign } from 'lucide-react';
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

  const incomeCategories = ['Gaji', 'Freelance', 'Investasi', 'Bisnis', 'Hadiah', 'Lainnya'];
  const expenseCategories = ['Makanan', 'Transport', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan', 'Lainnya'];
  
  const categories = type === 'income' ? incomeCategories : expenseCategories;

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

  if (type === 'income') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card/95 backdrop-blur-lg rounded-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-income">Tambah Pemasukan</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Nama Pemasukan</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Gaji bulanan, Bonus, dll"
                  className="pl-10 glass text-base h-12"
                />
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">Jumlah Pemasukan</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
                <Input
                  id="amount"
                  type="text"
                  value={displayAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0"
                  className="pl-10 glass text-lg h-14 font-bold"
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tanggal Pemasukan</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal glass h-12"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, 'dd MMMM yyyy', { locale: id }) : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 glass border-glass-border" align="start">
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
                    className="rounded-2xl"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Kategori</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                      category === cat
                        ? 'income-gradient text-white border-income'
                        : 'glass border-glass-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-4 text-lg font-semibold income-gradient hover:opacity-90 h-14"
              disabled={!amount || !category}
            >
              Tambah Pemasukan
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Expense Form with Calculator
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card/95 backdrop-blur-lg rounded-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-expense">Tambah Pengeluaran</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Display */}
          <div className="text-center space-y-2">
            <Label className="text-sm font-medium">Jumlah Pengeluaran</Label>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-expense">
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
                className="h-14 rounded-xl glass hover:bg-muted/20 transition-colors font-semibold text-lg"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNumberPad('clear')}
              className="h-14 rounded-xl glass hover:bg-muted/20 transition-colors font-semibold text-sm"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleNumberPad('0')}
              className="h-14 rounded-xl glass hover:bg-muted/20 transition-colors font-semibold text-lg"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => handleNumberPad('backspace')}
              className="h-14 rounded-xl glass hover:bg-muted/20 transition-colors font-semibold text-sm"
            >
              ⌫
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="expense-description" className="text-sm font-medium">Keterangan Pengeluaran</Label>
            <Textarea
              id="expense-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Makan siang, Bensin, Belanja bulanan..."
              className="glass resize-none h-20"
              rows={3}
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Kategori</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                    category === cat
                      ? 'expense-gradient text-white border-expense'
                      : 'glass border-glass-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tanggal Pengeluaran</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal glass h-12"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd MMMM yyyy', { locale: id }) : 'Pilih tanggal'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass border-glass-border" align="start">
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
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-4 text-lg font-semibold expense-gradient hover:opacity-90 h-14"
            disabled={!amount || !category}
          >
            Tambah Pengeluaran
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;