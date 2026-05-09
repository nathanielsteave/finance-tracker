import { useEffect, useMemo } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/GlassCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF2D55', '#5AC8FA', '#FF6B6B'];

export const Insights = ({ locale }) => {
  const { transactions, loadData, loading } = useFinanceStore();
  
  useEffect(() => {
    const init = async () => { await loadData(); };
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
  }, [transactions]);

  const stats = useMemo(() => {
    const totalExpenses = transactions?.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0) || 0;
    const totalIncome = transactions?.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0) || 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const avgDailySpend = totalExpenses / 30;
    return { totalExpenses, totalIncome, savingsRate, avgDailySpend };
  }, [transactions]);

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
      <h1 className="text-2xl font-bold tracking-tight">{locale?.t?.('insights') || 'Insights'}</h1>
      
      {categoryData.length > 0 && (
        <GlassCard className="p-5" animate delay={0.05}>
          <h3 className="font-semibold mb-4">{locale?.t?.('spendingByCategory') || 'Spending by Category'}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(255,255,255,0.2)', 
                    borderRadius: '10px',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
            {categoryData.slice(0, 5).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-300">{cat.name}</span>
                </div>
                <span className="font-medium">{locale?.formatMoney?.(cat.value) || `$${cat.value.toFixed(0)}`}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-4">
            <p className="text-gray-400 text-xs">{locale?.t?.('totalExpenses') || 'Total Expenses'}</p>
            <p className="text-xl font-bold mt-1 text-danger">{locale?.formatMoney?.(stats.totalExpenses) || `$${stats.totalExpenses.toFixed(0)}`}</p>
          </GlassCard>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <GlassCard className="p-4">
            <p className="text-gray-400 text-xs">{locale?.t?.('totalIncome') || 'Total Income'}</p>
            <p className="text-xl font-bold mt-1 text-success">{locale?.formatMoney?.(stats.totalIncome) || `$${stats.totalIncome.toFixed(0)}`}</p>
          </GlassCard>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-4">
            <p className="text-gray-400 text-xs">{locale?.t?.('savingsRate') || 'Savings Rate'}</p>
            <p className={`text-xl font-bold mt-1 ${stats.savingsRate >= 20 ? 'text-success' : stats.savingsRate >= 10 ? 'text-warning' : 'text-danger'}`}>
              {stats.savingsRate.toFixed(1)}%
            </p>
          </GlassCard>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
          <GlassCard className="p-4">
            <p className="text-gray-400 text-xs">{locale?.t?.('avgDailySpend') || 'Avg. Daily Spend'}</p>
            <p className="text-xl font-bold mt-1">{locale?.formatMoney?.(stats.avgDailySpend) || `$${stats.avgDailySpend.toFixed(0)}`}</p>
          </GlassCard>
        </motion.div>
      </div>

      {categoryData.length > 0 && (
        <GlassCard className="p-5" animate delay={0.3}>
          <h3 className="font-semibold mb-4">{locale?.t?.('topCategories') || 'Top 5 Categories'}</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData.slice(0, 5)}>
                <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 11}} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="#9ca3af" tick={{fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(255,255,255,0.2)', 
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {categoryData.slice(0, 5).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {transactions.length === 0 && (
        <GlassCard className="p-8 text-center">
          <p className="text-gray-400">{locale?.t?.('noData') || 'No data available yet'}</p>
        </GlassCard>
      )}
    </motion.div>
  );
};