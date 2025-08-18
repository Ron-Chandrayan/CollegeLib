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
const festudents = require('./models/FeStudent');
const timetable=require('./models/timetable');
const livefeed=require('./models/livefeed');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));


 async function footfall(){
    
    const start = new Date();
    start.setHours(0, 0, 0, 0);  // today at midnight

    const end = new Date(start);
    end.setDate(start.getDate() + 1); // tomorrow at midnight

    // const data = await lifetime.find({
    //   createdAt: { $gte: start, $lt: end }
    // }).sort({ createdAt: 1 });

     const data = await lifetime.countDocuments({
      createdAt: { $gte: start, $lt: end }
    });

    return data;
  
 }

cron.schedule(("30 15 * * *"),async ()=>{
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

cron.schedule(('0 1-13 * * *'),async ()=>{
  try {
  //     const response = await axios.get(process.env.API_URL, { //hourly footfall
  //   headers: {
  //     'XApiKey': process.env.API_KEY
  //   }
  // });

  // const count = response.data.todays_footfall;

  const count =await footfall();

  const entry = new hourlyfootfall({ count }); //creating the document to be stored according to the footfall scema
  await entry.save();// adding the documents to the db
  console.log("data saved");
   
  } catch (error) {
       console.error('CRON-error', error.message);
      
  }
})

cron.schedule(('0 0 1 * *'),async()=>{
  try {
    await dailyfootfall.deleteMany();
  } catch (error) {
    console.error(error.message);
  }
  
})


let isRunning = false

// cron.schedule('*/10 * * * * *',async ()=>{

//  if (isRunning) {
//   console.log("Previous job still running, skipping this run.");
//   return;
// }
// isRunning = true;

// try {
//       const response = await axios.get(process.env.API_URLZ, { 
//     headers: {
//       'XApiKey': process.env.API_KEY
//     }
//   })
//  // console.log(response.data.students);
//   const students = response.data.students || [];

//  const latest  = await members.find();

//  // console.log(latest);
// //  console.log(latest.length);
// //  console.log(students.length);

 

//   //members.insertMany(students).then(()=>console.log("student inserted")).catch((err)=>console.log("error"))

//   // const PRN = response.data.data.rollNo;
//   // const fullname  = response.data.data.name;
//   // const purpose = response.data.data.purpose;

//           if (latest.length === 0) {
//         console.log("Initial population — inserting all students.");
//         await members.insertMany(students);
//         await lifetime.insertMany(students); // createdAt will be auto-generated
//         return;
//       }

//       const normalizePRN = prn => String(prn).trim();

//       const oldPRNs = new Set(latest.map(user => normalizePRN(user.PRN)));
//       const newPRNs = new Set(students.map(user => normalizePRN(user.PRN)));

//       const came = students.filter(user => !oldPRNs.has(normalizePRN(user.PRN)));
//       const left = latest.filter(user => !newPRNs.has(normalizePRN(user.PRN)));

//       // ✅ Debounce: skip logging same student if they came within last 30s
//       const filteredCame = [];

//       for (const s of came) {
//         const lastVisit = await lifetime.findOne(
//           { PRN: s.PRN },
//           {},
//           { sort: { createdAt: -1 } }
//         );

//         const now = Date.now();
//         const lastTime = lastVisit ? new Date(lastVisit.createdAt).getTime() : 0;

//         if (!lastVisit || now - lastTime >= 60000) {
//           filteredCame.push(s); // Don't need to add createdAt manually
//         } else {
//           console.log(`⏱️ Skipped duplicate visit by ${s.name} within 30s`);
//         }
//       }

//       if (came.length === 0 && left.length === 0) {
//         console.log("✅ working good — no change");
//       } else {
//         if (filteredCame.length > 0) {
//           console.log(
//             `➕ ${filteredCame.length} student(s) came:`,
//             filteredCame.map(s => s.name)
//           );
//           await lifetime.insertMany(filteredCame);
//         }
//         if (left.length > 0) {
//           console.log(`➖ ${left.length} student(s) left:`, left.map(s => s.name));
//         }
//       }

//       // ✅ Upsert current members
//       await Promise.all(
//         students.map(s =>
//           members.updateOne(
//             { PRN: s.PRN },
//             { $set: s },
//             { upsert: true }
//           )
//         )
//       );

//       // ✅ Remove students no longer present
//       await members.deleteMany({
//         PRN: { $nin: students.map(s => s.PRN) }
//       });



// }catch(error){
//   console.log("no data found");
// }finally {
//   isRunning = false;
// }




// })

// data routes
// app.get('/fetch', async (req, res) => {
//   try {
//     const all = await members.find().sort({ createdAt: 1 });
//     res.json(all);
//   } catch (err) {
//     res.status(500).json({ error: 'student data not found' });
//   }
// });

app.get('/fetch',async(req,res)=>{
  try {
    const readers = await livefeed.find().sort({ _id: -1 });
;
    res.json(readers);
  } catch (error) {
    res.json({success: false, message: "data cant be fetched"});
  }
  
})


// app.post('/submit',async (req,res)=>{
//     console.log(req.body);
//     const readers =await livefeed.findOne({PRN: { $regex: `^${req.body.PRN}$`, $options: "i" }});
//     if (readers.length>0){
//       await livefeed.deleteOne({ PRN: { $regex: `^${req.body.PRN}$`, $options: "i" } });
//        res.json({ success: true, message: "Student removed!" });
//     }else{
//       const fetchname = await festudents.findOne({PRN:(req.body.PRN).toUpperCase()});
//       if(fetchname){
//         const name = fetchname.name;
//       console.log(name);
//        const student=new livefeed({PRN:req.body.PRN, name:name ,purpose:req.body.purpose});
//        await student.save();
//         const parth=new lifetime({PRN:req.body.PRN, name:name ,purpose:req.body.purpose});
//         await parth.save();
       
//     //console.log("data saved");
//     res.json({ success: true, message: "Student inserted" });
//       }else{
//          res.json({ success: false, message: "PRN is invalid" });
//       }
      
//     }
   
// })

app.post('/submit', async (req, res) => {
  try {
    const prn = req.body.PRN.toUpperCase(); // normalize PRN once
    const purpose = req.body.purpose;

    // Try to remove student from livefeed in one go
    const removed = await livefeed.findOneAndDelete({ PRN: prn });

    if (removed) {
      return res.json({ success: true, message: "Student removed!" });
    }

    // If not in livefeed, check in festudents
    const fetchname = await festudents.findOne({ PRN: prn }, { name: 1 });
    if (!fetchname) {
      return res.json({ success: false, message: "PRN is invalid" });
    }

    // Insert into livefeed + lifetime
    const studentData = { PRN: prn, name: fetchname.name, purpose };
    await Promise.all([
      new livefeed(studentData).save(),
      new lifetime(studentData).save()
    ]);

    res.json({ success: true, message: "Student inserted" });

  } catch (err) {
    console.error("Error in /submit:", err);
    res.status(500).json({ success: false, message: "Server error" });
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
// app.post('/api/save', async (req, res) => {
//   const { name, PRN, password,islibrary } = req.body;
//   console.log(islibrary);
//   if (name) {
//     if (await Users.findOne({ PRN }))
//       return res.status(401).json({ success: false, message: 'User exists' });
//     const checkname = await festudents.findOne({PRN})
//     if(checkname && checkname.name.trim().toLowerCase() === name.trim().toLowerCase()){
//           const user = new Users({ name, PRN, password });
//           await user.save();
//           const token = jwt.sign({ PRN }, JWT_SECRET, { expiresIn: '1h' });
//           return res.json({ success: true, message: 'Signup successful', token, name ,PRN });
//     }else{
//       return res.status(401).json({ success: false, message: 'Your name and PRN does not match with the college database. Please provide your correct name and corresponding PRN as written in the ID Card' });
//     }

//   } else {
//     const user = await Users.findOne({ PRN });
//     if (!user) return res.status(401).json({ success: false, message: 'User not found' });
//     if (user.password !== password)
//       return res.status(401).json({ success: false, message: 'Wrong password' });
//     const token = jwt.sign({ PRN }, JWT_SECRET, { expiresIn: '1h' });
//     return res.json({ success: true, message: 'Login successful', token, name: user.name, PRN:user.PRN });
//   }
// });

app.post('/api/save', async (req, res) => {
  const { name, PRN, password, islibrary } = req.body; // use islibrary flag

  // Signup flow
  if (name) {
    if (await Users.findOne({ PRN }))
      return res.status(401).json({ success: false, message: 'User exists' });

    const checkname = await festudents.findOne({ PRN });
    if (checkname && checkname.name.trim().toLowerCase() === name.trim().toLowerCase()) {
      const user = new Users({ name, PRN, password });
      await user.save();

      // Token expiry based on usage
      const token = jwt.sign(
        { PRN, type: islibrary ? 'library' : 'normal' },
        JWT_SECRET,
        { expiresIn: islibrary ? '12h' : '1h' }
      );

      return res.json({
        success: true,
        message: 'Signup successful',
        token,
        name,
        PRN
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Your name and PRN does not match with the college database. Please provide your correct name and corresponding PRN as written in the ID Card'
      });
    }
  } 
  // Login flow
  else {
    // PRN = (PRN.toUpperCase()).trim();
    const user = await Users.findOne({ PRN });
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    if (user.password !== password)
      return res.status(401).json({ success: false, message: 'Wrong password' });

    const token = jwt.sign(
      { PRN, type: islibrary ? 'library' : 'normal' },
      JWT_SECRET,
      { expiresIn: islibrary ? '12h' : '1h' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      name: user.name,
      PRN: user.PRN
    });
  }
});



// token validation
// app.get('/validate', async (req, res) => {
//   const h = req.headers.authorization;
//   if (!h) return res.status(401).json({ valid: false });
//   const token = h.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await Users.findOne({ PRN: decoded.PRN });
//     if (!user) return res.status(401).json({ valid: false });
//     res.json({ valid: true, name: user.name , PRN:user.PRN});
//   } catch {
//     res.status(401).json({ valid: false });
//   }
// });


app.get('/validate', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Users.findOne({ PRN: decoded.PRN });
    if (!user) return res.status(401).json({ valid: false });

    res.json({
      valid: true,
      name: user.name,
      PRN: user.PRN,
      type: decoded.type // 'library' or 'normal'
    });
  } catch (err) {
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

app.get('/download/:sem/:subject/:year/:filename', async (req, res) => {
  const { sem, subject, year, filename } = req.params;
  try {
    const { success, url, error } = await getSignedUrl(`qps/${sem}/${subject}/${year}/${filename}`);
    if (success) return res.json({ success: true, downloadUrl: url });
    else return res.status(404).json({ success: false, message: 'File not found', error });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating download URL', error: err.message });
  }
});

app.get('/api/hourlyfootfall', async (req, res) => {
  // try {
  //   const start = new Date();
  //   start.setHours(0, 0, 0, 0);  // today at midnight

  //   const end = new Date(start);
  //   end.setDate(start.getDate() + 1); // tomorrow at midnight

  //   // const data = await lifetime.find({
  //   //   createdAt: { $gte: start, $lt: end }
  //   // }).sort({ createdAt: 1 });

  //    const data = await lifetime.countDocuments({
  //     createdAt: { $gte: start, $lt: end }
  //   }).sort({ createdAt: 1 });

  //   res.json({footfall:data});
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: 'Error fetching footfall data' });
  // }
  
  try {
    const data = await footfall();
    res.json({footfall:data})
  } catch (error) {
    res.status(500).json({ message: 'Error fetching footfall data' });
  }
});


app.get('/api/dailyfootfall', async (req, res) => {
  try {
    const data = await dailyfootfall.find().sort({timestamp:1});
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching footfall data' });
  }
});

app.get('/api/hourlyfootfalls', async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);  // today at midnight

    const end = new Date(start);
    end.setDate(start.getDate() + 1); // tomorrow at midnight


     const data = await hourlyfootfall.find({
      timestamp: { $gte: start, $lt: end }
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching footfall data' });
  }
});


app.get('/timetable', async(req,res)=>{
  try {
    const data  = await timetable.find();
    res.json(data);
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching footfall data' });
  }
})


// static React build for client-side routing
const staticPath = path.join(__dirname, '../LibraryManage/dist');
console.log('📁 Static files path:', staticPath);
console.log('📁 Static path exists:', fs.existsSync(staticPath));

app.use(express.static(staticPath));

// catch-all fallback to serve React app
app.use((req, res) => {
  const indexPath = path.join(__dirname, '../LibraryManage/dist/index.html');
  console.log('📄 Serving index.html from:', indexPath);
  console.log('📄 Index file exists:', fs.existsSync(indexPath));
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
