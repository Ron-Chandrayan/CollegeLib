const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');


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
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";


app.use('/qps', express.static(path.join(__dirname, 'uploads/qps')));



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
  const { name, PRN, password } = req.body;

  if (name) {
    // Signup
    const userExists = await Users.findOne({ PRN });

    if (userExists) {
      return res.status(401).json({ success: false, message: "User exists" });
    }

    const newUser = new Users({ name, PRN, password });
    await newUser.save();

    const token = jwt.sign({ PRN }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      success: true,
      message: "Signup successful",
      token,
      name
    });
  } else {
    // Login
    const user = await Users.findOne({ PRN });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign({ PRN }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      name: user.name
    });
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




//for pyqs
app.get('/download/:sem/:subject/:year/:filename', (req, res) => {
  const { sem, subject, year, filename } = req.params;
  const filePath = path.join(__dirname, 'uploads/qps', sem, subject, year, filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error('File not found:', err);
      return res.status(404).send('File not found');
    }
  });
});

//for fetching pdf from backend
app.get('/api/qps', (req, res) => {
  const baseDir = path.join(__dirname, 'uploads/qps');
  let result = [];

  try{fs.readdirSync(baseDir).forEach(sem => {
    const semPath = path.join(baseDir, sem);
    fs.readdirSync(semPath).forEach(subject => {
      const subjectPath = path.join(semPath, subject);
      fs.readdirSync(subjectPath).forEach(year => {
        const yearPath = path.join(subjectPath, year);
        fs.readdirSync(yearPath).forEach(file => {
          result.push({
            sem,
            subject,
            year,
            filename: file
          });
        });
      });
    });
  });

  res.json(result);}
  catch(error){
    console.error('Error reading files:', error);
    res.status(500).json({ message: 'Error reading files', error });
  }
});


// //for uploading pdfs
// const storage = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       // Use a short delay to wait for body parsing
//       setTimeout(() => {
//         const { sem, subject, year } = req.body;

//         if (!sem || !subject || !year) {
//           console.error('❌ Missing sem/subject/year in req.body');
//           return cb(new Error('Missing form fields'));
//         }

//         const uploadPath = path.join(__dirname, 'uploads', 'qps', sem, subject, year);
//         fs.mkdirSync(uploadPath, { recursive: true });
//         cb(null, uploadPath);
//       }, 0); // Let body parsing complete
//     },
//     filename: (req, file, cb) => {
//       const { subject, year } = req.body;
//       const timestamp = Date.now();
//       const filename = `${subject}${year}_${timestamp}.pdf`;
//       cb(null, filename);
//     }
//   })
// });



//  const upload = multer({ storage });

// // Upload route
// app.post('/api/qps/upload', upload.single('file'), (req, res) => {
//   if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

//   const { sem, subject, year } = req.body;
//   const fileUrl = `/qps/${sem}/${subject}/${year}/${req.file.filename}`;

//   return res.status(200).json({
//     message: 'File uploaded successfully',
//     fileUrl
//   });
// });



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));