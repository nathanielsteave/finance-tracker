import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TabNav } from './components/TabNav';
import { Dashboard } from './views/Dashboard';
import { Transactions } from './views/Transactions';
import { Budgets } from './views/Budgets';
import { Debts } from './views/Debts';
import { Investments } from './views/Investments';
import { Insights } from './views/Insights';
import { Settings } from './views/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/debts" element={<Debts />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <TabNav />
    </BrowserRouter>
  );
}