import Dexie from 'dexie';

export const db = new Dexie('FinanceDB');
db.version(1).stores({
  transactions: '++id, date, type, amount, category, note',
  budgets: '++id, category, limit, spent, period',
  debts: '++id, name, type, totalBalance, interestRate, minPayment, dueDate',
  investments: '++id, symbol, name, quantity, avgBuyPrice, currentPrice, assetClass',
  settings: 'key, value'
});

// Seed initial data if empty
export async function seedIfEmpty() {
  const count = await db.transactions.count();
  if (count === 0) {
    await db.transactions.bulkAdd([
      { date: new Date().toISOString().split('T')[0], type: 'expense', amount: 45.20, category: 'Food', note: 'Lunch' },
      { date: new Date().toISOString().split('T')[0], type: 'income', amount: 3200, category: 'Salary', note: 'Monthly pay' }
    ]);
    await db.budgets.add({ category: 'Food', limit: 500, spent: 45.20, period: 'monthly' });
    await db.debts.add({ name: 'Credit Card', type: 'credit', totalBalance: 1200, interestRate: 18.9, minPayment: 50, dueDate: '2026-05-20' });
    await db.investments.add({ symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, avgBuyPrice: 150, currentPrice: 182.5, assetClass: 'stock' });
  }
}