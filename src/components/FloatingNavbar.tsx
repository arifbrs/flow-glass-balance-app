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

      {/* Bottom Navigation - NEW DESIGN LIKE THE IMAGE */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-sm mx-auto relative">
          {/* Main Navigation Container */}
          <div className="bg-gray-800 dark:bg-gray-900 rounded-3xl px-6 py-4 shadow-2xl relative overflow-visible">
            <div className="flex items-center justify-between relative">
              {/* Navigation Items */}
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <div key={item.id} className="relative">
                    {/* Active Tab - Green Circle that pops out */}
                    {isActive && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    
                    {/* Regular Tab Button */}
                    <button
                      onClick={() => onTabChange(item.id)}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        isActive 
                          ? 'opacity-0' // Hide the regular button when active
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </button>
                  </div>
                );
              })}

              {/* Add Button - Center position */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
                <button
                  onClick={handleAddClick}
                  className="w-14 h-14 rounded-full bg-blue-600 dark:bg-blue-500 text-white shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                  <Plus className={`w-6 h-6 text-white transition-transform duration-200 ${isAddMenuOpen ? 'rotate-45' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingNavbar;