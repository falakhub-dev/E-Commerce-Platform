import Product from '../models/Product.js';
import User from '../models/User.js';

function cosine(a, b) {
  const dot = a.reduce((s, v, i) => s + v * (b[i] || 0), 0);
  const na = Math.sqrt(a.reduce((s, v) => s + v*v, 0));
  const nb = Math.sqrt(b.reduce((s, v) => s + (b[i]||0)**2, 0)); // fallback
  return dot / ((na * nb) || 1);
}

export async function similarProducts(productId, topN = 12) {
  const prod = await Product.findById(productId);
  const others = await Product.find({ _id: { $ne: productId }, stock: { $gt: 0 } });
  const scored = others.map(p => ({ product: p, score: cosine(prod.vector || [], p.vector || []) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(x => x.product);
  return scored;
}

export async function personalized(userId, topN = 20) {
  const user = await User.findById(userId);
  const weights = { view: 0.2, add_to_cart: 0.6, purchase: 1.0 };
  let prefVec = [];
  for (const i of user.interactions) {
    const p = await Product.findById(i.productId);
    const w = weights[i.type];
    p.vector.forEach((val, idx) => {
      prefVec[idx] = (prefVec[idx] || 0) + val * w;
    });
  }
  const candidates = await Product.find({ stock: { $gt: 0 } });
  const scored = candidates.map(p => ({ product: p, score: cosine(prefVec, p.vector || []) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(x => x.product);
  return scored;
}
