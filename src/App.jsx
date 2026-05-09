import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TabNav } from './components/TabNav';
import { Dashboard } from './views/Dashboard';
import { Transactions } from './views/Transactions';
import { Budgets } from './views/Budgets';
import { Debts } from './views/Debts';
import { Investments } from './views/Investments';
import { Insights } from './views/Insights';
import { Settings } from './views/Settings';
import { useFinanceStore } from './store/financeStore';
import { useLocale } from './hooks/useLocale';

export default function App() {
  const { settings } = useFinanceStore();
  const locale = useLocale(settings.language);
  
  return (
    <BrowserRouter>
      {/* Konten utama dengan padding bawah agar tidak tertutup nav */}
      <div className="min-h-screen pb-24">
        <Routes>
          <Route path="/" element={<Dashboard locale={locale} />} />
          <Route path="/transactions" element={<Transactions locale={locale} />} />
          <Route path="/budgets" element={<Budgets locale={locale} />} />
          <Route path="/debts" element={<Debts locale={locale} />} />
          <Route path="/investments" element={<Investments locale={locale} />} />
          <Route path="/insights" element={<Insights locale={locale} />} />
          <Route path="/settings" element={<Settings locale={locale} />} />
        </Routes>
      </div>
      {/* Navbar di luar wrapper konten - pasti fixed ke viewport */}
      <TabNav locale={locale} />
    </BrowserRouter>
  );
}