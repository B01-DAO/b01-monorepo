import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const root = createRoot(document.getElementById('main') as HTMLElement);
root.render(<App />);
