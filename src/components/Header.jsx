import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
// Importera båda ikonerna
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';

function Header() {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    // navigate('/'); // Omdirigera eventuellt
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">

        {/* Vänster sida: Logo/Brand (Länkar till Hem) */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold">
            <Link to="/" className="hover:text-gray-300 transition duration-150 ease-in-out">
              FashionHub
            </Link>
          </h1>
        </div>

        {/* Höger sida: Ikoner & Actions */}
        <nav className="flex items-center space-x-4"> {/* Justerat space-x */}

          {/* Varukorgsikon med Badge */}
          <Link
            to="/cart"
            className="relative text-lg hover:text-blue-300 transition duration-150 ease-in-out p-1"
            aria-label={`Varukorg, ${cartItemCount} artiklar`}
           >
            <ShoppingCartIcon className="h-7 w-7" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Användarikon / Login / Logout */}
          {isLoggedIn ? (
            // --- Inloggat läge ---
            <>
              {/* Användarikon (kan senare trigga dropdown) */}
              <button
                className="text-lg hover:text-blue-300 transition duration-150 ease-in-out p-1"
                title={currentUser?.email}
                aria-label="Användarmeny"
              >
                <UserCircleIcon className="h-7 w-7" />
              </button>

              {/* Separat Logout-knapp */}
              <button
                onClick={handleLogout}
                className="text-sm hover:text-red-400 bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition duration-150 ease-in-out"
                aria-label="Logga ut"
              >
                Logga ut
              </button>
            </>
            // --- Slut Inloggat läge ---

          ) : (

            // --- Utloggat läge (Alternativ 1) ---
            <>
              {/* Ikon som länkar till Login */}
              <Link
                to="/login"
                className="text-lg hover:text-blue-300 transition duration-150 ease-in-out p-1"
                aria-label="Logga in" // Tydligare aria-label
              >
                <UserCircleIcon className="h-7 w-7" />
              </Link>
              {/* Explicit textlänk för Registrera */}
              <Link
                  className="text-lg hover:text-blue-300 transition duration-150 ease-in-out"
                  to="/register">
                  Registrera
              </Link>
            </>
            // --- Slut Utloggat läge ---
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;