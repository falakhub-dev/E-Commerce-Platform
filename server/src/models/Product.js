import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  price: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  images: [String],
  category: { type: String, index: true },
  brand: String,
  tags: [{ type: String, index: true }],
  stock: { type: Number, default: 0 },
  rating: { avg: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  // vector for recommendations (optional numeric array)
  vector: { type: [Number], default: [] }
}, { timestamps: true });

ProductSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Product', ProductSchema);
