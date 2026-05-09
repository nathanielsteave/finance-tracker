import { useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/GlassCard';
import { ProgressRing } from '../components/ProgressRing';

export const Debts = () => {
    const { debts, loadData, loading } = useFinanceStore();
    useEffect(() => {
        const init = async () => {
            await loadData();
        };
        init();
    }, [loadData]);
    if (loading) return null;

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Debts</h1>
            <div className="grid gap-4">
                {debts.map(d => {
                    const paidPct = ((d.totalBalance - d.currentBalance) / d.totalBalance) * 100 || 10;
                    return (
                        <GlassCard key={d.id} className="flex items-center gap-4 p-4">
                            <ProgressRing progress={paidPct} size={60} color="var(--accent)" label={`${Math.round(paidPct)}%`} />
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{d.name}</h3>
                                <p className="text-sm text-gray-300">{d.type} • {d.interestRate}% APR</p>
                                <p className="text-xs text-gray-400">Min: ${d.minPayment}/mo • Due: {d.dueDate}</p>
                            </div>
                            <p className="font-bold text-danger">${(d.currentBalance || d.totalBalance).toLocaleString()}</p>
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
};