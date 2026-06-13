const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PUBLIC_DIR = path.join(__dirname, 'public');
if (fs.existsSync(PUBLIC_DIR)) {
  app.use(express.static(PUBLIC_DIR));
}

const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'data.json');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@verdora.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.FOUNDER_NAME || 'Admin';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function loadDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const defaultDB = { users: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2));
      return defaultDB;
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch { return { users: [] }; }
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function seedAdmin() {
  const db = loadDB();
  const existing = db.users.find(u => u.email === ADMIN_EMAIL);
  if (!existing) {
    db.users.push({
      id: Date.now().toString(),
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashPassword(ADMIN_PASSWORD),
      role: 'admin',
      status: 'approved',
      business: '',
      phone: '',
      createdAt: new Date().toISOString()
    });
    saveDB(db);
    console.log(' Admin account seeded');
  }
}
seedAdmin();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Verdora Server is running' });
});

// Register buyer
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, business, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  const db = loadDB();
  if (db.users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }
  const user = {
    id: Date.now().toString(),
    name,
    email,
    password: hashPassword(password),
    role: 'buyer',
    status: 'approved',
    business: business || '',
    phone: phone || '',
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  saveDB(db);
  res.json({ message: 'Account created successfully! You can now log in.', userId: user.id });
});

// Register supplier
app.post('/api/auth/register-supplier', (req, res) => {
  const { name, email, password, mobile, location, pincode } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  const db = loadDB();
  if (db.users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }
  const user = {
    id: Date.now().toString(),
    name,
    email,
    password: hashPassword(password),
    role: 'supplier',
    status: 'pending',
    mobile: mobile || '',
    location: location || '',
    pincode: pincode || '',
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  saveDB(db);
  res.json({ message: 'Registration submitted. Your account is pending admin approval.', userId: user.id });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const db = loadDB();
  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  if (user.password !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  if (user.status === 'pending') {
    return res.status(403).json({ error: 'Your account is pending admin approval. Please wait.', status: 'pending' });
  }
  if (user.status === 'rejected') {
    return res.status(403).json({ error: 'Your registration was rejected. Please contact support.', status: 'rejected' });
  }
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  });
});

// Admin: Get all users (with optional filter)
app.get('/api/admin/users', (req, res) => {
  const { email, password } = req.headers;
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const db = loadDB();
  const users = db.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    business: u.business,
    phone: u.phone,
    mobile: u.mobile,
    location: u.location,
    pincode: u.pincode,
    createdAt: u.createdAt
  }));
  res.json(users);
});

// Admin: Approve user
app.post('/api/admin/users/:id/approve', (req, res) => {
  const { email, password } = req.headers;
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const db = loadDB();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.status = 'approved';
  saveDB(db);
  res.json({ message: 'User approved successfully' });
});

// Admin: Reject user
app.post('/api/admin/users/:id/reject', (req, res) => {
  const { email, password } = req.headers;
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const db = loadDB();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.status = 'rejected';
  saveDB(db);
  res.json({ message: 'User rejected' });
});

// Serve frontend for non-API routes (SPA support)
app.get('*', (req, res) => {
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexPath) && !req.path.startsWith('/api')) {
    res.sendFile(indexPath);
  } else if (!req.path.startsWith('/api')) {
    res.status(200).json({ message: 'Verdora API is running. Frontend not built yet.' });
  }
});

app.listen(PORT, () => {
  console.log(` Verdora Server running on http://localhost:${PORT}`);
});
