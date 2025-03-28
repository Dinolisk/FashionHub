import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>FashionHub</h1>
      <nav>
        <Link to="/">Hem</Link> |{' '}
        <Link to="/cart">Varukorg</Link> |{' '}
        <Link to="/login">Logga in</Link> |{' '}
        <Link to="/register">Registrera</Link>
      </nav>
    </header>
  );
}
export default Header;