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
import fs from 'fs';
import History from '../../models/history.js';

const historyRouter = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Destination folder for publications
    const publicationsPath = 'public/publications_images';

    // Create the publications folder if it doesn't exist
    if (!fs.existsSync(publicationsPath)) {
      fs.mkdirSync(publicationsPath, { recursive: true });
    }

    cb(null, publicationsPath);
  },
  filename: (req, file, cb) => {
    // Use original filename
    cb(null, file.originalname);
  },
});

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 }, // File size limit: 3MB
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]);

// POST route to add a new history
historyRouter.post('/add-history', (req, res) => {
  // Handle file upload
  upload(req, res, async (err) => {
    if (err) {
      // If error occurs during file upload
      res.status(500).json({ error: 'An error occurred while uploading' });
    } else {
      try {
        // Extract data from request body
        const { title, p_investigator, author, description, field_of_study, date } = req.body;

        // Default paths for image and file
        let imagePath = 'public/images/noimage.png';
        let filePath = '';

        // Check if image file exists
        if (req.files['image']) {
          imagePath = req.files['image'][0].path;
        }

        // Check if file exists
        if (req.files['file']) {
          filePath = req.files['file'][0].path;
        }

        // Construct full server URLs for image and file paths
        const serverUrl = 'https://research-portal-server-9.onrender.com';
        const cleanImagePath = imagePath.replace(/\\/g, '/').split('public/').pop();
        const imagePaths = serverUrl + '/' + cleanImagePath;
        const cleanFilePath = filePath.replace(/\\/g, '/').split('public/').pop();
        const filePaths = serverUrl + '/' + cleanFilePath;

        // Create a new history object
        const newHistory = new History({
          title,
          p_investigator,
          author,
          description,
          field_of_study,
          date,
          imagePath: imagePaths,
          filePath: filePaths,
        });

        // Save the history object to the database
        const savedHistory = await newHistory.save();
        
        // Send response with saved history object
        res.json(savedHistory);
      } catch (error) {
        // If error occurs during database operation
        console.error('An error occurred while saving to the database:', error);
        res.status(500).json({ error: 'An error occurred while saving to the database' });
      }
    }
  });
});

export default historyRouter;
