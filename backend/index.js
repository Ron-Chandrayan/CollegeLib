const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => res.send('Hello World!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

const members = require('./models/members');

app.get('/fetch', async (req, res) => {
  try {
    const allmembers = await members.find().sort({ createdAt: 1 });
    res.json(allmembers);
  } catch (error) {
    res.status(500).json({ error: "student data not found" });
  }
});

app.use(express.static(path.join(__dirname, '../LibraryManage/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../LibraryManage/dist/index.html'));
});