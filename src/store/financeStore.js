import { create } from 'zustand';
import { db, seedIfEmpty } from '../db';

export const useFinanceStore = create((set) => ({
  transactions: [],
  budgets: [],
  debts: [],
  investments: [],
  settings: { currency: 'USD', theme: 'dark' },
  loading: true,

  loadData: async () => {
    await seedIfEmpty();
    set({ loading: false });
    const [t, b, d, inv, s] = await Promise.all([
      db.transactions.toArray(),
      db.budgets.toArray(),
      db.debts.toArray(),
      db.investments.toArray(),
      db.settings.toArray()
    ]);
    set({ transactions: t, budgets: b, debts: d, investments: inv, settings: Object.fromEntries(s.map(i => [i.key, i.value])) });
  },

  addTransaction: async (tx) => {
    const id = await db.transactions.add(tx);
    set(state => ({ transactions: [...state.transactions, { ...tx, id }] }));
  },

  updateDebt: async (id, data) => {
    await db.debts.update(id, data);
    set(state => ({ debts: state.debts.map(d => d.id === id ? { ...d, ...data } : d) }));
  },

  addInvestment: async (inv) => {
    const id = await db.investments.add(inv);
    set(state => ({ investments: [...state.investments, { ...inv, id }] }));
  },

  updateSetting: async (key, value) => {
    await db.settings.put({ key, value });
    set(state => ({ settings: { ...state.settings, [key]: value } }));
  }
}));