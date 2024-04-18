import express from 'express';
import multer from 'multer';
import fs from 'fs';
import Publication from '../../models/publications.js';
import History from '../../models/history.js';
import Verify from '../../middleware/verfyAllRoutes.js'
const historyRouter = express.Router();
// const __dirname = "public";
// const storage = multer.diskStorage({
//   // destination: (req, file, cb) => {
//   //   const newPublicationId = 'publication-' + Date.now();
//   //   const publicationsPath = `public/publications_images/${newPublicationId}`;

//   //   fs.mkdirSync(publicationsPath, { recursive: true });
   
//   //       cb(null, publicationsPath);
 
//   //  },
//   // filename: (req, file, cb) => {
//   //   cb(null, file.originalname);
//   // },
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, 'uploads'));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 3000000 }, // File size limit: 1MB
// }).fields([
//   { name: 'image', maxCount: 1 },
//   { name: 'file', maxCount: 1 },
// ]);
// const upload = multer({ storage });

historyRouter.post('/add-history', async(req, res) => {
  // upload(req, res, async (err) => {
    // if (err) {
    //   res.status(500).json({ error: 'An error occurred while uploading' });
    // } else {

      const title=req.body.title
      const  p_investigator=req.body.p_investigator;
      const author=req.body.author
      const description=req.body.description;
      const field_of_study=req.body.field_of_study
      const funding_source=req.body.funding_source;
      const date=req.body.date;
      const file=req.body.file;
      const image=req.body.image

    //   let filePath = '';
    //   let imagePath = 'public\\images\\noimage.png';

    //   if(req.files['file']) {
    //     filePath = req.files['file'][0].path; 
    //    console.log(filePath)
    //    }
                   
    //    if (req.files['image']){ 
    //    imagePath =  req.files['image'][0].path; 
    //    console.log(imagePath) }

      // const serverUrl = 'https://research-portal-server-9.onrender.com'; 

      // // Process image path
      // const cleanImagePath = imagePath.replace(/\\/g, '/').split('public/').pop();
      // const imagePaths = serverUrl + '/' + cleanImagePath;  

      // // Process file path
      // const cleanFilePath = filePath.replace(/\\/g, '/').split('public/').pop();
      // const filePaths = serverUrl + '/' + cleanFilePath;     


      try {
        const newPublication = await History.create({
          title:title,
          p_investigator:p_investigator,
          author:author,
          description:description,
          field_of_study:field_of_study,
          date:date,
          funding_source:funding_source,
          imagePath:image,
          filePath: file,
        });

        //const savedPublication = await newPublication.save();
        res.json('history created', newPublication);
      } catch (error) {
        console.error('An error occurred while saving to the database:', error);
        res.status(500).json({ error: 'An error occurred while saving to the database' });
      }
    }
  // });
);

export default historyRouter;
