import { useEffect, useMemo } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/GlassCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF2D55', '#5AC8FA'];

export const Insights = () => {
    const { transactions, loadData, loading } = useFinanceStore();

    // ✅ All hooks MUST be called unconditionally, at the top level
    useEffect(() => {
        const init = async () => {
            await loadData();
        };
        init();
    }, [loadData]);

    const categoryData = useMemo(() => {
        if (!transactions?.length) return [];
        const map = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                map[t.category] = (map[t.category] || 0) + t.amount;
            });
        return Object.entries(map)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [transactions]); // ✅ Dependency array included

    // ✅ Early return AFTER all hooks are called
    if (loading) {
        return (
            <div className="p-4 pb-24 max-w-2xl mx-auto">
                <p className="text-center text-gray-400 animate-pulse">Loading insights...</p>
            </div>
        );
    }

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Insights</h1>

            <GlassCard className="p-4 h-64">
                <h3 className="font-medium mb-2">Spending by Category</h3>
                {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(0,0,0,0.8)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {categoryData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-400 h-full flex items-center justify-center">
                        No expense data yet
                    </p>
                )}
            </GlassCard>

            <GlassCard className="p-4">
                <h3 className="font-medium mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-gray-400">Total Expenses</p>
                        <p className="font-bold text-lg">
                            ${transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-gray-400">Savings Rate</p>
                        <p className="font-bold text-lg text-success">
                            {(() => {
                                const income = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
                                const expense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
                                return income > 0 ? `${Math.round((1 - expense / income) * 100)}%` : '—';
                            })()}
                        </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-gray-400">Top Category</p>
                        <p className="font-bold text-lg">{categoryData[0]?.name || '—'}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-gray-400">Avg Daily Spend</p>
                        <p className="font-bold text-lg">
                            ${((transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)) / 30).toFixed(2)}
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};