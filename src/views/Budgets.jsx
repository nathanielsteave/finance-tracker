import { useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/GlassCard';

export const Budgets = () => {
    const { budgets, loadData, loading } = useFinanceStore();
    useEffect(() => {
        const init = async () => {
            await loadData();
        };
        init();
    }, [loadData]);
    if (loading) return null;

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Budgets</h1>
            <div className="grid gap-3">
                {budgets.map(b => {
                    const pct = Math.min((b.spent / b.limit) * 100, 100);
                    const color = pct > 85 ? 'var(--danger)' : pct > 60 ? 'var(--warning)' : 'var(--success)';
                    return (
                        <GlassCard key={b.id} className="p-4">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">{b.category}</span>
                                <span className="text-sm text-gray-300">${b.spent.toFixed(0)} / ${b.limit}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{b.period}</p>
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
};