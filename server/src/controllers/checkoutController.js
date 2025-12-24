import { stripe } from '../config/stripe.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export async function createIntent(req, res) {
  const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart empty' });
  const amount = Math.round(cart.items.reduce((sum, i) => sum + i.productId.price * i.quantity, 0) * 100); // paise
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'inr',
    metadata: { userId: String(req.user.id) }
  });

  const order = await Order.create({
    userId: req.user.id,
    items: cart.items.map(i => ({
      productId: i.productId._id, title: i.productId.title, price: i.productId.price, quantity: i.quantity
    })),
    amount: amount / 100,
    currency: 'INR',
    status: 'pending',
    stripePaymentIntentId: paymentIntent.id
  });

  res.json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
}

export async function confirm(req, res) {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  const pi = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
  if (pi.status === 'succeeded') {
    order.status = 'paid';
    await order.save();
    // decrement stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }
    // clear cart
    await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });
    return res.json({ message: 'Payment confirmed', order });
  }
  res.status(400).json({ message: 'Payment not completed' });
}

export async function webhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const order = await Order.findOne({ stripePaymentIntentId: intent.id });
    if (order && order.status !== 'paid') {
      order.status = 'paid';
      await order.save();
    }
  }
  res.json({ received: true });
}
