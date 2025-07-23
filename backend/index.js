// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const { uploadToS3, getSignedUrl, listS3Files, deleteFromS3 } = require('./s3Utils');

// load environment vars
require('dotenv').config();

// ensure JWT secret is set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ Missing JWT_SECRET in .env');
  process.exit(1);
}

// models
const dailyfootfall = require('./models/dailyfootfall');
const hourlyfootfall = require('./models/hourlyfootfall');
const members = require('./models/members');
const lifetime = require('./models/lifetime');
const Users = require('./models/Users');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// CRON job stubs
// cron.schedule('0 21 * * *', async () => { /* daily footfall */ });
// cron.schedule('0 6-20 * * *', async () => { /* hourly footfall */ });
// cron.schedule('*/10 * * * * *', async () => { /* members sync */ });

// basic health
app.get('/', (req, res) => res.send('Backend is running'));

// data routes
app.get('/fetch', async (req, res) => {
  try {
    const all = await members.find().sort({ createdAt: 1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: 'student data not found' });
  }
});

app.get('/fetchtime', async (req, res) => {
  try {
    const times = await lifetime.find().sort({ createdAt: -1 });
    res.json(times);
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

app.get('/fetchusers', async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

// auth: signup/login
app.post('/api/save', async (req, res) => {
  const { name, PRN, password } = req.body;
  if (name) {
    if (await Users.findOne({ PRN }))
      return res.status(401).json({ success: false, message: 'User exists' });
    const user = new Users({ name, PRN, password });
    await user.save();
    const token = jwt.sign({ PRN }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ success: true, message: 'Signup successful', token, name });
  } else {
    const user = await Users.findOne({ PRN });
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    if (user.password !== password)
      return res.status(401).json({ success: false, message: 'Wrong password' });
    const token = jwt.sign({ PRN }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ success: true, message: 'Login successful', token, name: user.name });
  }
});

// token validation
app.get('/validate', async (req, res) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ valid: false });
  const token = h.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Users.findOne({ PRN: decoded.PRN });
    if (!user) return res.status(401).json({ valid: false });
    res.json({ valid: true, name: user.name });
  } catch {
    res.status(401).json({ valid: false });
  }
});

// S3 PDF upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('Only PDF files are allowed'), false)
});

app.post('/api/qps/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const { sem, subject, year } = req.body;
    if (!sem || !subject || !year)
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    const filename = `${subject}${year}_${Date.now()}.pdf`;
    const key = `qps/${sem}/${subject}/${year}/${filename}`;
    const result = await uploadToS3(req.file, key);
    if (result.success)
      return res.json({ success: true, message: 'Uploaded', fileUrl: result.url, key, filename });
    else
      return res.status(500).json({ success: false, message: 'Upload failed', error: result.error });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload error', error: err.message });
  }
});

app.get('/api/qps', async (req, res) => {
  try {
    const { success, files, error } = await listS3Files();
    if (!success) throw new Error(error);
    res.json(
      files.map(f => ({ sem: f.sem, subject: f.subject, year: f.year, filename: f.filename, size: f.size, lastModified: f.lastModified }))
    );
  } catch (err) {
    res.status(500).json({ message: 'Error fetching files', error: err.message });
  }
});

// app.get('/download/:sem/:subject/:year/:filename', async (req, res) => {
//   const { sem, subject, year, filename } = req.params;
//   try {
//     const { success, url, error } = await getSignedUrl(`qps/${sem}/${subject}/${year}/${filename}`);
//     if (success) return res.json({ success: true, downloadUrl: url });
//     else return res.status(404).json({ success: false, message: 'File not found', error });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Error generating download URL', error: err.message });
//   }
// });

// static React build + catch-all for client-side routing
app.use(express.static(path.join(__dirname, '../LibraryManage/dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../LibraryManage/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
