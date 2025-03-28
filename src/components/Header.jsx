import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold">FashionHub</h1>
      <nav className="mt-2">
        <Link className="mr-4 hover:text-blue-300" to="/">Hem</Link>
        <Link className="mr-4 hover:text-blue-300" to="/cart">Varukorg</Link>
        <Link className="mr-4 hover:text-blue-300" to="/login">Logga in</Link>
        <Link className="mr-4 hover:text-blue-300" to="/register">Registrera</Link>
      </nav>
    </header>
  );
}

export default Header;