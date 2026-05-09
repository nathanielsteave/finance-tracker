import { NavLink } from 'react-router-dom';
import { Home, List, Target, CreditCard, TrendingUp, PieChart, Settings } from 'lucide-react';

const tabs = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/transactions', icon: List, label: 'Transactions' },
    { path: '/budgets', icon: Target, label: 'Budgets' },
    { path: '/debts', icon: CreditCard, label: 'Debts' },
    { path: '/investments', icon: TrendingUp, label: 'Investments' },
    { path: '/insights', icon: PieChart, label: 'Insights' },
    { path: '/settings', icon: Settings, label: 'Settings' }
];

export const TabNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/20 backdrop-blur-xl z-50 px-2 py-2">
        <div className="flex justify-around max-w-2xl mx-auto">
            {tabs.map(({ path, icon: Icon, label }) => (
                <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                        `flex flex-col items-center p-2 rounded-xl transition-colors ${isActive ? 'text-accent' : 'text-gray-400 hover:text-white'}`
                    }
                >
                    <Icon size={20} />
                    <span className="text-[10px] mt-1 font-medium">{label}</span>
                </NavLink>
            ))}
        </div>
    </nav>
);