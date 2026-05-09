import { useEffect, useMemo } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/GlassCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const mockHistory = Array.from({ length: 7 }, (_, i) => ({ 
  day: `D${i+1}`, 
  value: 100 + Math.random() * 50 
}));

export const Investments = ({ locale }) => {
  const { investments, loadData, loading } = useFinanceStore();
  
  useEffect(() => {
    const init = async () => { await loadData(); };
    init();
  }, [loadData]);

  const totalPortfolioValue = useMemo(() => {
    if (!investments?.length) return 0;
    return investments.reduce((acc, inv) => acc + (inv.quantity * inv.currentPrice), 0);
  }, [investments]);

  const totalGain = useMemo(() => {
    if (!investments?.length) return 0;
    return investments.reduce((acc, inv) => {
      return acc + ((inv.currentPrice - inv.avgBuyPrice) * inv.quantity);
    }, 0);
  }, [investments]);

  const gainPct = totalPortfolioValue > 0 
    ? (totalGain / (totalPortfolioValue - totalGain)) * 100 
    : 0;

  if (loading) {
    return (
      <div className="p-4 pb-safe max-w-2xl mx-auto flex items-center justify-center min-h-[70dvh]">
        <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-4 pb-safe max-w-2xl mx-auto space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{locale?.t?.('investments') || 'Investments'}</h1>
      </div>
      
      <GlassCard className="p-5" animate delay={0.05}>
        <p className="text-gray-300 text-sm font-medium">{locale?.t?.('portfolioValue') || 'Portfolio Value'}</p>
        <p className="text-3xl font-bold mt-1 tracking-tight">
          {locale?.formatMoney?.(totalPortfolioValue) || `$${totalPortfolioValue.toFixed(2)}`}
        </p>
        <div className={`flex items-center gap-2 mt-2 text-sm font-medium ${totalGain >= 0 ? 'text-success' : 'text-danger'}`}>
          {totalGain >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          <span>
            {totalGain >= 0 ? '+' : ''}{locale?.formatMoney?.(Math.abs(totalGain)) || `$${Math.abs(totalGain).toFixed(2)}`} 
            ({gainPct >= 0 ? '+' : ''}{gainPct.toFixed(1)}%)
          </span>
        </div>
        
        <div className="h-32 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockHistory}>
              <defs>
                <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007AFF" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(0,0,0,0.9)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '12px',
                  fontSize: '12px',
                  padding: '8px 12px'
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

      <div className="space-y-2">
        <h2 className="text-lg font-semibold px-1">{locale?.t?.('assets') || 'Assets'}</h2>
        {investments.map((inv, i) => {
          const gain = (inv.currentPrice - inv.avgBuyPrice) * inv.quantity;
          const gainPctItem = ((inv.currentPrice - inv.avgBuyPrice) / inv.avgBuyPrice) * 100;
          
          return (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (i * 0.04) }}
            >
              <GlassCard className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base">{inv.symbol}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                        {inv.assetClass}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {inv.quantity} × {locale?.formatMoney?.(inv.currentPrice) || `$${inv.currentPrice.toFixed(2)}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Avg: {locale?.formatMoney?.(inv.avgBuyPrice) || `$${inv.avgBuyPrice.toFixed(2)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-base ${gain >= 0 ? 'text-success' : 'text-danger'}`}>
                      {gain >= 0 ? '+' : ''}{locale?.formatMoney?.(gain) || `$${gain.toFixed(2)}`}
                    </p>
                    <p className={`text-xs mt-0.5 ${gainPctItem >= 0 ? 'text-success' : 'text-danger'}`}>
                      ({gainPctItem >= 0 ? '+' : ''}{gainPctItem.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
        
        {investments.length === 0 && (
          <GlassCard className="p-8 text-center">
            <p className="text-gray-400 mb-3">{locale?.t?.('noInvestments') || 'No investments yet'}</p>
            <p className="text-xs text-gray-500">Tambahkan data via database atau fitur import</p>
          </GlassCard>
        )}
      </div>
    </motion.div>
  );
};