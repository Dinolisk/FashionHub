import { Link } from 'react-router-dom';

function ProductList() {
  const products = [
    { id: 1, name: "T-shirt", price: 199, description: "En snygg t-shirt" },
    { id: 2, name: "Jeans", price: 499, description: "Blå jeans" },
    { id: 3, name: "Jacka", price: 799, description: "Varm vinterjacka" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Produkter</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-xl font-bold mt-2">{product.price} kr</p>
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Lägg till i varukorg
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList;