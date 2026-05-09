import { useMemo } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { t, formatCurrency, currencies, EXCHANGE_RATE } from '../lib/i18n';

export const useLocale = (lang) => {
  const { settings } = useFinanceStore();
  const displayCurrency = settings.currency || 'IDR';
  const currencyConfig = currencies[lang] || currencies.id;

  const translate = useMemo(() => (key) => t(key, lang), [lang]);

  const formatMoney = useMemo(() => {
    return (amount, storedCurrency = 'IDR') => {
      let converted = amount;
      
      // ✅ Logic Converter: IDR <-> USD
      if (storedCurrency !== displayCurrency) {
        if (storedCurrency === 'IDR' && displayCurrency === 'USD') {
          converted = amount * EXCHANGE_RATE.IDR_TO_USD;
        } else if (storedCurrency === 'USD' && displayCurrency === 'IDR') {
          converted = amount * EXCHANGE_RATE.USD_TO_IDR;
        }
      }
      
      return formatCurrency(converted, displayCurrency, currencyConfig.locale);
    };
  }, [displayCurrency, currencyConfig.locale]);

  return {
    lang,
    t: translate,
    formatMoney,
    currency: displayCurrency,
    currencySymbol: currencyConfig.symbol,
    locale: currencyConfig.locale
  };
};