import Order from '../models/Order.js';
import Product from '../models/Product.js';

export async function dashboard(req, res) {
  const salesAgg = await Order.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, totalSales: { $sum: '$amount' }, orders: { $sum: 1 } } }
  ]);
  const lowStock = await Product.find({ stock: { $lt: 5 } }).select('title stock');
  res.json({ kpis: salesAgg[0] || { totalSales: 0, orders: 0 }, lowStock });
}

export async function listOrders(req, res) {
  const orders = await Order.find().sort('-createdAt');
  res.json(orders);
}

export async function updateStock(req, res) {
  const { stock } = req.body;
  const product = await Product.findByIdAndUpdate(req.params.id, { stock }, { new: true });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
}
