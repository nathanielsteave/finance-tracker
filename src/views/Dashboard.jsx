import { useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/GlassCard';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = ({ locale }) => {
  const { transactions, loadData, loading } = useFinanceStore();
  
  useEffect(() => {
    const init = async () => { await loadData(); };
    init();
  }, [loadData]);

  if (loading) {
    return (
      <div className="p-4 pb-24 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70dvh]">
        <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-400 text-sm animate-pulse">{locale?.t?.('loading') || 'Loading...'}</p>
      </div>
    );
  }

  const income = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const balance = income - expense;

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-4">
      <motion.h1 
        className="text-2xl font-bold tracking-tight"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {locale?.t?.('dashboard') || 'Dashboard'}
      </motion.h1>
      
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
      >
        <GlassCard className="p-6 bg-gradient-to-br from-accent/20 to-accent/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-300 text-sm font-medium mb-1">{locale?.t?.('netBalance') || 'Saldo Bersih'}</p>
              <p className="text-3xl font-bold tracking-tight">
                {locale?.formatMoney?.(balance) || `Rp ${balance.toLocaleString('id-ID')}`}
              </p>
            </div>
            <div className="p-3 bg-accent/20 rounded-xl">
              <Wallet size={28} className="text-accent" />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Income & Expense Cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4 h-full">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-success/20 rounded-lg">
                <ArrowUpRight size={16} className="text-success" />
              </div>
              <span className="font-medium text-sm text-gray-300">{locale?.t?.('income') || 'Pemasukan'}</span>
            </div>
            <p className="text-xl font-bold text-success">
              {locale?.formatMoney?.(income) || `Rp ${income.toLocaleString('id-ID')}`}
            </p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <GlassCard className="p-4 h-full">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-warning/20 rounded-lg">
                <ArrowDownRight size={16} className="text-warning" />
              </div>
              <span className="font-medium text-sm text-gray-300">{locale?.t?.('expenses') || 'Pengeluaran'}</span>
            </div>
            <p className="text-xl font-bold text-warning">
              {locale?.formatMoney?.(expense) || `Rp ${expense.toLocaleString('id-ID')}`}
            </p>
          </GlassCard>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-5">
          <h3 className="font-semibold text-lg mb-4">{locale?.t?.('recentActivity') || 'Aktivitas Terbaru'}</h3>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
            {transactions.slice(-6).reverse().map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + (i * 0.04) }}
                className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-[0.99]"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{t.category}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{t.note || '—'}</p>
                </div>
                <p className={`font-bold text-sm ml-2 ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {t.type === 'income' ? '+' : '-'}{locale?.formatMoney?.(Math.abs(t.amount)) || `Rp ${Math.abs(t.amount).toLocaleString('id-ID')}`}
                </p>
              </motion.div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">{locale?.t?.('noTransactions') || 'Belum ada transaksi'}</p>
                <p className="text-xs mt-1 opacity-70">{locale?.t?.('addFirst') || 'Tambahkan di tab Transaksi'}</p>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};