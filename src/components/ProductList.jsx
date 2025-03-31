import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
// Importera ev. ikon till knappen
// import { ShoppingCartIcon } from '@heroicons/react/20/solid'; // Exempel: solid variant, mindre storlek

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); // <--- State för laddning
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true); // Börja ladda
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false); // Sluta ladda när data finns
      })
      .catch(err => {
        console.error('Fel vid hämtning av produkter:', err);
        setIsLoading(false); // Sluta ladda även vid fel
      });
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-6"> {/* Lite mer padding på större skärmar */}

      {/* Rubrik och Sökfält (Flexbox för placering) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8"> {/* Ökat mb */}
        <h2 className="text-3xl font-bold mb-4 md:mb-0 text-gray-800">Produkter</h2>
        <input
          type="text"
          placeholder="Sök produkter..."
          // Bättre styling, fast bredd på md+, full på små
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full md:w-80 transition duration-150 ease-in-out"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Laddningsindikator */}
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">Laddar produkter...</p>
          {/* Här kan du lägga in en spinner-komponent om du vill */}
        </div>
      ) : (
        /* Produkt-Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Fler kolumner på xl */}
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                // Snyggare kort-styling med overflow-hidden, border, shadow, hover-effekt
                className="rounded-lg overflow-hidden shadow-md hover:shadow-lg border border-gray-200 bg-white flex flex-col cursor-pointer group transition duration-300 ease-in-out transform hover:-translate-y-1" // Liten lyft-effekt
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Bildbehållare med fast aspekt och bakgrund */}
                <div className="relative w-full aspect-square overflow-hidden bg-gray-50"> {/* Ljusare bakgrund */}
                  <img
                    src={product.image}
                    alt={product.title}
                    // object-contain är nog bäst för produktbilder för att se hela
                    className="w-full h-full object-contain p-4 transition duration-300 group-hover:opacity-90" // Padding runt bilden, opacity-effekt
                    loading="lazy" // Lazy loading för bilder
                  />
                </div>

                {/* Innehållsarea */}
                <div className="p-4 flex flex-col flex-grow justify-between">
                  {/* Titel och Pris */}
                  <div>
                  <h3
                    title={product.title}
                    // Lägg till text-center här
                    className="text-base font-semibold text-gray-800 h-12 overflow-hidden text-ellipsis line-clamp-2 mb-2 text-center"
                  >
                    {product.title}
                  </h3>
                  <p
                    // Och lägg till text-center här
                    className="text-lg font-bold text-gray-900 mb-3 text-center"
                  >
                    {product.price.toFixed(2)} kr
                  </p>
                </div>
                  {/* Knapp */}
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      addToCart(product);
                    }}
                    // Annan färg, ikon, mer padding, tydligare focus
                    className="mt-auto w-full text-sm font-bold bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center justify-center space-x-2"
                    aria-label={`Lägg till ${product.title} i varukorg`}
                  >
                     {/* <ShoppingCartIcon className="h-4 w-4" /> */} {/* Valfri ikon */}
                    <span>Lägg till i varukorg</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            // Meddelande om inga produkter matchar sökningen
            <p className="text-gray-600 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center">
              Inga produkter matchade din sökning.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductList;