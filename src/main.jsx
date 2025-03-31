import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // <--- Importera AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Om App.jsx har BrowserRouter, behöver den inte vara här */}
    {/* <BrowserRouter> */}
      <AuthProvider> {/* <--- Omslut med AuthProvider */}
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    {/* </BrowserRouter> */}
  </React.StrictMode>
);