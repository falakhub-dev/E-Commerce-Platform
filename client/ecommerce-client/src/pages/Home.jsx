import { useEffect, useState } from 'react';
import { listProducts } from '../api/products';
import { addToCart } from '../api/cart';
import Filters from '../components/Filters';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [params, setParams] = useState({});

  useEffect(() => {
    listProducts(params).then(res => setProducts(res.data.items));
  }, [params]);

  const handleAdd = async (id) => {
    try {
      await addToCart(id, 1);
      alert('Added to cart');
    } catch (e) {
      alert('Please login to add to cart');
    }
  };

  return (
    <div className="container">
      <Filters onChange={setParams} />
      <div className="grid">
        {products.map(p => <ProductCard key={p._id} product={p} onAdd={handleAdd} />)}
      </div>
    </div>
  );
}
