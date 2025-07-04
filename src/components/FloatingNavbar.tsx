import { Home, Plus, PieChart, Calendar, Settings } from 'lucide-react';
import { useState } from 'react';

interface FloatingNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const FloatingNavbar = ({ activeTab, onTabChange }: FloatingNavbarProps) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'budget', icon: PieChart, label: 'Budget' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleAddClick = () => {
    setIsAddMenuOpen(!isAddMenuOpen);
  };

  // Only show navbar on main pages
  const showNavbar = !['add-income', 'add-expense'].includes(activeTab);

  if (!showNavbar) return null;

  return (
    <>
      {/* Add Menu Overlay */}
      {isAddMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in-0 duration-200" 
          onClick={() => setIsAddMenuOpen(false)}
        >
          <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white rounded-3xl p-6 space-y-4 w-80 shadow-2xl border border-gray-100">
              {/* Add Income Button */}
              <button
                onClick={() => {
                  onTabChange('add-income');
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center space-x-4 w-full p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-bold text-base">Add Income</span>
                  <p className="text-white/80 text-sm mt-0.5">Record your earnings</p>
                </div>
              </button>

              {/* Add Expense Button */}
              <button
                onClick={() => {
                  onTabChange('add-expense');
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center space-x-4 w-full p-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-bold text-base">Add Expense</span>
                  <p className="text-white/80 text-sm mt-0.5">Track your spending</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-6 right-6 z-50">
        <div className="max-w-sm mx-auto">
          {/* Navigation Container */}
          <div className="bg-gray-900 rounded-full px-4 py-3 shadow-2xl">
            <div className="flex items-center justify-between relative">
              {/* Navigation Items */}
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`relative flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-white text-gray-900' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <span className="text-sm font-semibold">{item.label}</span>
                    )}
                  </button>
                );
              })}

              {/* Add Button */}
              <button
                onClick={handleAddClick}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 -translate-y-1 border-4 border-gray-900"
              >
                <Plus className={`w-7 h-7 text-white transition-transform duration-200 ${isAddMenuOpen ? 'rotate-45' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingNavbar;