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

  // Only show navbar on main pages, not on form pages
  const showNavbar = !['add-income', 'add-expense'].includes(activeTab);

  if (!showNavbar) return null;

  return (
    <>
      {/* Add Menu Overlay with bottom-to-top animation */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsAddMenuOpen(false)}>
          <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 animate-slide-up-from-bottom">
            <div className="glass-floating rounded-3xl p-3 space-y-2 min-w-[220px]">
              <button
                onClick={() => {
                  onTabChange('add-income');
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center space-x-4 w-full p-4 rounded-2xl income-gradient text-white font-medium hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-base">Tambah Pemasukan</span>
              </button>
              <button
                onClick={() => {
                  onTabChange('add-expense');
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center space-x-4 w-full p-4 rounded-2xl expense-gradient text-white font-medium hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-base">Tambah Pengeluaran</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-glass-border">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <div key={item.id} className="flex items-center">
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`relative p-3 rounded-2xl transition-all duration-300 flex flex-col items-center space-y-1 min-w-[60px] ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform duration-200`} />
                    <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                    )}
                  </button>
                  
                  {/* Enhanced Add button in the middle */}
                  {index === 1 && (
                    <div className="mx-4">
                      <button
                        onClick={handleAddClick}
                        className="p-4 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-2xl transform hover:scale-110 transition-all duration-300 relative"
                      >
                        <Plus className={`w-6 h-6 transition-transform duration-300 ${isAddMenuOpen ? 'rotate-45' : ''}`} />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-30 animate-pulse"></div>
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