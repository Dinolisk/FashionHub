import React, { createContext, useContext, useState } from 'react'; // Importera React om det behövs

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Lägg till produkt eller öka antal
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    console.log("Cart after add:", cart); // Felsökning - Obs: Kan visa state innan uppdatering
  };

  // Funktion för att ta bort en produkt helt (baserat på ID)
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      console.log(`Removing item with ID: ${productId}`); // Felsökning
      const updatedCart = prevCart.filter(item => item.id !== productId);
      console.log("Cart after remove:", updatedCart); // Felsökning
      return updatedCart;
    });
  };

  // Funktion för att tömma hela varukorgen
  const clearCart = () => {
    console.log("Clearing cart"); // Felsökning
    setCart([]); // Sätt till en tom array
  };

  // (Valfritt - Funktion för att uppdatera antal, om du vill implementera +/- knappar senare)
  // const updateQuantity = (productId, amount) => {
  //   setCart(prevCart => prevCart.map(item =>
  //     item.id === productId
  //       ? { ...item, quantity: Math.max(1, item.quantity + amount) } // Se till att antal inte blir < 1
  //       : item
  //   ).filter(item => item.quantity > 0)); // Ta bort om antalet blir 0
  // };


  // Värdet som delas - Inkludera alla funktioner
  const value = {
    cart,
    addToCart,
    removeFromCart, // <--- Lägg till removeFromCart
    clearCart,      // <--- Lägg till clearCart
    // updateQuantity, // Lägg till om du implementerar den
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook för att använda contexten
export function useCart() {
  const context = useContext(CartContext);
   if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}