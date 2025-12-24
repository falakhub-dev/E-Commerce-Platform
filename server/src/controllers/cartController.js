import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

export async function getCart(req, res) {
  const cart = await getOrCreateCart(req.user.id);
  res.json(cart);
}

export async function addItem(req, res) {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || product.stock < 1) return res.status(400).json({ message: 'Product unavailable' });
  const cart = await getOrCreateCart(req.user.id);
  const idx = cart.items.findIndex(i => i.productId.equals(productId));
  if (idx >= 0) {
    cart.items[idx].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.productId');
  res.json(populated);
}

export async function updateItem(req, res) {
  const { productId, quantity } = req.body;
  const cart = await getOrCreateCart(req.user.id);
  const item = cart.items.find(i => i.productId.equals(productId));
  if (!item) return res.status(404).json({ message: 'Item not in cart' });
  item.quantity = quantity;
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.productId');
  res.json(populated);
}

export async function removeItem(req, res) {
  const { productId } = req.body;
  const cart = await getOrCreateCart(req.user.id);
  cart.items = cart.items.filter(i => !i.productId.equals(productId));
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.productId');
  res.json(populated);
}

export async function clearCart(req, res) {
  const cart = await getOrCreateCart(req.user.id);
  cart.items = [];
  await cart.save();
  res.json(cart);
}
