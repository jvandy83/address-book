import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { App } from './App';

import { Provider } from 'react-redux';

import { store } from './redux/store';

const rootElement = document.getElementById('app');

if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(
	<React.StrictMode>
		<Router>
			<Provider store={store}>
				<App />
			</Provider>
		</Router>
	</React.StrictMode>,
);
