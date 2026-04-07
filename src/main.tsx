import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';

import { GameProvider } from './context/game-context';
import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
);
