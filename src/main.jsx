import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ✅ Inisialisasi tema SEBELUM React render (mencegah flash)
const savedTheme = localStorage.getItem('finance-theme') || 'dark'
document.documentElement.setAttribute('data-theme', savedTheme)

const savedLang = localStorage.getItem('finance-language');
const browserLang = navigator.language.split('-')[0]; // 'id' or 'en'
const initialLang = savedLang || (['id', 'en'].includes(browserLang) ? browserLang : 'en');

document.documentElement.lang = initialLang;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)