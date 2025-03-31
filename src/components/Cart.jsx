import React from 'react'; // Importera React om det behövs
import { useCart } from '../context/CartContext';
// Importera ikon för soptunna (valfritt)
import { TrashIcon } from '@heroicons/react/24/outline';

function Cart() {
  // Hämta nu removeFromCart och clearCart (som nu finns i context)
  const { cart, clearCart, removeFromCart } = useCart();

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Din varukorg är tom! Lägg till produkter innan du skickar en beställning.');
      return;
    }

    // Beräkna totalen här för att undvika upprepning
    const orderTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const order = {
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })),
      total: orderTotal // Använd den beräknade totalen
    };

    console.log('Skickar beställning:', order); // Felsökning

    try {
      // Använd rätt port (5001?)
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });

       // Försök läsa svar även om det inte är OK
      const responseData = await response.json().catch(() => ({})); // Fånga ev. JSON-parsningsfel

      if (!response.ok) {
         // Använd meddelande från servern om det finns
        throw new Error(responseData.error || `Något gick fel vid beställningen (${response.status}).`);
      }

      alert(`Tack för din beställning! (${responseData.message || ''})`); // Visa serverns meddelande om det finns
      clearCart(); // <--- Denna ska nu fungera!

    } catch (error) {
      alert(`Kunde inte skicka beställningen: ${error.message}. Försök igen senare.`);
      console.error('Beställningsfel:', error);
    }
  };

  // Beräkna totalsumma för visning
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4"> {/* Lade till container */}
      <h2 className="text-2xl font-bold mb-6">Varukorg</h2> {/* Ökat mb */}
      {cart.length === 0 ? (
        <p className="text-gray-600">Din varukorg är tom.</p>
      ) : (
        <div className="bg-white p-4 rounded shadow"> {/* Lade till bakgrund etc. */}
          {/* Tabell-liknande layout (eller använd en riktig <table>) */}
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-3">
                 {/* Produktinfo */}
                <div className="flex items-center space-x-3">
                   <img src={item.image} alt={item.title} className="w-16 h-16 object-contain border rounded p-1"/>
                   <div>
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity} st x {item.price.toFixed(2)} kr
                      </p>
                   </div>
                </div>
                 {/* Pris och Ta bort-knapp */}
                 <div className="flex items-center space-x-4">
                    <p className="font-semibold w-24 text-right"> {/* Fast bredd för pris */}
                        {(item.price * item.quantity).toFixed(2)} kr
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)} // <--- Anropa removeFromCart
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Ta bort från varukorg" // Tooltip
                    >
                      {/* Använd ikon eller text */}
                      <TrashIcon className="h-5 w-5" />
                      {/* Ta bort */}
                    </button>
                 </div>
              </div>
            ))}
          </div>

          {/* Totalsumma */}
          <div className="mt-6 pt-4 border-t text-right">
             <p className="text-xl font-bold">
                Totalsumma: {cartTotal.toFixed(2)} kr
             </p>
             {/* Knapp för att skicka beställning */}
             <button
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition duration-150 ease-in-out" // Lite större knapp
                onClick={handleCheckout}
             >
                Skicka beställning
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;