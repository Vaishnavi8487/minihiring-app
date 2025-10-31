import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 🧩 Start Mirage only in development
import { makeServer } from './mirage/server';
import { seedDatabase } from './lib/seed';

// Enable Mirage in development, and also in production when no external API is configured
// Set VITE_API_BASE_URL to point to a real backend to disable Mirage in prod
const hasExternalApi = Boolean(import.meta.env.VITE_API_BASE_URL);
const enableMirageFlag = String(import.meta.env.VITE_ENABLE_MIRAGE || '').toLowerCase() === 'true';
if (import.meta.env.DEV || (!hasExternalApi && !import.meta.env.DEV) || enableMirageFlag) {
  makeServer();
}

// Ensure local IndexedDB has data on first load
seedDatabase();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
