import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productDetailBySlug, similarForProduct } from '../api/products';
import { addToCart } from '../api/cart';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    productDetailBySlug(slug).then(res => {
      setProduct(res.data);
      similarForProduct(res.data._id).then(sr => setSimilar(sr.data));
    });
  }, [slug]);

  if (!product) return <p>Loading…</p>;

  return (
    <div className="container">
      <h2>{product.title}</h2>
      <img src={product.images?.[0]} alt={product.title} />
      <p>₹{product.price}</p>
      <button onClick={() => addToCart(product._id, 1)}>Add to Cart</button>

      <h3>Similar products</h3>
      <div className="grid">
        {similar.map(p => (
          <div key={p._id} className="card">
            <img src={p.images?.[0]} alt={p.title} />
            <p>{p.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
