import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Fel vid hämtning av produkt:', err));
  }, [id]);

  if (!product) {
    return <div className="container mx-auto p-4">Produkten hittades inte!</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
      <div className="border rounded-lg p-4 bg-white shadow flex">
        <img src={product.image} alt={product.title} className="w-1/3 h-64 object-contain mr-4" />
        <div>
          <p className="text-xl font-bold mt-2">{product.price} kr</p>
          <p className="text-gray-600">{product.description}</p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => addToCart(product)}
          >
            Lägg till i varukorg
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;