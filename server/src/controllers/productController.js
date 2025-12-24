import Product from '../models/Product.js';

export async function list(req, res) {
  const { q, category, minPrice, maxPrice, tags, sort = '-createdAt', page = 1, limit = 20 } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (tags) filter.tags = { $in: tags.split(',').map(t => t.trim()) };
  if (minPrice || maxPrice) {
    filter.price = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {})
    };
  }
  const skip = (Number(page) - 1) * Number(limit);
  const query = Product.find(filter).sort(sort).skip(skip).limit(Number(limit));
  const [items, total] = await Promise.all([query.exec(), Product.countDocuments(filter)]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
}

export async function detail(req, res) {
  const product = await Product.findOne({ slug: req.params.slug }) || await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
}

export async function create(req, res) {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}

export async function update(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
}

export async function remove(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
}
