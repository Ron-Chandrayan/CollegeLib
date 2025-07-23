// Final merged code with JWT and AWS S3 features
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

// CRON jobs
cron.schedule('0 21 * * *', async () => {
  try {
    const response = await axios.get(process.env.API_URL, {
      headers: { 'XApiKey': process.env.API_KEY }
    });
    const count = response.data.todays_footfall;
    const entry = new dailyfootfall({ count });
    await entry.save();
    console.log("daily footfall saved");
  } catch (error) {
    console.error('CRON-error', error.message);
  }
});

cron.schedule('0 6-20 * * *', async () => {
  try {
    const response = await axios.get(process.env.API_URL, {
      headers: { 'XApiKey': process.env.API_KEY }
    });
    const count = response.data.todays_footfall;
    const entry = new hourlyfootfall({ count });
    await entry.save();
    console.log("hourly footfall saved");
  } catch (error) {
    console.error('CRON-error', error.message);
  }
});

let isRunning = false;
cron.schedule('*/10 * * * * *', async () => {
  if (isRunning) return;
  isRunning = true;
  try {
    const response = await axios.get(process.env.API_URLZ, {
      headers: { 'XApiKey': process.env.API_KEY }
    });
    const students = response.data.students || [];
    const latest = await members.find();

    const normalizePRN = prn => String(prn).trim();
    const oldPRNs = new Set(latest.map(user => normalizePRN(user.PRN)));
    const newPRNs = new Set(students.map(user => normalizePRN(user.PRN)));

    const came = students.filter(user => !oldPRNs.has(normalizePRN(user.PRN)));
    const left = latest.filter(user => !newPRNs.has(normalizePRN(user.PRN)));

    const filteredCame = [];
    for (const s of came) {
      const lastVisit = await lifetime.findOne({ PRN: s.PRN }, {}, { sort: { createdAt: -1 } });
      const now = Date.now();
      const lastTime = lastVisit ? new Date(lastVisit.createdAt).getTime() : 0;
      if (!lastVisit || now - lastTime >= 60000) {
        filteredCame.push(s);
      }
    }

    if (filteredCame.length > 0) await lifetime.insertMany(filteredCame);
    if (left.length > 0) console.log(`➖ ${left.length} student(s) left.`);

    await Promise.all(students.map(s => members.updateOne({ PRN: s.PRN }, { $set: s }, { upsert: true })));
    await members.deleteMany({ PRN: { $nin: students.map(s => s.PRN) } });

  } catch (error) {
    console.log("no data found");
  } finally {
    isRunning = false;
  }
});

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

// S3-based pyq upload/download/list
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'), false);
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
      return res.status(200).json({ success: true, message: 'Uploaded', fileUrl: uploadResult.url, key, filename });
    } else {
      return res.status(500).json({ success: false, message: 'Upload failed', error: uploadResult.error });
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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../LibraryManage/dist')));
// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../LibraryManage/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
