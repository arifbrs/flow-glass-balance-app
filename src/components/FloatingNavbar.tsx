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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" 
          onClick={() => setIsAddMenuOpen(false)}
        >
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 slide-up">
            <div className="bg-card border border-border rounded-2xl p-3 space-y-2 min-w-[200px] threads-shadow">
              <button
                onClick={() => {
                  onTabChange('add-income');
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full p-3 rounded-xl bg-green-50 dark:bg-green-950 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="font-medium">Add Income</span>
              </button>
              <button
                onClick={() => {
                  onTabChange('add-expense');
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full p-3 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="font-medium">Add Expense</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Threads Style */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <div key={item.id} className="flex items-center">
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`relative p-3 rounded-xl transition-all duration-200 flex flex-col items-center space-y-1 min-w-[50px] ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform duration-200`} />
                    <span className="text-xs font-medium">
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                    )}
                  </button>
                  
                  {/* Add button */}
                  {index === 1 && (
                    <div className="mx-3">
                      <button
                        onClick={handleAddClick}
                        className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                      >
                        <Plus className={`w-5 h-5 transition-transform duration-200 ${isAddMenuOpen ? 'rotate-45' : ''}`} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingNavbar;