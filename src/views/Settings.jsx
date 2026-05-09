import { useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard, GlassButton } from '../components/GlassCard';
import { Download, Trash2, Moon, Sun, Database, Shield, Info, Globe, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../db';

export const Settings = ({ locale }) => {
  const { settings, updateSetting } = useFinanceStore();
  
  // ✅ Apply theme & language to document when settings change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
    document.documentElement.lang = settings.language || 'id';
    localStorage.setItem('finance-theme', settings.theme || 'dark');
    localStorage.setItem('finance-language', settings.language || 'id');
  }, [settings.theme, settings.language]);

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
      alert(locale?.t?.('exportSuccess') || '✅ Backup exported!');
    } catch (err) {
      alert((locale?.t?.('exportFailed') || '❌ Export failed: ') + err.message);
    }
  };

  // ✅ Clear all data with confirmation
  const clearAllData = async () => {
    if (window.confirm(locale?.t?.('deleteConfirm') || '⚠️ Delete all data?')) {
      await db.delete();
      localStorage.removeItem('finance-theme');
      localStorage.removeItem('finance-language');
      window.location.reload();
    }
  };

  // ✅ Menu items with translations via locale prop
  const menuItems = [
    {
      title: locale?.t?.('appearance') || 'Appearance',
      icon: settings.theme === 'dark' ? Moon : Sun,
      content: (
        <div className="flex gap-2 mt-3">
          <GlassButton 
            className={`flex-1 flex items-center justify-center gap-2 ${settings.theme === 'dark' ? 'bg-accent/30 border-accent/50' : ''}`} 
            onClick={() => updateSetting('theme', 'dark')}
          >
            <Moon size={16} /> {locale?.t?.('dark') || 'Dark'}
          </GlassButton>
          <GlassButton 
            className={`flex-1 flex items-center justify-center gap-2 ${settings.theme === 'light' ? 'bg-accent/30 border-accent/50' : ''}`} 
            onClick={() => updateSetting('theme', 'light')}
          >
            <Sun size={16} /> {locale?.t?.('light') || 'Light'}
          </GlassButton>
        </div>
      )
    },
    {
      title: locale?.t?.('language') || 'Language',
      icon: Globe,
      content: (
        <div className="flex gap-2 mt-3">
          <GlassButton 
            className={`flex-1 ${settings.language === 'id' ? 'bg-accent/30 border-accent/50' : ''}`} 
            onClick={() => updateSetting('language', 'id')}
          >
            🇮🇩 {locale?.t?.('indonesian') || 'Indonesia'}
          </GlassButton>
          <GlassButton 
            className={`flex-1 ${settings.language === 'en' ? 'bg-accent/30 border-accent/50' : ''}`} 
            onClick={() => updateSetting('language', 'en')}
          >
            🇺🇸 {locale?.t?.('english') || 'English'}
          </GlassButton>
        </div>
      )
    },
    {
      title: locale?.t?.('currency') || 'Currency',
      icon: Coins,
      content: (
        <div className="flex gap-2 mt-3">
          <GlassButton 
            className={`flex-1 ${settings.currency === 'IDR' ? 'bg-accent/30 border-accent/50' : ''}`} 
            onClick={() => updateSetting('currency', 'IDR')}
          >
            Rp IDR
          </GlassButton>
          <GlassButton 
            className={`flex-1 ${settings.currency === 'USD' ? 'bg-accent/30 border-accent/50' : ''}`} 
            onClick={() => updateSetting('currency', 'USD')}
          >
            $ USD
          </GlassButton>
        </div>
      )
    },
    {
      title: locale?.t?.('dataManagement') || 'Data & Backup',
      icon: Database,
      content: (
        <div className="space-y-2 mt-3">
          <GlassButton onClick={exportData} className="flex items-center gap-3 w-full justify-start py-3">
            <Download size={18} className="text-success" /> 
            <div className="text-left">
              <p className="font-medium text-sm">{locale?.t?.('exportBackup') || 'Export Backup'}</p>
              <p className="text-xs text-gray-400">{locale?.t?.('exportDesc') || 'Download all data (JSON)'}</p>
            </div>
          </GlassButton>
          <GlassButton onClick={clearAllData} className="flex items-center gap-3 w-full justify-start py-3 text-danger">
            <Trash2 size={18} /> 
            <div className="text-left">
              <p className="font-medium text-sm">{locale?.t?.('clearAllData') || 'Clear All Data'}</p>
              <p className="text-xs text-gray-400">{locale?.t?.('clearDesc') || 'Reset app to initial state'}</p>
            </div>
          </GlassButton>
        </div>
      )
    },
    {
      title: locale?.t?.('security') || 'Security',
      icon: Shield,
      content: (
        <div className="mt-3 opacity-60">
          <p className="text-sm text-gray-400">{locale?.t?.('securityDesc') || 'PIN & biometric coming in v1.1'}</p>
        </div>
      )
    },
    {
      title: locale?.t?.('about') || 'About',
      icon: Info,
      content: (
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">{locale?.t?.('version') || 'Version'}</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{locale?.t?.('builtWith') || 'Built with'}</span>
            <span className="font-medium">React + PWA</span>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Liquid Finance Tracker<br />
            Offline-First • No Cloud Required
          </p>
        </div>
      )
    }
  ];

  return (
    <motion.div 
      className="p-4 pb-safe max-w-2xl mx-auto space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold tracking-tight">{locale?.t?.('settings') || 'Settings'}</h1>
      
      {menuItems.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <item.icon size={20} className="text-accent" />
              <h3 className="font-bold text-lg">{item.title}</h3>
            </div>
            {item.content}
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
};