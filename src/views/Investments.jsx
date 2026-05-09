import { useEffect, useMemo } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/GlassCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock historical data for chart (replace with real API later)
const mockHistory = Array.from({ length: 7 }, (_, i) => ({
    day: `D${i + 1}`,
    value: 100 + Math.random() * 50
}));

export const Investments = () => {
    const { investments, loadData, loading } = useFinanceStore();

    // ✅ All hooks at top level
    useEffect(() => {
        const init = async () => {
            await loadData();
        };
        init();
    }, [loadData]);

    // ✅ Compute derived values with useMemo (not useState + useEffect)
    const totalPortfolioValue = useMemo(() => {
        if (!investments?.length) return 0;
        return investments.reduce((acc, inv) => {
            return acc + (inv.quantity * inv.currentPrice);
        }, 0);
    }, [investments]);

    const totalGain = useMemo(() => {
        if (!investments?.length) return 0;
        return investments.reduce((acc, inv) => {
            const gain = (inv.currentPrice - inv.avgBuyPrice) * inv.quantity;
            return acc + gain;
        }, 0);
    }, [investments]);

    // ✅ Early return AFTER all hooks
    if (loading) {
        return (
            <div className="p-4 pb-24 max-w-2xl mx-auto">
                <p className="text-center text-gray-400 animate-pulse">Loading portfolio...</p>
            </div>
        );
    }

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Investments</h1>

            {/* Portfolio Summary Card */}
            <GlassCard className="p-4">
                <p className="text-gray-300 text-sm">Portfolio Value</p>
                <p className="text-3xl font-bold mb-1">
                    ${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className={`text-sm font-medium ${totalGain >= 0 ? 'text-success' : 'text-danger'}`}>
                    {totalGain >= 0 ? '▲' : '▼'} ${Math.abs(totalGain).toFixed(2)} all-time
                </p>

                {/* Mini Chart */}
                <div className="h-32 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockHistory}>
                            <defs>
                                <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#007AFF" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="day" hide />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(0,0,0,0.85)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    fontSize: '11px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#007AFF"
                                fill="url(#portfolioGrad)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            {/* Holdings List */}
            <div className="space-y-2">
                {investments.map(inv => {
                    const gain = (inv.currentPrice - inv.avgBuyPrice) * inv.quantity;
                    const gainPct = ((inv.currentPrice - inv.avgBuyPrice) / inv.avgBuyPrice) * 100;

                    return (
                        <GlassCard key={inv.id} className="flex justify-between items-center p-3">
                            <div>
                                <p className="font-bold">{inv.symbol}</p>
                                <p className="text-xs text-gray-400">
                                    {inv.quantity} × ${inv.currentPrice.toFixed(2)} • {inv.assetClass}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${gain >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {gain >= 0 ? '+' : ''}{gain.toFixed(2)}
                                </p>
                                <p className={`text-xs ${gainPct >= 0 ? 'text-success' : 'text-danger'}`}>
                                    ({gainPct >= 0 ? '+' : ''}{gainPct.toFixed(1)}%)
                                </p>
                            </div>
                        </GlassCard>
                    );
                })}

                {investments.length === 0 && (
                    <GlassCard className="p-6 text-center text-gray-400">
                        <p>No investments yet</p>
                        <p className="text-xs mt-1">Add holdings to track your portfolio</p>
                    </GlassCard>
                )}
            </div>
        </div>
    );
};