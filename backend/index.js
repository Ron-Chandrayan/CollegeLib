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


cron.schedule(('0 21 * * *'),async ()=>{
  try {
      const response = await axios.get(process.env.API_URL, { //daily footfall
    headers: {
      'XApiKey': process.env.API_KEY
    }
  });

  const count = response.data.todays_footfall;

  const entry = new dailyfootfall({ count }); //creating the document to be stored according to the footfall scema
  await entry.save();// adding the documents to the db
  console.log("data saved");
   
  } catch (error) {
       console.error('CRON-error', error.message);
      
  }
})

cron.schedule(('0 6-20 * * *'),async ()=>{
  try {
      const response = await axios.get(process.env.API_URL, { //hourly footfall
    headers: {
      'XApiKey': process.env.API_KEY
    }
  });

  const count = response.data.todays_footfall;

  const entry = new hourlyfootfall({ count }); //creating the document to be stored according to the footfall scema
  await entry.save();// adding the documents to the db
  console.log("data saved");
   
  } catch (error) {
       console.error('CRON-error', error.message);
      
  }
})


let isRunning = false

cron.schedule('*/10 * * * * *',async ()=>{

 if (isRunning) {
  console.log("Previous job still running, skipping this run.");
  return;
}
isRunning = true;

try {
      const response = await axios.get(process.env.API_URLZ, { 
    headers: {
      'XApiKey': process.env.API_KEY
    }
  })
 // console.log(response.data.students);
  const students = response.data.students || [];

 const latest  = await members.find();

 // console.log(latest);
//  console.log(latest.length);
//  console.log(students.length);

 

  //members.insertMany(students).then(()=>console.log("student inserted")).catch((err)=>console.log("error"))

  // const PRN = response.data.data.rollNo;
  // const fullname  = response.data.data.name;
  // const purpose = response.data.data.purpose;

          if (latest.length === 0) {
        console.log("Initial population — inserting all students.");
        await members.insertMany(students);
        await lifetime.insertMany(students); // createdAt will be auto-generated
        return;
      }

      const normalizePRN = prn => String(prn).trim();

      const oldPRNs = new Set(latest.map(user => normalizePRN(user.PRN)));
      const newPRNs = new Set(students.map(user => normalizePRN(user.PRN)));

      const came = students.filter(user => !oldPRNs.has(normalizePRN(user.PRN)));
      const left = latest.filter(user => !newPRNs.has(normalizePRN(user.PRN)));

      // ✅ Debounce: skip logging same student if they came within last 30s
      const filteredCame = [];

      for (const s of came) {
        const lastVisit = await lifetime.findOne(
          { PRN: s.PRN },
          {},
          { sort: { createdAt: -1 } }
        );

        const now = Date.now();
        const lastTime = lastVisit ? new Date(lastVisit.createdAt).getTime() : 0;

        if (!lastVisit || now - lastTime >= 60000) {
          filteredCame.push(s); // Don't need to add createdAt manually
        } else {
          console.log(`⏱️ Skipped duplicate visit by ${s.name} within 30s`);
        }
      }

      if (came.length === 0 && left.length === 0) {
        console.log("✅ working good — no change");
      } else {
        if (filteredCame.length > 0) {
          console.log(
            `➕ ${filteredCame.length} student(s) came:`,
            filteredCame.map(s => s.name)
          );
          await lifetime.insertMany(filteredCame);
        }
        if (left.length > 0) {
          console.log(`➖ ${left.length} student(s) left:`, left.map(s => s.name));
        }
      }

      // ✅ Upsert current members
      await Promise.all(
        students.map(s =>
          members.updateOne(
            { PRN: s.PRN },
            { $set: s },
            { upsert: true }
          )
        )
      );

      // ✅ Remove students no longer present
      await members.deleteMany({
        PRN: { $nin: students.map(s => s.PRN) }
      });



}catch(error){
  console.log("no data found");
}finally {
  isRunning = false;
}




})
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../LibraryManage/dist')));

// Catch-all: send back React's index.html for any route not handled above
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../LibraryManage/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
