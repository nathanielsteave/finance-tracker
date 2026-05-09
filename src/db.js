import Dexie from 'dexie';

export const db = new Dexie('FinanceDB');
db.version(1).stores({
  transactions: '++id, date, type, amount, category, note',
  budgets: '++id, category, limit, spent, period',
  debts: '++id, name, type, totalBalance, interestRate, minPayment, dueDate',
  investments: '++id, symbol, name, quantity, avgBuyPrice, currentPrice, assetClass',
  settings: 'key, value'
});