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

  return (
    <>
      {/* Add Menu Overlay */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsAddMenuOpen(false)}>
          <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 animate-slide-up">
            <div className="glass-floating rounded-2xl p-4 space-y-3">
              <button
                onClick={() => {
                  onTabChange('add-income');
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full p-3 rounded-xl income-gradient text-white font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Add Income</span>
              </button>
              <button
                onClick={() => {
                  onTabChange('add-expense');
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full p-3 rounded-xl expense-gradient text-white font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Navbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-floating rounded-2xl px-4 py-3">
          <div className="flex items-center space-x-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <div key={item.id} className="flex items-center">
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`relative p-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary text-primary-foreground glow-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-glow rounded-full"></div>
                    )}
                  </button>
                  
                  {/* Add button in the middle */}
                  {index === 1 && (
                    <button
                      onClick={handleAddClick}
                      className="mx-2 p-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white glow-primary transform hover:scale-105 transition-all duration-200"
                    >
                      <Plus className={`w-6 h-6 transition-transform duration-200 ${isAddMenuOpen ? 'rotate-45' : ''}`} />
                    </button>
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