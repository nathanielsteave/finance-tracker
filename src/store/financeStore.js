import { create } from 'zustand';
import { db } from '../db'; // ✅ Hapus import seedIfEmpty

export const useFinanceStore = create((set) => ({
  transactions: [],
  budgets: [],
  debts: [],
  investments: [],
  settings: { currency: 'IDR', theme: 'dark', language: 'id' },
  loading: true,

  loadData: async () => {
    // ✅ Tidak ada lagi seedIfEmpty()
    set({ loading: false });
    
    const [t, b, d, inv, s] = await Promise.all([
      db.transactions.toArray(),
      db.budgets.toArray(),
      db.debts.toArray(),
      db.investments.toArray(),
      db.settings.toArray()
    ]);
    
    const savedSettings = Object.fromEntries(s.map(item => [item.key, item.value]));
    set({ 
      transactions: t, budgets: b, debts: d, investments: inv, 
      settings: { currency: 'IDR', theme: 'dark', language: 'id', ...savedSettings } 
    });
    
    document.documentElement.setAttribute('data-theme', savedSettings.theme || 'dark');
    document.documentElement.lang = savedSettings.language || 'id';
    localStorage.setItem('finance-theme', savedSettings.theme || 'dark');
    localStorage.setItem('finance-language', savedSettings.language || 'id');
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
    
    if (key === 'language') {
      document.documentElement.lang = value;
      localStorage.setItem('finance-language', value);
    }
    if (key === 'theme') {
      document.documentElement.setAttribute('data-theme', value);
      localStorage.setItem('finance-theme', value);
    }
  },

  clearAllData: async () => {
    await db.delete();
    set({
      transactions: [], budgets: [], debts: [], investments: [],
      settings: { currency: 'IDR', theme: 'dark', language: 'id' },
      loading: false
    });
    localStorage.removeItem('finance-theme');
    localStorage.removeItem('finance-language');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.lang = 'id';
  }
}));