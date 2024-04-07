// import express from 'express';
// import multer from 'multer';
// import fs from 'fs';
// import Publication from '../../models/publications.js';
// import History from '../../models/history.js';
// import Verify from '../../middleware/verfyAllRoutes.js'
// const historyRouter = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const newPublicationId = 'publication-' + Date.now();
//     const publicationsPath = `public/publications_images/${newPublicationId}`;

//     fs.mkdirSync(publicationsPath, { recursive: true });
   
//         cb(null, publicationsPath);
 
//    },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 3000000 }, // File size limit: 1MB
// }).fields([
//   { name: 'image', maxCount: 1 },
//   { name: 'file', maxCount: 1 },
// ]);

// historyRouter.post('/add-history', (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       res.status(500).json({ error: 'An error occurred while uploading' });
//     } else {
//       const { title, p_investigator, author, description, field_of_study, date } = req.body;
//       let filePath = '';
//       let imagePath = 'public\\images\\noimage.png';

//       if(req.files['file']) {
//         filePath = req.files['file'][0].path; 
//        console.log(filePath)
//        }
                   
//        if (req.files['image']){ 
//        imagePath =  req.files['image'][0].path; 
//        console.log(imagePath) }

//       const serverUrl = 'https://research-portal-server-9.onrender.com'; 

//       // Process image path
//       const cleanImagePath = imagePath.replace(/\\/g, '/').split('public/').pop();
//       const imagePaths = serverUrl + '/' + cleanImagePath;  

//       // Process file path
//       const cleanFilePath = filePath.replace(/\\/g, '/').split('public/').pop();
//       const filePaths = serverUrl + '/' + cleanFilePath;     


//       try {
//         const newPublication = new History({
//           title,
//           p_investigator,
//           author,
//           description,
//           field_of_study,
//           date,
//           imagePath: imagePaths,
//           filePath: filePaths,
//         });

//         const savedPublication = await newPublication.save();
//         res.json(savedPublication);
//       } catch (error) {
//         console.error('An error occurred while saving to the database:', error);
//         res.status(500).json({ error: 'An error occurred while saving to the database' });
//       }
//     }
//   });
// });

// export default historyRouter;


import express from 'express';
import multer from 'multer';
import History from '../../models/history.js';

const historyRouter = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

historyRouter.post('/add-history', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, p_investigator, author, description, field_of_study, date } = req.body;
    let fileString = '';
    let imageString = '';

    if (req.files['file']) {
      // Convert file buffer to base64 string
      fileString = req.files['file'][0].buffer.toString('base64');
    }

    if (req.files['image']) {
      // Convert image buffer to base64 string
      imageString = req.files['image'][0].buffer.toString('base64');
    }

    // Create a new history object with file strings
    const newPublication = new History({
      title,
      p_investigator,
      author,
      description,
      field_of_study,
      date,
      fileString,
      imageString
    });

    // Save the history object to the database
    const savedPublication = await newPublication.save();
    res.json(savedPublication);
  } catch (error) {
    console.error('An error occurred while saving to the database:', error);
    res.status(500).json({ error: 'An error occurred while saving to the database' });
  }
});

export default historyRouter;

