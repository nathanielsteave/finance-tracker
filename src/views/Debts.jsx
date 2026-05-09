import { useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/GlassCard';
import { ProgressRing } from '../components/ProgressRing';
import { motion } from 'framer-motion';
import { CreditCard, TrendingUp } from 'lucide-react';

export const Debts = ({ locale }) => {
  const { debts, loadData, loading } = useFinanceStore();
  
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

  const totalDebt = debts.reduce((acc, d) => acc + (d.currentBalance || d.totalBalance), 0);
  const totalMinPayment = debts.reduce((acc, d) => acc + d.minPayment, 0);

  return (
    <motion.div 
      className="p-4 pb-safe max-w-2xl mx-auto space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold tracking-tight">{locale?.t?.('debts') || 'Debts'}</h1>
      
      <GlassCard className="p-5 bg-gradient-to-br from-danger/20 to-warning/10" animate delay={0.05}>
        <div className="flex items-center gap-3 mb-2">
          <CreditCard size={24} className="text-danger" />
          <div>
            <p className="text-sm text-gray-300">{locale?.t?.('totalDebt') || 'Total Debt'}</p>
            <p className="text-3xl font-bold text-danger">{locale?.formatMoney?.(totalDebt) || `$${totalDebt.toLocaleString()}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <TrendingUp size={16} />
          <span>{locale?.t?.('minPayment') || 'Min. Payment'}: {locale?.formatMoney?.(totalMinPayment) || `$${totalMinPayment}`}/bulan</span>
        </div>
      </GlassCard>

      <div className="space-y-3">
        {debts.map((d, i) => {
          const currentBalance = d.currentBalance || d.totalBalance;
          const paidPct = d.totalBalance > 0 ? ((d.totalBalance - currentBalance) / d.totalBalance) * 100 : 0;
          const daysUntilDue = d.dueDate ? Math.ceil((new Date(d.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
          
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + (i * 0.05) }}
            >
              <GlassCard className="p-5">
                <div className="flex items-start gap-4">
                  <ProgressRing 
                    progress={paidPct} 
                    size={70} 
                    stroke={6} 
                    color={paidPct > 50 ? 'var(--success)' : 'var(--accent)'} 
                    label={`${Math.round(paidPct)}%`}
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{d.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{d.type} • {d.interestRate}% APR</p>
                      </div>
                      <p className="font-bold text-danger text-lg">{locale?.formatMoney?.(currentBalance) || `$${currentBalance.toLocaleString()}`}</p>
                    </div>
                    
                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{locale?.t?.('minPayment') || 'Min. Payment'}</span>
                        <span className="font-medium">{locale?.formatMoney?.(d.minPayment) || `$${d.minPayment}`}/bln</span>
                      </div>
                      {daysUntilDue !== null && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{locale?.t?.('dueDate') || 'Due Date'}</span>
                          <span className={`font-medium ${daysUntilDue < 7 ? 'text-danger' : 'text-success'}`}>
                            {d.dueDate} ({daysUntilDue} {locale?.t?.('days') || 'days'})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
        
        {debts.length === 0 && (
          <GlassCard className="p-8 text-center">
            <p className="text-gray-400">{locale?.t?.('noDebts') || 'No debts recorded'}</p>
          </GlassCard>
        )}
      </div>
    </motion.div>
  );
};