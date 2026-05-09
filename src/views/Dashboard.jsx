import { useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/GlassCard';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

export const Dashboard = () => {
    const { transactions, loadData, loading } = useFinanceStore();

    // ✅ FIX: Wrap async call properly - do NOT make useEffect async
    useEffect(() => {
        const init = async () => {
            await loadData();
        };
        init();
    }, [loadData]); // ✅ Dependency array included

    // ✅ Show loading state
    if (loading) {
        return (
            <div className="p-4 pb-24 max-w-2xl mx-auto">
                <p className="text-center text-gray-400 animate-pulse mt-20">Loading dashboard...</p>
            </div>
        );
    }

    const income = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
    const balance = income - expense;

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>

            <GlassCard className="flex justify-between items-center p-6 bg-gradient-to-br from-white/10 to-white/5">
                <div>
                    <p className="text-gray-300 text-sm">Net Balance</p>
                    <p className="text-4xl font-bold mt-1">${balance.toLocaleString()}</p>
                </div>
                <Wallet size={48} className="text-accent opacity-80" />
            </GlassCard>

            <div className="grid grid-cols-2 gap-4">
                <GlassCard>
                    <div className="flex items-center gap-2 text-success"><ArrowUpRight size={18} /> Income</div>
                    <p className="text-xl font-bold mt-2">${income.toLocaleString()}</p>
                </GlassCard>
                <GlassCard>
                    <div className="flex items-center gap-2 text-warning"><ArrowDownRight size={18} /> Expenses</div>
                    <p className="text-xl font-bold mt-2">${expense.toLocaleString()}</p>
                </GlassCard>
            </div>

            <GlassCard>
                <h3 className="font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {transactions.slice(-5).reverse().map(t => (
                        <div key={t.id} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                            <div>
                                <p className="font-medium">{t.category}</p>
                                <p className="text-xs text-gray-400">{t.note || 'No note'}</p>
                            </div>
                            <p className={`font-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                            </p>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-4">No transactions yet. Add one to get started!</p>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};