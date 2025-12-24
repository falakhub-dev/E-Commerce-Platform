import { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeCartItem } from '../api/cart';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const [cart, setCart] = useState(null);

  const load = () => getCart().then(res => setCart(res.data)).catch(() => setCart({ items: [] }));
  useEffect(() => { load(); }, []);

  const updateQty = async (pid, q) => {
    await updateCartItem(pid, q); load();
  };
  const remove = async (pid) => {
    await removeCartItem(pid); load();
  };

  const total = cart?.items?.reduce((s, i) => s + i.productId.price * i.quantity, 0) || 0;

  return (
    <div className="container">
      <h2>Your cart</h2>
      {cart?.items?.map(i => (
        <div key={i.productId._id} className="row">
          <span>{i.productId.title}</span>
          <span>₹{i.productId.price}</span>
          <input type="number" value={i.quantity} onChange={e => updateQty(i.productId._id, Number(e.target.value))} />
          <button onClick={() => remove(i.productId._id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ₹{total}</h3>
      <Link to="/checkout">Go to checkout</Link>
    </div>
  );
}
