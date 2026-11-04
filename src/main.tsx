// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/i18n/config';
import '@/styles/tokens.css';
import '@/styles/base.css';
import App from '@/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
