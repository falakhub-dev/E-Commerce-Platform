import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card">
      <img src={product.images?.[0]} alt={product.title} />
      <h4>{product.title}</h4>
      <p>₹{product.price}</p>
      <div className="row">
        <Link to={`/product/${product.slug}`}>View</Link>
        <button onClick={() => onAdd(product._id)}>Add to Cart</button>
      </div>
    </div>
  );
}
