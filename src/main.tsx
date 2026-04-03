import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './ui/styles/tokens.css';
import './ui/styles/base.css';
import './ui/styles/seasonal.css';

import { GameProvider } from './ui/context/game-context';
import { App } from './app';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
);
