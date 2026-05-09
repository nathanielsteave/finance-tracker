import { useState, useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard, GlassButton } from '../components/GlassCard';

export const Transactions = () => {
    const { transactions, addTransaction, loadData, loading } = useFinanceStore();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ type: 'expense', amount: '', category: '', note: '', date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        const init = async () => {
            await loadData();
        };
        init();
    }, [loadData]);
    if (loading) return null;

    const submit = (e) => {
        e.preventDefault();
        addTransaction({ ...form, amount: parseFloat(form.amount) });
        setShowForm(false);
        setForm({ type: 'expense', amount: '', category: '', note: '', date: new Date().toISOString().split('T')[0] });
    };

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <GlassButton onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add'}</GlassButton>
            </div>

            {showForm && (
                <GlassCard className="space-y-3">
                    <select className="w-full glass-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <input className="w-full glass-input" type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                    <input className="w-full glass-input" placeholder="Category (Food, Salary...)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                    <input className="w-full glass-input" placeholder="Note" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                    <input className="w-full glass-input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    <GlassButton className="w-full bg-accent/80 hover:bg-accent" onClick={submit}>Save</GlassButton>
                </GlassCard>
            )}

            <div className="space-y-2">
                {[...transactions].sort((a, b) => b.date.localeCompare(a.date)).map(t => (
                    <GlassCard key={t.id} className="flex justify-between items-center p-3">
                        <div>
                            <p className="font-medium">{t.category}</p>
                            <p className="text-xs text-gray-400">{t.date} • {t.note || '—'}</p>
                        </div>
                        <p className={`font-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                        </p>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};