import { useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/GlassCard';
import { motion } from 'framer-motion';

export const Budgets = ({ locale }) => {
  const { budgets, loadData, loading } = useFinanceStore();
  
  useEffect(() => {
    const init = async () => { await loadData(); };
    init();
  }, [loadData]);

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
      <h1 className="text-2xl font-bold tracking-tight">{locale?.t?.('budgets') || 'Budgets'}</h1>
      
      <div className="grid gap-3">
        {budgets.map((b, i) => {
          const pct = Math.min((b.spent / b.limit) * 100, 100);
          const remaining = b.limit - b.spent;
          const color = pct > 90 ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--success)';
          const statusColor = pct > 90 ? 'text-danger' : pct > 70 ? 'text-warning' : 'text-success';
          
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{b.category}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{b.period}</p>
                  </div>
                  <p className={`font-bold text-lg ${statusColor}`}>
                    {pct.toFixed(0)}%
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + (i * 0.05) }}
                      className="h-full rounded-full"
                      style={{ background: color }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{locale?.t?.('used') || 'Used'}</span>
                    <span className="font-semibold">{locale?.formatMoney?.(b.spent) || `$${b.spent.toFixed(0)}`} / {locale?.formatMoney?.(b.limit) || `$${b.limit}`}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{locale?.t?.('remaining') || 'Remaining'}</span>
                    <span className={`font-medium ${remaining < 0 ? 'text-danger' : 'text-success'}`}>
                      {locale?.formatMoney?.(remaining) || `$${remaining.toFixed(0)}`} {remaining < 0 ? locale?.t?.('over') || '(Over)' : ''}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
        
        {budgets.length === 0 && (
          <GlassCard className="p-8 text-center">
            <p className="text-gray-400">{locale?.t?.('noData') || 'No data available yet'}</p>
          </GlassCard>
        )}
      </div>
    </motion.div>
  );
};