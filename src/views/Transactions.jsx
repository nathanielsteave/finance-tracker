import { useState, useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard, GlassButton } from '../components/GlassCard';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Transactions = ({ locale }) => {
  const { transactions, addTransaction, loadData, loading } = useFinanceStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    type: 'expense', 
    amount: '', 
    category: '', 
    note: '', 
    date: new Date().toISOString().split('T')[0] 
  });

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

  const submit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    addTransaction({ ...form, amount: parseFloat(form.amount) });
    setShowForm(false);
    setForm({ type: 'expense', amount: '', category: '', note: '', date: new Date().toISOString().split('T')[0] });
  };

  const sortedTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <motion.div 
      className="p-4 pb-safe max-w-2xl mx-auto space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{locale?.t?.('transactions') || 'Transactions'}</h1>
        <GlassButton variant="primary" onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus size={18} /> <span className="hidden sm:inline">{locale?.t?.('addTransaction') || 'Add'}</span>
        </GlassButton>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass w-full max-w-md p-5 rounded-t-3xl sm:rounded-3xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{locale?.t?.('addTransaction') || 'Add Transaction'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-2">
                <GlassButton 
                  className={`flex-1 ${form.type === 'expense' ? 'bg-danger/20 border-danger/50' : ''}`}
                  onClick={() => setForm({...form, type: 'expense'})}
                >
                  {locale?.t?.('expense') || 'Expense'}
                </GlassButton>
                <GlassButton 
                  className={`flex-1 ${form.type === 'income' ? 'bg-success/20 border-success/50' : ''}`}
                  onClick={() => setForm({...form, type: 'income'})}
                >
                  {locale?.t?.('incomeLabel') || 'Income'}
                </GlassButton>
              </div>

              <input 
                className="w-full glass-input text-lg font-semibold" 
                type="number" 
                step="0.01"
                placeholder={locale?.t?.('amount') || 'Amount'} 
                value={form.amount} 
                onChange={e => setForm({...form, amount: e.target.value})} 
                autoFocus
              />
              <input 
                className="w-full glass-input" 
                placeholder={locale?.t?.('category') || 'Category'} 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})} 
              />
              <input 
                className="w-full glass-input" 
                placeholder={locale?.t?.('note') || 'Note'} 
                value={form.note} 
                onChange={e => setForm({...form, note: e.target.value})} 
              />
              <input 
                className="w-full glass-input" 
                type="date" 
                value={form.date} 
                onChange={e => setForm({...form, date: e.target.value})} 
              />
              <GlassButton variant="primary" className="w-full py-3 text-base font-semibold" onClick={submit}>
                {locale?.t?.('save') || 'Save'}
              </GlassButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {sortedTransactions.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <GlassCard className="flex justify-between items-center p-4 active:scale-[0.99] transition-transform">
              <div className="flex-1">
                <p className="font-semibold text-base">{t.category}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.date} • {t.note || '—'}</p>
              </div>
              <p className={`font-bold text-lg ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                {locale?.formatMoney?.(t.type === 'income' ? t.amount : -t.amount) || `$${t.amount.toFixed(2)}`}
              </p>
            </GlassCard>
          </motion.div>
        ))}
        {transactions.length === 0 && (
          <GlassCard className="p-8 text-center">
            <p className="text-gray-400 mb-2">{locale?.t?.('noTransactions') || 'No transactions yet'}</p>
            <GlassButton variant="primary" onClick={() => setShowForm(true)}>
              {locale?.t?.('addTransaction') || 'Add Transaction'}
            </GlassButton>
          </GlassCard>
        )}
      </div>
    </motion.div>
  );
};