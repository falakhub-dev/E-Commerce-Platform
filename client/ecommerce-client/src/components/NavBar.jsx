import { Link } from 'react-router-dom';

export default function NavBar() {
  const token = localStorage.getItem('accessToken');
  return (
    <nav className="nav">
      <Link to="/">Store</Link>
      <div className="spacer" />
      <Link to="/cart">Cart</Link>
      {token ? <Link to="/checkout">Checkout</Link> : <Link to="/login">Login</Link>}
    </nav>
  );
}
