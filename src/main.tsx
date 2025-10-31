import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 🧩 Start Mirage only in development
import { makeServer } from './mirage/server';
import { seedDatabase } from './lib/seed';

if (import.meta.env.DEV) {
  makeServer();
}

// Ensure local IndexedDB has data on first load
seedDatabase();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
