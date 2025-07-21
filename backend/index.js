const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { uploadToS3, getSignedUrl, listS3Files, deleteFromS3 } = require('./s3Utils');

const router = express.Router();
require('dotenv').config();

const dailyfootfall = require('./models/dailyfootfall');
const hourlyfootfall = require('./models/hourlyfootfall');
const members = require('./models/members');
const lifetime = require('./models/lifetime');
const Users = require('./models/Users');

const app = express();
app.use(cors());
app.use(express.json());
// app.options('*', cors());
// S3 will handle file serving, no need for local static file serving



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



app.get('/',(req,res)=>{
    res.send("Backend is running")
})

// app.get('/fetch',async (req,res)=>{
//     try {
//         const response = await axios.get(process.env.API_URL, {
//       headers: {
//         'XAPIKEY': process.env.API_KEY
//       }
//     });

//     const count = response.data.todays_footfall;

//     const entry = new dailyfootfall({ count }); //creating the document to be stored according to the footfall scema
//     await entry.save();// adding the documents to the db
//     console.log("data saved");
//     res.json({ message: '✅ Data saved successfully', count }); 
//     } catch (error) {
//          console.error('❌ Fetch/store error:', error.message);
//          res.status(500).json({ error: 'Failed to fetch or store data' });
//     }
// })

app.get('/fetch',async(req,res)=>{
  try {
    const allmembers = await members.find().sort({ createdAt: 1 });
    res.json(allmembers);
    
  } catch (error) {
    console.log("student data not found");
  }
});

app.get('/fetchtime',async(req,res)=>{
  try {
    const countstudents = await lifetime.find().sort({createdAt: -1});
    res.json(countstudents);
  } catch (error) {
    console.log("error");
  }
})

app.get('/fetchusers',async(req,res)=>{
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    console.log("error")
  }
})

app.post('/api/save', async (req, res) => {

  const { name,PRN,password } = req.body;

  console.log('✅ Data received from frontend:');
  console.log('Name:', name);
  console.log('PRN:', PRN);
  console.log('Password:', password);

  // You can store to MongoDB here (if needed)
  if(name){
    console.log("You signed Up");
    const tocheck=await Users.find({PRN: PRN});
    if(tocheck[0]){
      res.status(401).json({success:false , message: "User exists"});
    }else{ 
    const entry =  new Users({name,PRN,password});
    await entry.save();
    res.status(200).json({success:true , message: "SignUp Successful"});}
   
  }else{
    console.log("you logged in")
    const tocheck = await Users.find({PRN: PRN});
    if(tocheck[0].password===password){
      res.status(200).json({success:true , message: "SignUp Successful"});
    }else{
      console.log("not ok")
      res.status(401).json({success:false , message: "wrong password"});
    }
  }

});


//for pyqs
app.get('/download/:sem/:subject/:year/:filename', async (req, res) => {
  const { sem, subject, year, filename } = req.params;
  const key = `qps/${sem}/${subject}/${year}/${filename}`;

  try {
    const result = await getSignedUrl(key);
    if (result.success) {
      res.json({ 
        success: true, 
        downloadUrl: result.url,
        message: 'Download URL generated successfully'
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'File not found in S3',
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating download URL',
      error: error.message 
    });
  }
});
// Fetch question papers from S3
app.get('/api/qps', async (req, res) => {
  try {
    const result = await listS3Files();
    if (result.success) {
      // Format the response to match the expected structure
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
      console.error('Error listing S3 files:', result.error);
      res.status(500).json({ 
        message: 'Error fetching files from S3', 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error in /api/qps:', error);
    res.status(500).json({ 
      message: 'Error fetching files', 
      error: error.message 
    });
  }
});
// Configure multer for memory storage (for S3 upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});
// Upload route for S3
app.post('/api/qps/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }
    const { sem, subject, year } = req.body;
    if (!sem || !subject || !year) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: sem, subject, year' 
      });
    }
    // Generate filename
    const timestamp = Date.now();
    const filename = `${subject}${year}_${timestamp}.pdf`;
    const key = `qps/${sem}/${subject}/${year}/${filename}`;
    // Upload to S3
    const uploadResult = await uploadToS3(req.file, key);
    if (uploadResult.success) {
      return res.status(200).json({
        success: true,
        message: 'File uploaded successfully to S3',
        fileUrl: uploadResult.url,
        key: uploadResult.key,
        filename: filename
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file to S3',
        error: uploadResult.error
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));