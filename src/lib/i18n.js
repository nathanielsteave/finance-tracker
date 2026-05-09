export const translations = {
    id: {
        dashboard: 'Dashboard', transactions: 'Transaksi', budgets: 'Budget', debts: 'Hutang',
        investments: 'Investasi', insights: 'Insight', settings: 'Pengaturan',
        netBalance: 'Saldo Bersih', income: 'Pemasukan', expenses: 'Pengeluaran',
        recentActivity: 'Aktivitas Terbaru', noTransactions: 'Belum ada transaksi',
        addFirst: 'Tambahkan di tab Transaksi', addTransaction: 'Tambah Transaksi',
        expense: 'Pengeluaran', incomeLabel: 'Pemasukan', amount: 'Jumlah',
        category: 'Kategori', note: 'Catatan', date: 'Tanggal', save: 'Simpan', cancel: 'Batal',
        used: 'Terpakai', remaining: 'Sisa', over: '(Melebihi)',
        totalDebt: 'Total Hutang', minPayment: 'Min. Pembayaran', dueDate: 'Jatuh Tempo',
        days: 'hari', noDebts: 'Tidak ada hutang yang tercatat',
        portfolioValue: 'Nilai Portofolio', assets: 'Aset', noInvestments: 'Belum ada investasi',
        spendingByCategory: 'Pengeluaran per Kategori', quickStats: 'Statistik Cepat',
        totalExpenses: 'Total Pengeluaran', totalIncome: 'Total Pemasukan',
        savingsRate: 'Rasio Tabungan', avgDailySpend: 'Rata-rata Harian',
        topCategories: 'Top 5 Kategori', noData: 'Belum ada data untuk ditampilkan',
        appearance: 'Tampilan', dark: 'Gelap', light: 'Terang',
        language: 'Bahasa', indonesian: 'Indonesia', english: 'Inggris',
        currency: 'Mata Uang', dataManagement: 'Data & Backup',
        exportBackup: 'Export Backup', exportDesc: 'Unduh semua data (JSON)',
        clearAllData: 'Hapus Semua Data', clearDesc: 'Reset aplikasi ke awal',
        security: 'Keamanan', securityDesc: 'Fitur PIN & biometrik akan hadir di v1.1',
        about: 'Tentang', version: 'Versi', builtWith: 'Dibuat dengan',
        loading: 'Memuat...', confirm: 'Konfirmasi', yes: 'Ya', no: 'Tidak',
        deleteConfirm: '⚠️ Semua data akan dihapus permanen. Lanjutkan?',
        exportSuccess: '✅ Backup berhasil diunduh!', exportFailed: '❌ Export gagal: '
    },
    en: {
        dashboard: 'Dashboard', transactions: 'Transactions', budgets: 'Budgets', debts: 'Debts',
        investments: 'Investments', insights: 'Insights', settings: 'Settings',
        netBalance: 'Net Balance', income: 'Income', expenses: 'Expenses',
        recentActivity: 'Recent Activity', noTransactions: 'No transactions yet',
        addFirst: 'Add one in Transactions tab', addTransaction: 'Add Transaction',
        expense: 'Expense', incomeLabel: 'Income', amount: 'Amount',
        category: 'Category', note: 'Note', date: 'Date', save: 'Save', cancel: 'Cancel',
        used: 'Used', remaining: 'Remaining', over: '(Over)',
        totalDebt: 'Total Debt', minPayment: 'Min. Payment', dueDate: 'Due Date',
        days: 'days', noDebts: 'No debts recorded',
        portfolioValue: 'Portfolio Value', assets: 'Assets', noInvestments: 'No investments yet',
        spendingByCategory: 'Spending by Category', quickStats: 'Quick Stats',
        totalExpenses: 'Total Expenses', totalIncome: 'Total Income',
        savingsRate: 'Savings Rate', avgDailySpend: 'Avg. Daily Spend',
        topCategories: 'Top 5 Categories', noData: 'No data available yet',
        appearance: 'Appearance', dark: 'Dark', light: 'Light',
        language: 'Language', indonesian: 'Indonesian', english: 'English',
        currency: 'Currency', dataManagement: 'Data & Backup',
        exportBackup: 'Export Backup', exportDesc: 'Download all data (JSON)',
        clearAllData: 'Clear All Data', clearDesc: 'Reset app to initial state',
        security: 'Security', securityDesc: 'PIN & biometric coming in v1.1',
        about: 'About', version: 'Version', builtWith: 'Built with',
        loading: 'Loading...', confirm: 'Confirm', yes: 'Yes', no: 'No',
        deleteConfirm: '⚠️ All data will be permanently deleted. Continue?',
        exportSuccess: '✅ Backup downloaded successfully!', exportFailed: ' Export failed: '
    }
};

export const currencies = {
    id: { code: 'IDR', symbol: 'Rp', locale: 'id-ID' },
    en: { code: 'USD', symbol: '$', locale: 'en-US' }
};

// ✅ Exchange Rate: 1 USD = 16,000 IDR (bisa disesuaikan nanti)
export const EXCHANGE_RATE = { USD_TO_IDR: 16000, IDR_TO_USD: 1 / 16000 };

export const t = (key, lang = 'id') => {
    return translations[lang]?.[key] || translations.id[key] || key;
};

export const formatCurrency = (amount, currencyCode, locale) => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
};