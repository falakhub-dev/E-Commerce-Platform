import Product from '../models/Product.js';
import { personalized, similarProducts } from '../services/recommendationService.js';

export async function home(req, res) {
  if (req.user) {
    const items = await personalized(req.user.id);
    return res.json(items);
  }
  // guest: popular or latest
  const items = await Product.find({ stock: { $gt: 0 } }).sort('-rating.avg -createdAt').limit(12);
  res.json(items);
}

export async function similar(req, res) {
  const items = await similarProducts(req.params.id);
  res.json(items);
}

export async function logEvent(req, res) {
  const { productId, type } = req.body;
  // append and keep reasonable cap
  await User.findByIdAndUpdate(req.user.id, { $push: { interactions: { productId, type } } });
  res.json({ ok: true });
}
