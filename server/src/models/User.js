import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  label: String, line1: String, line2: String, city: String, state: String, zip: String, country: String
}, { _id: false });

const InteractionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  type: { type: String, enum: ['view', 'add_to_cart', 'purchase'], required: true },
  at: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  addresses: [AddressSchema],
  interactions: [InteractionSchema],
  refreshTokens: [String]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
