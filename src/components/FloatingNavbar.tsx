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
            <div className="glass-floating rounded-3xl p-4 space-y-3 min-w-[200px]">
              <button
                onClick={() => {
                  onTabChange('add-income');
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center space-x-4 w-full p-4 rounded-2xl income-gradient text-white font-medium hover:scale-105 transition-transform duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span>Tambah Pemasukan</span>
              </button>
              <button
                onClick={() => {
                  onTabChange('add-expense');
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center space-x-4 w-full p-4 rounded-2xl expense-gradient text-white font-medium hover:scale-105 transition-transform duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span>Tambah Pengeluaran</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Floating Navbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-floating rounded-3xl px-2 py-2">
          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <div key={item.id} className="flex items-center">
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`relative p-4 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary text-primary-foreground glow-primary scale-110' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:scale-105'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-glow rounded-full animate-pulse"></div>
                    )}
                  </button>
                  
                  {/* Enhanced Add button in the middle */}
                  {index === 1 && (
                    <button
                      onClick={handleAddClick}
                      className="mx-3 p-5 rounded-3xl bg-gradient-to-r from-primary to-accent text-white glow-primary transform hover:scale-110 transition-all duration-300 shadow-2xl"
                    >
                      <Plus className={`w-7 h-7 transition-transform duration-300 ${isAddMenuOpen ? 'rotate-45' : ''}`} />
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