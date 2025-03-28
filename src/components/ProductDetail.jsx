import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams(); // Hämta ID från URL:en

  // Testdata (senare kan detta komma från API)
  const products = [
    { id: 1, name: "T-shirt", price: 199, description: "En snygg t-shirt" },
    { id: 2, name: "Jeans", price: 499, description: "Blå jeans" },
    { id: 3, name: "Jacka", price: 799, description: "Varm vinterjacka" },
  ];

  // Hitta produkten baserat på ID
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <div className="container mx-auto p-4">Produkten hittades inte!</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <div className="border rounded-lg p-4 bg-white shadow">
        <p className="text-gray-600">{product.description}</p>
        <p className="text-xl font-bold mt-2">{product.price} kr</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Lägg till i varukorg
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;