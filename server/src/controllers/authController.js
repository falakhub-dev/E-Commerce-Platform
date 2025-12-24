import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

function issueAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash });
  const accessToken = issueAccessToken(user);
  const refreshToken = crypto.randomUUID();
  user.refreshTokens.push(refreshToken);
  await user.save();
  res.json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const accessToken = issueAccessToken(user);
  const refreshToken = crypto.randomUUID();
  user.refreshTokens.push(refreshToken);
  await user.save();
  res.json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  const user = await User.findOne({ refreshTokens: refreshToken });
  if (!user) return res.status(401).json({ message: 'Invalid refresh token' });
  // rotate
  user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
  const newToken = crypto.randomUUID();
  user.refreshTokens.push(newToken);
  await user.save();
  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.json({ accessToken, refreshToken: newToken });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select('-passwordHash -refreshTokens');
  res.json(user);
}

export async function logout(req, res) {
  const { refreshToken } = req.body;
  const user = await User.findOne({ refreshTokens: refreshToken });
  if (user) {
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    await user.save();
  }
  res.json({ message: 'Logged out' });
}
