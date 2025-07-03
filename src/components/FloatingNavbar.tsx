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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in-0 duration-200" 
          onClick={() => setIsAddMenuOpen(false)}
        >
          <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-5 space-y-4 w-64 shadow-2xl">
              {/* Add Income Button */}
              <button
                onClick={() => {
                  onTabChange('add-income');
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center space-x-4 w-full p-4 rounded-2xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 text-green-700 dark:text-green-300 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900 dark:hover:to-green-800 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-green-200/50 dark:border-green-800/50"
              >
                <div className="w-12 h-12 rounded-2xl bg-green-500 dark:bg-green-600 flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-bold text-base">Add Income</span>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Record your earnings</p>
                </div>
              </button>

              {/* Add Expense Button */}
              <button
                onClick={() => {
                  onTabChange('add-expense');
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center space-x-4 w-full p-4 rounded-2xl bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 text-red-700 dark:text-red-300 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900 dark:hover:to-red-800 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-red-200/50 dark:border-red-800/50"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500 dark:bg-red-600 flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-bold text-base">Add Expense</span>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">Track your spending</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Tab Bar Style like the image */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-sm mx-auto">
          {/* Navigation Container - Dark rounded bar */}
          <div className="bg-gray-900 dark:bg-black rounded-full px-4 py-3 shadow-2xl">
            <div className="flex items-center justify-between relative">
              {/* Navigation Items */}
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-white text-gray-900' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </button>
                );
              })}

              {/* Add Button - Blue circle in center */}
              <button
                onClick={handleAddClick}
                className="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 text-white shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2"
              >
                <Plus className={`w-6 h-6 text-white transition-transform duration-200 ${isAddMenuOpen ? 'rotate-45' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingNavbar;