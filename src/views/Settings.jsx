import { useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard, GlassButton } from '../components/GlassCard';
import { Download, Trash2, Moon, Sun, Database, Shield } from 'lucide-react';
import { db } from '../db';

export const Settings = () => {
  const { settings, updateSetting } = useFinanceStore();
  
  // ✅ Apply theme to document when settings change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
    // Also persist to localStorage for consistency across reloads
    localStorage.setItem('finance-theme', settings.theme || 'dark');
  }, [settings.theme]);

  // ✅ Export all data as JSON backup
  const exportData = async () => {
    try {
      const backup = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        transactions: await db.transactions.toArray(),
        budgets: await db.budgets.toArray(),
        debts: await db.debts.toArray(),
        investments: await db.investments.toArray(),
        settings: await db.settings.toArray()
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      alert('✅ Backup exported successfully!');
    } catch (err) {
      alert('❌ Export failed: ' + err.message);
    }
  };

  // ✅ Clear all data with confirmation
  const clearAllData = async () => {
    if (window.confirm('⚠️ This will permanently delete ALL your financial data. Continue?')) {
      await db.delete();
      // Clear theme preference too
      localStorage.removeItem('finance-theme');
      // Reload to reset store + reinitialize DB with seed data
      window.location.reload();
    }
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      {/* Appearance */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Database size={18} className="text-accent" />
          <h3 className="font-medium">Appearance</h3>
        </div>
        <div className="flex gap-3">
          <GlassButton 
            className={`flex items-center gap-2 px-4 py-2 ${settings.theme === 'dark' ? 'bg-accent/30 border-accent/50' : ''}`} 
            onClick={() => updateSetting('theme', 'dark')}
          >
            <Moon size={16} /> Dark
          </GlassButton>
          <GlassButton 
            className={`flex items-center gap-2 px-4 py-2 ${settings.theme === 'light' ? 'bg-accent/30 border-accent/50' : ''}`} 
            onClick={() => updateSetting('theme', 'light')}
          >
            <Sun size={16} /> Light
          </GlassButton>
        </div>
        <p className="text-xs text-gray-400">
          Theme is saved locally and applied instantly.
        </p>
      </GlassCard>

      {/* Data Management */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-success" />
          <h3 className="font-medium">Data Management</h3>
        </div>
        <GlassButton onClick={exportData} className="flex items-center gap-2 w-full justify-start">
          <Download size={16} /> Export Backup (JSON)
        </GlassButton>
        <GlassButton onClick={clearAllData} className="flex items-center gap-2 w-full justify-start text-danger hover:bg-danger/10">
          <Trash2 size={16} /> Clear All Data
        </GlassButton>
        <p className="text-xs text-gray-400">
          Backups include transactions, budgets, debts, and investments. Store securely.
        </p>
      </GlassCard>

      {/* Security Placeholder */}
      <GlassCard className="p-4 opacity-60">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={18} className="text-warning" />
          <h3 className="font-medium">Security (Coming Soon)</h3>
        </div>
        <p className="text-sm text-gray-400">
          PIN lock and biometric authentication will be added in v1.1 using WebAuthn.
        </p>
      </GlassCard>

      {/* App Info */}
      <div className="text-center pt-4">
        <p className="text-xs text-gray-500">
          Liquid Finance Tracker v1.0
        </p>
        <p className="text-[10px] text-gray-600 mt-1">
          Built with React + PWA • Offline-First • No Cloud Required
        </p>
      </div>
    </div>
  );
};