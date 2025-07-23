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

require('dotenv').config();

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ Missing JWT_SECRET in .env');
  process.exit(1);
}

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

// CRON jobs (uncomment and configure as needed)
// cron.schedule('0 21 * * *', async () => { ... });
// cron.schedule('0 6-20 * * *', async () => { ... });
// cron.schedule('*/10 * * * * *', async () => { ... });

// API routes
app.get('/', (req, res) => res.send("Backend is running"));

app.get('/fetch', async (req, res) => {
  try {
    const allmembers = await members.find().sort({ createdAt: 1 });
    res.json(allmembers);
  } catch (error) {
    res.status(500).json({ error: "student data not found" });
  }
});

app.get('/fetchtime', async (req, res) => {
  try {
    const countstudents = await lifetime.find().sort({ createdAt: -1 });
    res.json(countstudents);
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
});

app.get('/fetchusers', async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
});

app.post('/api/save', async (req, res) => {
  const { name, PRN, password } = req.body;
  if (name) {
    const userExists = await Users.findOne({ PRN });
    if (userExists) return res.status(401).json({ success: false, message: "User exists" });

    const newUser = new Users({ name, PRN, password });
    await newUser.save();
    const token = jwt.sign({ PRN }, JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ success: true, message: "Signup successful", token, name });
  } else {
    const user = await Users.findOne({ PRN });
    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    if (user.password !== password) return res.status(401).json({ success: false, message: "Wrong password" });

    const token = jwt.sign({ PRN }, JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ success: true, message: "Login successful", token, name: user.name });
  }
});

app.get('/validate', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Users.findOne({ PRN: decoded.PRN });
    if (!user) return res.status(401).json({ valid: false });
    res.json({ valid: true, name: user.name });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});

// S3-based QP uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.mimetype === 'application/pdf' ? cb(null, true) : cb(new Error('Only PDF files are allowed'), false);
  }
});

app.post('/api/qps/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const { sem, subject, year } = req.body;
    if (!sem || !subject || !year) return res.status(400).json({ success: false, message: 'Missing required fields' });

    const timestamp = Date.now();
    const filename = `${subject}${year}_${timestamp}.pdf`;
    const key = `qps/${sem}/${subject}/${year}/${filename}`;
    const uploadResult = await uploadToS3(req.file, key);

    if (uploadResult.success) {
      res.status(200).json({ success: true, message: 'Uploaded', fileUrl: uploadResult.url, key, filename });
    } else {
      res.status(500).json({ success: false, message: 'Upload failed', error: uploadResult.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload error', error: error.message });
  }
});

app.get('/api/qps', async (req, res) => {
  try {
    const result = await listS3Files();
    if (result.success) {
      const formattedFiles = result.files.map(file => ({
        sem: file.sem,
        subject: file.subject,
        year: file.year,
        filename: file.filename,
        size: file.size,
        lastModified: file.lastModified
      }));
      res.json(formattedFiles);
    } else {
      res.status(500).json({ message: 'Error fetching files from S3', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files', error: error.message });
  }
});

app.get('/download/:sem/:subject/:year/:filename', async (req, res) => {
  const { sem, subject, year, filename } = req.params;
  const key = `qps/${sem}/${subject}/${year}/${filename}`;
  try {
    const result = await getSignedUrl(key);
    if (result.success) {
      res.json({ success: true, downloadUrl: result.url });
    } else {
      res.status(404).json({ success: false, message: 'File not found in S3', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating download URL', error: error.message });
  }
});

// Serve React build and catch-all route
app.use(express.static(path.join(__dirname, '../LibraryManage/dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../LibraryManage/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
