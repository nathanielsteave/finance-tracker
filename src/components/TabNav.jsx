import { NavLink, useLocation } from 'react-router-dom';
import { Home, List, Target, CreditCard, TrendingUp, PieChart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const TabNav = ({ locale }) => {
  const location = useLocation();

  const tabs = [
    { path: '/', icon: Home, label: locale?.t?.('dashboard') || 'Dashboard' },
    { path: '/transactions', icon: List, label: locale?.t?.('transactions') || 'Transaksi' },
    { path: '/budgets', icon: Target, label: locale?.t?.('budgets') || 'Budget' },
    { path: '/debts', icon: CreditCard, label: locale?.t?.('debts') || 'Hutang' },
    { path: '/investments', icon: TrendingUp, label: locale?.t?.('investments') || 'Investasi' },
    { path: '/insights', icon: PieChart, label: locale?.t?.('insights') || 'Insight' },
    { path: '/settings', icon: Settings, label: locale?.t?.('settings') || 'Pengaturan' }
  ];

  return (
    <nav 
      className="fixed left-0 right-0 bottom-0 z-[9999] glass rounded-t-2xl border-t border-white/20 backdrop-blur-xl"
      style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999
      }}
    >
      <div className="flex justify-around items-center max-w-2xl mx-auto px-2 py-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className="relative flex flex-col items-center justify-center w-full py-1"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-accent/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={`relative z-10 flex flex-col items-center gap-1 ${
                  isActive ? 'text-accent' : 'text-gray-400'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium leading-none text-center">
                  {label}
                </span>
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};